const debug = require('debug')('speak-langs:io')
const sio = require('socket.io')
const createError = require('http-errors')
const persist = require('node-persist')
const fs = require('fs')
const stores = require('stores')
const google = require('utils/google')

module.exports = app => {
  const io = sio(app.get('server'))
  const nsp = io.of('/io')

  const acl = ['+room', '>message']

  nsp.use((socket, next) => {
    const passport = socket.request.session.passport
    if(passport && passport.user) {
      stores.users.getItem(passport.user.id)
      .then(user => {
        socket.user = user
        next()
      })
      .catch(next)
    }
    else {
      next()
    }
  })
  nsp.on('connection', socket => {
    socket.emit('user', socket.user)
    Promise.all([stores.rooms.keys(), stores.rooms.values()])
    .then(([keys, values]) => {
      socket.emit('rooms', keys.reduce((pre, cur, index) => {
        return {
          ...pre,
          [cur]: values[index]
        }
      }, {}))
      
      Promise.all(keys.map((key, index) => new Promise((resolve, reject) => {
        nsp.in(key).clients((err, clients) => err ? reject(err) : resolve({
          [key]: clients.reduce((pre, cur) => {
            return {
              ...pre,
              [cur]: 0
            }
          }, {})
        }))
      })))
      .then(groups => {
        socket.emit('groups', groups.reduce((pre, cur) => {
          return {
            ...pre,
            ...cur
          }
        }, {}))
      })
      .catch(debug)
      
    })
    .catch(debug)

    socket.use((packet, next) => {
      if(acl.includes(packet[0])) {
        if(!socket.user) {
          socket.emit('user', {
            id: 0
          })
          return next(createError(401, 'UNAUTHORIZED'))
        }
      }
      next()
    })

    socket.on('<user', id => {
      stores.users.getItem(`${id}`)
      .then(user => {
        socket.emit('users', {
          [id]: user
        })
      })
      .catch(debug)
    })
    socket.on('+room', room => {
      new Promise((resolve, reject) => {
        room = {
          ...room,
          creator: socket.user ? socket.user.id : 0,
          created: Date.now()
        }
        if(room.platform === 0) {
          room.link = `https://appear.in/${Math.random().toString(32).slice(2)}`
        }
        else if(room.platform === 1) {
          return google().then(link => {
            room.link = link
            resolve(room)
          })
          .catch(debug)
        }
        resolve(room)
      })
      .then(room => {
        const id = socket.user ? socket.user.id : Math.random().toString(32).slice(2)
        stores.rooms.setItem(id, room)
        nsp.emit('rooms', {
          [id]: room
        })
      })
    })
    socket.on('>room', id => {
      stores.rooms.getItem(id)
      .then(room => {
        const join = () => {
          socket.join(id, () => {
            nsp.emit('groups', {
              [id]: {
                [socket.id]: socket.user ? socket.user.id : 0
              }
            })
          })
        }

        return Promise.resolve().then(() => {
          if(room.maximum) {
            nsp.in(id).clients((err, clients) => {
              if(err) {
                return Promise.reject(err)
              }

              if(clients.length >= room.maximum) {
                return socket.emit('err', 'No More Space')
              }
              join()
            })
          }
          else {
            join()
          }
        })
      })
      .catch(debug)
    })
    socket.on('<room', id => {
      socket.leave(id, () => {
        nsp.emit('groups', {
          [id]: {
            [socket.id]: -1
          }
        })
      })
    })
    socket.on('>message', (room, data) => {
      if(Object.keys(socket.rooms).includes(room)) {
        nsp.to(room).emit('messages', {
          [room]: {
            [Math.random().toString(32).slice(2)]: {
              uid: socket.user.id,
              data
            }
          }
        })
      }
      else {
        socket.emit('err', 'You are not in the room')
      }
    })
    socket.on('disconnecting', (reason) => {
      const groups = {}
      Object.keys(socket.rooms).map(room => {
        groups[room] = {
          [socket.id]: null
        }
      })
      nsp.emit('groups', groups)
    })
  })

  return io
}
