const debug = require('debug')('speak-langs:io')
const sio = require('socket.io')
const createError = require('http-errors')
const persist = require('node-persist')
const fs = require('fs')
const stores = require('./stores')

module.exports = app => {
  const io = sio(app.get('server'))
  const nsp = io.of('/io')

  const auth = ['>message']

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
      if(auth.includes(packet[0])) {
        if(!socket.user) {
          return next(createError(401, 'UNAUTHORIZED'))
        }
      }
      next()
    })

    socket.on('<user', id => {
      stores.users.getItem(id)
      .then(user => {
        socket.emit('users', {
          [id]: user
        })
      })
      .catch(debug)
    })
    socket.on('+room', room => {
      const id = Math.random().toString(32).slice(2)
      room = {
        ...room,
        datetime: Date.now()
      }
      socket.join(id, () => {
        stores.rooms.setItem(id, room)
        nsp.emit('rooms', {
          [id]: room
        })
      })
    })
    socket.on('>room', id => {
      stores.rooms.getItem(id)
      .then(room => {
        socket.join(id, () => {
          nsp.emit('groups', {
            [id]: {
              [socket.id]: socket.user ? socket.user.id : 0
            }
          })
        })
      })
      .catch(debug)
    })
    socket.on('<room', id => {
      stores.rooms.getItem(id)
      .then(room => {
        socket.leave(id, () => {
          nsp.emit('groups', {
            [id]: {
              [socket.id]: null
            }
          })
        })
      })
      .catch(debug)
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
