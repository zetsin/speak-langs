export default {
  state: {
  },

  actions: {
    update: function(data={}) {
      const { dispatch } = this

      dispatch({
        type: 'user/save',
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