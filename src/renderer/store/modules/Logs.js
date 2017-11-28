const state = {
  logs: [
    {
      type: 1,
      message: 'Ceci est un log test !'
    }
  ]
}

const mutations = {
  ADD_NEW_LOG (state, log) {
    state.logs.push(log)
  }
}

const getters = {
  getLogs (state) {
    return state.logs
  },
  countLogs (state) {
    return state.logs.length
  }
}

const actions = {
  addLog ({ commit }, log) {
    commit('ADD_NEW_LOG', log)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
