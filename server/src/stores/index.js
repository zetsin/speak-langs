const path = require('path')

const debug = require('debug')('speak-langs:stores')
const persist = require('node-persist')

const rooms = persist.create({
  dir: '.node-persist/rooms'
})
rooms.init()
.then(() => {
  rooms.getItem('general')
  .then(room => {
    if(!room) {
      rooms.setItem('general', {
        name: 'general',
        topic: 'Random topic room',
        priority: 1,
        created: Date.now() * 2
      })
    }
  })
})
.catch(debug)

const users = persist.create({
  dir: '.node-persist/users',
})
users.init().catch(debug)

const local = (storage='', opts={}) => {
  return new Promise((resolve, reject) => {
    const localStorage = persist.create({
      dir: path.join('.node-persist', storage),
      ttl: 1000 * 60 * 60 * 24 * 30,
      expiredInterval: 1000 * 60 * 60 * 24,
      ...opts,
    })

    localStorage.init()
    .then(() => resolve(localStorage))
    .catch(reject)
  })
}

module.exports = {
  rooms,
  users,
  local,
}