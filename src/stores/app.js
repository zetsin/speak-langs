import url from 'url'

import sio from 'socket.io-client'
import { App, User, Users, Rooms, Groups, Messages } from 'stores'

export default {
  state: {
    inited: false,
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

      const io = window.io = sio(url.resolve(process.env.REACT_APP_SERVER || '', '/io'))
      io.on('error', err => {
        console.log('error', err)
        dispatch(App.update({
          message: err
        }))
      })
      .on('err', err => {
        console.log('err', err)
        dispatch(App.update({
          message: err
        }))
      })
      .on('user', user => {
        console.log('user', user)
        dispatch(User.update(user))
      })
      .on('users', users => {
        console.log('users', users)
        dispatch(Users.update(users))
      })
      .on('rooms', rooms => {
        console.log('rooms', rooms)
        dispatch(Rooms.update(rooms))

        const rid =  window.location.pathname.slice(1)
        const room = rooms[rid]
        if(room) {
          dispatch(Rooms.join(rid))
        }
      })
      .on('groups', groups => {
        console.log('groups', groups)
        dispatch(Groups.update(groups, true))

        Object.keys(groups).forEach(rid => {
          const group = groups[rid]
          Object.keys(group).forEach(id => {
            const uid = group[id]
            if(uid !== -1) {
              dispatch(Users.get(uid))

              const { rooms } = getState()
              const room = rooms[rid]
              if(room && room.link && io.id === id) {
                window.open(room.link)
              }
            }
          })
        })
      })
      .on('messages', messages => {
        console.log('messages', messages)
        Object.values(messages).forEach(conversation => Object.values(conversation).forEach(message => {
          message.created = Date.now()
        }))
        dispatch(Messages.update(messages, true))
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