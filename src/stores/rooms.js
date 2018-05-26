export default {
  state: {
  },

  actions: {
    create: function(opts={}) {
      window.io.emit('+room', opts)
    },
    gointo: function(id) {
      window.io.emit('>room', id)
    },
    getout: function(id) {
      window.io.emit('<room', id)
    },
    update: function(data={}) {
      const { dispatch } = this

      dispatch({
        type: 'rooms/save',
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