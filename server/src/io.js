const fs = require('fs')

const debug = require('debug')('speak-langs:io')
const sio = require('socket.io')
const createError = require('http-errors')

const storage = require('./storage')
const google = require('./utils/google')

module.exports = app => {
  const io = sio(app.get('server'))
  const nsp = io.of('/io')

  const acl = ['+room', '>message']

  nsp.use((socket, next) => {
    const passport = socket.request.session.passport
    if(passport && passport.user) {
      storage.users.get(passport.user.id)
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
    storage.rooms.valueOf()
    .then(rooms => {
      socket.emit('rooms', rooms)
      
      Promise.all(Object.keys(rooms).map((key, index) => new Promise((resolve, reject) => {
        nsp.in(key).clients((err, clients) => err ? reject(err) : resolve({
          [key]: clients.reduce((pre, cur) => {
            const user = nsp.sockets[cur].user
            return {
              ...pre,
              [cur]: user ? user.id : 0
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
      storage.users.get(`${id}`)
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
        storage.rooms.set(id, room)
        nsp.emit('rooms', {
          [id]: room
        })
      })
    })
    socket.on('>room', id => {
      if(Object.keys(socket.rooms).includes(id)) {
        return
      }
      storage.rooms.get(id)
      .then(room => {
        const join = () => {
          socket.join(id, () => {
            nsp.emit('groups', {
              [id]: {
                [socket.id]: socket.user ? socket.user.id : 0
              }
            })

            storage.messages(id).valueOf()
            .then(messages => {
              socket.emit('messages', {
                [id]: messages
              })
            })
            .catch(debug)
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
      if(!Object.keys(socket.rooms).includes(id)) {
        return
      }

      socket.leave(id, () => {
        nsp.emit('groups', {
          [id]: {
            [socket.id]: -1
          }
        })
      })
    })
    socket.on('+message', (room, data) => {
      if(!Object.keys(socket.rooms).includes(room)) {
        return socket.emit('err', 'You are not in the room')
      }

      const id = Math.random().toString(32).slice(2)
      const message = {
        uid: socket.user.id,
        data,
        created: Date.now()
      }
      nsp.to(room).emit('messages', {
        [room]: {
          [id]: message
        }
      })

      storage.messages(room).set(id, message)
    })
    socket.on('disconnecting', (reason) => {
      const groups = {}
      Object.keys(socket.rooms).map(room => {
        groups[room] = {
          [socket.id]: -1
        }
      })
      nsp.emit('groups', groups)
    })
  })

  return io
}
