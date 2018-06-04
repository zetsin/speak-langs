import createDebug from 'debug'
import sio from 'socket.io-client'

import { App, User, Users, Rooms, Messages } from 'stores'
import config from 'config'

const debug = createDebug('speak-langs:app')

export default {
  state: {
    message: '',
    search: '',
    sider_open: false,
    asider_open: false,
    dialog_open: false,
    type: 'light',
  },

  actions: {
    connect: function() {
      const { dispatch, getState } = this

      const io = window.io = sio(`${config.server}/io`)
      io.on('error', err => {
        debug('error', err)
        dispatch(App.update({
          message: err
        }))
      })
      .on('err', err => {
        debug('err', err)
        dispatch(App.update({
          message: err
        }))
      })
      .on('user', user => {
        debug('user', user)
        dispatch(User.update(user))
      })
      .on('users', users => {
        debug('users', users)
        dispatch(Users.update(users))
      })
      .on('rooms', rooms => {
        debug('rooms', rooms)

        const rid =  window.location.pathname.slice(1)
        const room = rooms[rid]
        if(room) {
          dispatch(Rooms.join(rid))
        }

        const states = getState()

        Object.keys(rooms).forEach(rid => {
          const clients = rooms[rid].clients || {}
          Object.keys(clients).forEach(cio => {
            const uid = clients[cio]
            if(uid === -1) {
              return
            }
            dispatch(Users.get(uid))

            const _room = states.rooms[rid] || {}
            if(_room.link && cio === io.id) {
              window.open(_room.link)
            }

            if(uid === 0) {
              return
            }

            const _clients = _room.clients || {}
            Object.keys(_clients).forEach(cio => {
              if(_clients[cio] === uid) {
                clients[cio] = -1
              }
            })
          })
        })
        
        dispatch(Rooms.update(rooms))
      })
      .on('messages', messages => {
        debug('messages', messages)
        dispatch(Messages.update(messages))

        Object.keys(messages).forEach(rid => {
          const conversation = messages[rid]
          Object.values(conversation).forEach(message => {
            dispatch(Users.get(message.uid))
          })
        })
      })
    },
    update: function(data={}) {
      const { dispatch } = this

      dispatch({
        type: 'app/save',
        payload: data
      })
    },
  },

  reducers: {
    save: (state, payload) => {
      return {
        ...state,
        ...payload
      }
    }
  }
}