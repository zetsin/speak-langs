const io = require('socket.io')
const createError = require('http-errors')

module.exports = app => {
  io(app)
  .of('io')
  .use((socket, next) => {
    return socket.request.user ? next() : next(createError(401, 'Authentication error'))
  })
  .on('connect', socket => {
    socket.emit('user', socket.request.user)
  })
}
