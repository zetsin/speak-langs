export default {
  state: {
  },

  actions: {
    get: function(id, force) {
      const { users } = this.props

      if(id <= 0) {
        return
      }

      if(force || !users[id]) {
        window.io.emit('<user', id)
      }
    },
    update: function(user={}) {
      const { dispatch } = this.props

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