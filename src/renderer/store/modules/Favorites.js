import {without} from 'lodash'
const storage = require('electron-json-storage')

const state = {
  favs: []
}

const mutations = {
  ADD_TO_FAVORITE (state, item) {
    state.favs.push(item)
    let favs = JSON.stringify(state.favs)
    storage.set('favs', favs, (error) => {
      if (error) console.log('error seting json', error)
    })
  },
  REMOVE_FROM_FAVORITE (state, item) {
    state.favs = without(state.favs, item)
    let favs = JSON.parse(JSON.stringify(state.favs))
    storage.set('favs', favs, (error) => {
      if (error) console.log('error seting json', error)
    })
  }
}

const getters = {
  getFavs (state) {
    return state.favs
  }
}

const actions = {
  // Some actions
  addFavs ({ commit }, item) {
    commit('ADD_TO_FAVORITE', item)
  },
  removeFavs ({ commit }, item) {
    commit('REMOVE_FROM_FAVORITE', item)
  },
  loadFavs ({ dispatch }) {
    console.log('on load favs')
    storage.get('favs', (error, data) => {
      if (error) console.log('error getting json', error)
      else {
        let items = JSON.parse(data)
        if (items.length) {
          items.forEach((item) => {
            dispatch('addFavs', item)
          })
        }
      }
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
