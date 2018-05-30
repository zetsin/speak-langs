export default {
  state: {
  },

  actions: {
    get: function(id, force) {
      const { getState } = this

      if(id === 0 || id === -1) {
        return
      }

      if(force || !getState().users[id]) {
        window.io.emit('<user', id)
      }
    },
    update: function(user={}) {
      const { dispatch } = this

      dispatch({
        type: 'users/save',
        payload: user
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