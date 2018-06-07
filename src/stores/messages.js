export default {
  state: {
  },

  actions: {
    send: function(id, text) {
      window.io.emit('+message', id, text)
    },
    update: function(data={}) {
      const { dispatch } = this.props

      dispatch({
        type: 'messages/save',
        payload: data
      })
    },
  },

  reducers: {
    save: (state, payload) => {
      const loop = (s, p) => Object.keys(p).map(key => s[key] && typeof p[key] === 'object' ? loop(s[key], p[key]) : s[key] = p[key])
      loop(state, payload)
      return {
        ...state
      }
    },
  }
}