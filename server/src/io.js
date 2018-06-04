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
  const db = app.get('db')

  nsp.use((socket, next) => {
    const passport = socket.request.session.passport
    if(passport && passport.user) {
      db.collection('users')
      .findOne({
        _id: passport.user.id
      })
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
    db.collection('rooms')
    .find({})
    .toArray()
    .then(rooms => {
      return Promise.all(rooms.map(room => new Promise((resolve, reject) => {
        nsp.in(room._id).clients((err, clients) => err ? reject(err) : resolve({
          ...room,
          clients: {
            ...clients.reduce((pre, cur) => {
              const user = nsp.sockets[cur].user
              return {
                ...pre,
                [cur]: user ? user.id : 0
              }
            }, {})
          }
        }))
      })))
      .then(rooms => {
        rooms = rooms.reduce((pre, cur) => {
          return {
            ...pre,
            [cur._id]: cur,
          }
        }, {})

        socket.emit('rooms', rooms)
      })
      
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

    socket.on('<user', _id => {
      db.collection('users')
      .findOne({
        _id
      })
      .then(user => {
        socket.emit('users', {
          [_id]: user
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
        const _id = socket.user ? socket.user.id : Math.random().toString(32).slice(2)
        db.collection('rooms')
        .updateOne({}, {
          _id,
          ...room,
        }, {
          upsert: true
        })
        nsp.emit('rooms', {
          [_id]: room
        })
      })
    })
    socket.on('>room', rid => {
      if(Object.keys(socket.rooms).includes(rid)) {
        return
      }
      db.collection('rooms')
      .findOne({
        _id: rid
      })
      .then(room => {
        const join = () => {
          socket.join(rid, () => {
            nsp.emit('rooms', {
              [rid]: {
                clients: {
                  [socket.id]: socket.user ? socket.user.id : 0
                }
              }
            })

            // db.collection('messages')
            // .find({
            //   rid
            // })
            // .toArray()
            // .then(messages => {
            //   messages = messages.reduce((pre, cur) => {
            //     return {
            //       ...pre,
            //       [cur._id]: cur,
            //     }
            //   }, {})
            //   socket.emit('messages', {
            //     [rid]: messages
            //   })
            // })
            // .catch(debug)
          })
        }

        return Promise.resolve().then(() => {
          if(!room) {
            return
          }
          if(room.maximum) {
            nsp.in(rid).clients((err, clients) => {
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
    socket.on('<room', rid => {
      if(!Object.keys(socket.rooms).includes(rid)) {
        return
      }

      socket.leave(rid, () => {
        nsp.emit('rooms', {
          [rid]: {
            clients: {
              [socket.id]: -1
            }
          }
        })
      })
    })
    socket.on('+message', (rid, data) => {
      if(!Object.keys(socket.rooms).includes(rid)) {
        return socket.emit('err', 'You are not in the room')
      }

      const _id = Math.random().toString(32).slice(2)
      const message = {
        uid: socket.user.id,
        data,
        created: Date.now()
      }
      nsp.to(rid).emit('messages', {
        [rid]: {
          [_id]: message
        }
      })

      db.collection('messages')
      .updateOne({}, {
        ...message,
        rid,
        _id,
      })
    })
    socket.on('disconnecting', (reason) => {
      nsp.emit('rooms', Object.keys(socket.rooms).reduce((pre, cur) => {
        return {
          ...pre,
          [cur]: {
            clients: {
              [socket.id]: -1
            }
          }
        }
      }, {}))
    })
  })

  return io
}
