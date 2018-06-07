export default {
  state: {
  },

  actions: {
    update: function(data={}) {
      const { dispatch } = this.props

      dispatch({
        type: 'texts/save',
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