export default (initState = {}) => ({
  state: Object.assign({
    uid: null,
    userInfo: null
  }, initState.session && initState.session['store/user']),
  
  getters: {
    isAuth(state) {
      return state.uid && state.userInfo
    }
  },

  mutations: {
    setState(state, obj) {
      for (const k in obj) {
        state[k] = obj[k]
      }
    }
  }
})
