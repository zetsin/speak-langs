export default {
  state: {
  },

  actions: {
    update: function(data={}, each) {
      const { dispatch } = this

      dispatch({
        type: each ? 'groups/saveone' : 'groups/save',
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
            ...pre,
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