export default {
  state: {
  },

  actions: {
    create: function(opts={}) {
      window.io.emit('+room', opts)
    },
    join: function(id) {
      window.io.emit('>room', id)
    },
    leave: function(id) {
      window.io.emit('<room', id)
    },
    update: function(data={}) {
      const { dispatch } = this.props

      dispatch({
        type: 'rooms/save',
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