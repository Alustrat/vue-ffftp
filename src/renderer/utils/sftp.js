import store from '../store/index'
const Client = require('node-ssh')

export default class sftp {
  constructor () {
    this.connexion = ''
  }

  connect (config) {
    this.connexion = new Client()

    return new Promise((resolve, reject) => {
      store.dispatch('addLog', { type: '1', message: 'Connexion to the server ...' })
      this.connexion.connect(config)
        .then(() => {
          store.dispatch('addLog', { type: '3', message: 'Connexion with server ready !' })
          resolve()
        })
        .catch((err) => {
          store.dispatch('addLog', { type: '2', message: 'Error connecting to the server !' })
          store.dispatch('addLog', { type: '4', message: err })
          reject(err)
        })
    })
  }

  disconnect () {
    this.connexion.dispose()
    this.connexion = ''
  }
}
