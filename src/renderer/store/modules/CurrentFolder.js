import {slice, dropRight} from 'lodash'

const state = {
  currentPath: ['.'],
  currentItems: []
}

const mutations = {
  FILL_FOLDER_ITEMS (state, items) {
    state.currentItems = items
  },
  DROP_FOLDER_ITEMS (state) {
    state.currentItems = []
  },
  NEW_PATH (state, rootFolder) {
    state.currentPath = [rootFolder]
  },
  RESET_PATH_TO (state, index) {
    state.currentPath = slice(state.currentPath, 0, index + 1)
  },
  ADD_ONE (state, item) {
    state.currentPath.push(item)
  },
  REMOVE_ONE (state) {
    state.currentPath = dropRight(state.currentPath)
  }
}

const getters = {
  getCurrentPath (state) {
    return state.currentPath
  },
  getCurrentPathString (state) {
    return state.currentPath.join('/')
  },
  getCurrentItems (state) {
    return state.currentItems
  }
}

const actions = {
  fillCurrentItems ({ commit }, items) {
    commit('DROP_FOLDER_ITEMS')
    commit('FILL_FOLDER_ITEMS', items)
  },
  dropCurrentItems ({ commit }) {
    commit('DROP_FOLDER_ITEMS')
  },
  resetPath ({ commit }) {
    commit('NEW_PATH', '.')
  },
  goUp ({ commit }) {
    commit('REMOVE_ONE')
  },
  goInto ({ commit }, item) {
    commit('ADD_ONE', item)
  },
  goBackTo ({ commit }, index) {
    commit('RESET_PATH_TO', index)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
