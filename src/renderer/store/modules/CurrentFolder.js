import {slice, dropRight} from 'lodash'
import { ftpLs } from '@/utils/ftp'
import { rewritePath } from '@/utils/regex'

const state = {
  currentPath: ['.', 'www'],
  currentItems: [
    {
      name: 'wordpress',
      type: 'd',
      size: 0,
      time: 1445964360000
    },
    {
      name: 'portfolio',
      type: 'd',
      size: 0,
      time: 1445964360000
    },
    {
      name: '.ssh',
      type: 'd',
      size: 0,
      time: 1174341120000
    },
    {
      name: 'profilePicture.png',
      type: '-',
      size: 14258,
      time: 1174341120000
    },
    {
      name: '.htaccess',
      type: '-',
      size: 300,
      time: 1174341120000
    }
  ]
}

const mutations = {
  FILL_FOLDER_ITEMS (state, items) {
    state.currentItems = items
  },
  DROP_FOLDER_ITEMS (state) {
    state.currentItems = []
  },
  RESET_PATH (state) {
    state.currentPath = slice(state.currentPath, 0, 1)
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
  newPath ({ commit }) {
    commit('RESET_PATH')
  },
  goUp ({ commit }) {
    commit('REMOVE_ONE')
  },
  goInto ({ commit }, item) {
    commit('ADD_ONE', item)
  },
  goBackTo ({ commit }, index) {
    commit('RESET_PATH_TO', index)
  },
  loadCurrentPath ({ commit, getters }) {
    let lsPath = rewritePath(getters.getCurrentPathString)
    ftpLs(lsPath).then(response => {
      commit('FILL_FOLDER_ITEMS', response)
    }, (err) => {
      console.log('ls error :', err)
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
