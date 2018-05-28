export default {
  state: {
  },

  actions: {
    update: function(user={}) {
      const { dispatch } = this

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