const sio = require('socket.io')
const createError = require('http-errors')

module.exports = app => {
  const io = sio(app)

  io.of('/io')
  .use((socket, next) => {
    return socket.request.session ? next() : next(createError(401, 'Authentication error'))
  })
  .on('connect', socket => {
    socket.emit('session', socket.request.session)
  })
  .on('test', socket => {
    socket.emit('test', socket.request.session)
  })

  return io
}
