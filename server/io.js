const sio = require('socket.io')
const createError = require('http-errors')

class Rooms {
  constructor(nsp) {
    this.nsp = nsp
    this.rooms = {}
    this.add({
      name: '# general'
    }, {
      id: 'general'
    })
    this.add({
      name: '# random'
    }, {
      id: 'random'
    })
  }
  all() {
    Object.keys(this.rooms).map(id => {
      this.rooms[id].length = this.nsp.adapter.rooms[id] ? this.nsp.adapter.rooms[id].length : 0
    })
    return this.rooms
  }
  add(props={}, ext={}) {
    const id = ext.id || Math.random().toString(32).slice(2)
    this.rooms[id] = {
      ...props,
      length: 0,
      ext,
    }
    return id
  }
  get(id) {
    const room = this.rooms[id]
    if(room) {
      room.length = this.nsp.adapter.rooms[id] ? this.nsp.adapter.rooms[id].length : 0
      return {
        ...room,
        ext: undefined,
      }
    }
  }
}

module.exports = app => {
  const io = sio(app.get('server'))
  const nsp = io.of('/io')
  const rooms = new Rooms(nsp)

  nsp.use((socket, next) => {
    console.log(socket.request.session)
    if(socket.request.session && socket.request.session.passport) {
      socket.user = socket.request.session.passport.user
    }
    return socket.user ? next() : next(new Error('401'))
  })
  nsp.on('connection', socket => {
    socket.use((packet, next) => {
      // if (packet.doge === true) return next();
      // next(new Error('Not a doge error'));
      console.log(socket.user)
      next()
    })

    if(socket.user) {
      socket.emit('user', socket.user)
    }
    socket.emit('rooms', rooms.all())

    socket.on('+room', props => {
      const id = rooms.add(props)
      socket.join(id, () => {
        nsp.emit('rooms', {
          [id]: rooms.get(id)
        })
      })
    })
    socket.on('>room', id => {
      const room = rooms.get(id)
      if(room) {
        socket.join(id, () => {
          nsp.emit('rooms', {
            [id]: rooms.get(id)
          })
        })
      }
    })
    socket.on('<room', id => {
      const room = rooms.get(id)
      if(room) {
        socket.leave(id, () => {
          nsp.emit('rooms', {
            [id]: rooms.get(id)
          })
        })
      }
    })
  })

  return io
}
