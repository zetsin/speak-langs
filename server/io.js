const sio = require('socket.io')
const createError = require('http-errors')

module.exports = app => {
  const io = sio(app)

  io.of('/io')
  .use((socket, next) => {
    if(socket.request.session.passport) {
      socket.user = socket.request.session.passport.user
    }
    return socket.user ? next() : next(createError(401, 'Authentication error'))
  })
  .on('connect', socket => {
    socket.emit('user', socket.user)
  })

  return io
}
