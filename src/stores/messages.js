export default {
  state: {
  },

  actions: {
    send: function(id, text) {
      window.io.emit('>message', id, text)
    },
    update: function(data={}, each) {
      const { dispatch } = this

      dispatch({
        type: each ? 'messages/saveone' : 'messages/save',
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
    },
    saveone: (state, payload) => {
      return {
        ...state,
        ...Object.keys(payload).reduce((pre, cur) => {
          return {
            [cur]: {
              ...state[cur],
              ...payload[cur]
            }
          }
        }, {})
      }
    }
  }
}