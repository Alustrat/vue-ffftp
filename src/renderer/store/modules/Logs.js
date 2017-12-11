const state = {
  logs: []
}

const mutations = {
  ADD_NEW_LOG (state, log) {
    state.logs.push(log)
  },
  CLEAR_LOGS (state) {
    state.logs = []
  }
}

const getters = {
  getLogs (state) {
    return state.logs
  },
  countLogs (state) {
    return state.logs.length
  },
  getLastLog (state) {
    return state.logs[state.logs.length - 1]
  }
}

const actions = {
  addLog ({ commit }, log) {
    commit('ADD_NEW_LOG', log)
  },
  clearLogs ({ commit }) {
    commit('CLEAR_LOGS')
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
