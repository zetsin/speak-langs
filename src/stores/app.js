import url from 'url'

import sio from 'socket.io-client'
import { App, User, Users, Rooms, Groups, Messages } from 'stores'

export default {
  state: {
    message: '',
  },

  actions: {
    connect: function() {
      const { dispatch } = this
      const io = window.io = sio(url.resolve(process.env.REACT_APP_SERVER || '', '/io'))
      io.on('error', err => {
        console.log(err)
        dispatch(User.update({
          id: 0
        }))
        dispatch(App.update({
          message: err
        }))
      })
      .on('user', user => {
        console.log(user)
        dispatch(User.update(user))
      })
      .on('users', users => {
        console.log(users)
        dispatch(Users.update(users))
      })
      .on('rooms', rooms => {
        console.log(rooms)
        dispatch(Rooms.update(rooms))
      })
      .on('groups', groups => {
        console.log(groups)
        dispatch(Groups.update(groups, true))
        Object.values(groups).map(group => Object.values(group).map(uid => dispatch(Users.get(uid))))
      })
      .on('messages', messages => {
        console.log(messages)
        Object.values(messages).forEach(conversation => Object.values(conversation).forEach(message => {
          message.datetime = Date.now()
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