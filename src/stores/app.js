import url from 'url'

import sio from 'socket.io-client'
import { User, Rooms } from 'stores'

export default {
  state: {
    message: '',
  },

  actions: {
    update: function(data={}) {
      const { dispatch } = this

      dispatch({
        type: 'app/save',
        payload: data
      })
    },
    connect: function() {
      const { dispatch } = this
      const io = window.io = sio(url.resolve(process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_DEV_SERVER, '/io'))
      io.on('error', error => {
        console.log(error)
        if(error === '401') {
          dispatch(User.update({id: 0}))
        }
      })
      .on('user', user => {
        console.log(user)
        dispatch(User.update(user))
      })
      .on('rooms', rooms => {
        console.log(rooms)
        dispatch(Rooms.update(rooms))
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