export default {
  state: {
  },

  actions: {
    update: function(data={}) {
      const { dispatch } = this

      dispatch({
        type: 'groups/save',
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