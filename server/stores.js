const debug = require('debug')('speak-langs:stores')
const persist = require('node-persist')

const users = persist.create({
  dir: '.node-persist/users'
})
users.init().catch(debug)

const rooms = persist.create({
  dir: '.node-persist/rooms'
})
rooms.init()
.then(() => {
  rooms.getItem('general')
  .then(room => {
    if(!room) {
      rooms.setItem('general', {
        name: '# general',
        datetime: Date.now()
      })
    }
  })
})
.catch(debug)

module.exports = {
  users,
  rooms,
}