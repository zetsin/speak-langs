import createDebug from 'debug'
import sio from 'socket.io-client'

import { App, User, Users, Rooms, Groups, Messages } from 'stores'
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
        dispatch(Rooms.update(rooms))

        const rid =  window.location.pathname.slice(1)
        const room = rooms[rid]
        if(room) {
          dispatch(Rooms.join(rid))
        }
      })
      .on('groups', groups => {
        debug('groups', groups)
        const states = getState()

        Object.keys(groups).forEach(rid => {
          const group = groups[rid]
          Object.keys(group).forEach(id => {
            const uid = group[id]
            if(uid !== -1) {
              dispatch(Users.get(uid))

              if(uid !== 0) {
                if(Object.values(states.groups[rid] || {}).includes(uid)) {
                  group[id] = -1
                }
              }

              const room = states.rooms[rid]
              if(room && room.link && io.id === id) {
                window.open(room.link)
              }
            }
          })
        })
        dispatch(Groups.update(groups, true))
      })
      .on('messages', messages => {
        debug('messages', messages)
        dispatch(Messages.update(messages, true))

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