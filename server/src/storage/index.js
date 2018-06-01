const storage = require('./storage')()

const rooms = storage('rooms')
rooms.get('general')
.then(room => {
  if(!room) {
    rooms.set('general', {
      name: 'general',
      topic: 'Random topic room',
      priority: 1,
      created: Date.now() * 2
    })
    .then(() => {
    })
  }
})

const users = storage('users')

const messages = storage('messages', {
  max: 100
})

module.exports = {
  rooms,
  users,
  messages,
}