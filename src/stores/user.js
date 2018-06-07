export default {
  state: {
  },

  actions: {
    update: function(user={}) {
      const { dispatch } = this.props

      dispatch({
        type: 'user/save',
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