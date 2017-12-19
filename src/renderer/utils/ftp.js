import store from '../store/index'

const Client = require('ftp')

export default class Ftp {
  constructor () {
    this.connexion = ''
  }

  connect (config) {
    this.connexion = new Client()

    return new Promise((resolve, reject) => {
      this.connexion.connect(config)
      store.dispatch('addLog', { type: '1', message: 'Connexion to the server ...' })

      this.connexion.on('greeting', () => {
        store.dispatch('addLog', { type: '1', message: 'Connexion with server etablished !' })
      })

      this.connexion.on('ready', () => {
        store.dispatch('addLog', { type: '3', message: 'Connexion with server ready !' })
        resolve()
      })

      this.connexion.on('error', (err) => {
        store.dispatch('addLog', { type: '2', message: 'Error connecting to the server !' })
        store.dispatch('addLog', { type: '4', message: err })
        reject(new Error(err))
      })
    })
  }

  disconnect () {
    this.connexion.destroy()
    this.connexion = ''
  }

  ls (path) {
    return new Promise((resolve, reject) => {
      store.dispatch('addLog', { type: '1', message: `Listing path "${path}" ...` })
      this.connexion.list(path, (err, data) => {
        if (err) {
          store.dispatch('addLog', { type: '2', message: `Error accessing path : ${path}` })
          store.dispatch('addLog', { type: '4', message: err })
          reject(err)
        } else {
          let items = []
          data.forEach(item => {
            if (item.name !== '.' && item.name !== '..') items.push(item)
          })
          store.dispatch('addLog', { type: '3', message: `Sucess accessing path : ${path}` })
          resolve(items)
        }
      })
    })
  }

  mkdir (path) {
    return new Promise((resolve, reject) => {
      store.dispatch('addLog', { type: '1', message: `Creating folder "${path}" ...` })
      this.connexion.mkdir(path, true, (err) => {
        if (err) {
          store.dispatch('addLog', { type: '2', message: `Error creating folder : ${path}` })
          store.dispatch('addLog', { type: '4', message: err })
          reject(err)
        } else {
          store.dispatch('addLog', { type: '3', message: `Sucess creating folder : ${path}` })
          resolve()
        }
      })
    })
  }

  rmdir (path) {
    return new Promise((resolve, reject) => {
      store.dispatch('addLog', { type: '1', message: `Deleting folder "${path}" ...` })
      this.connexion.rmdir(path, true, (err) => {
        if (err) {
          store.dispatch('addLog', { type: '2', message: `Error deleting folder : ${path}` })
          store.dispatch('addLog', { type: '4', message: err })
          reject(err)
        } else {
          store.dispatch('addLog', { type: '3', message: `Sucess deleting folder : ${path}` })
          resolve()
        }
      })
    })
  }

  delete (path) {
    return new Promise((resolve, reject) => {
      store.dispatch('addLog', { type: '1', message: `Deleting file "${path}" ...` })
      this.connexion.delete(path, (err) => {
        if (err) {
          store.dispatch('addLog', { type: '2', message: `Error deleting file : ${path}` })
          store.dispatch('addLog', { type: '4', message: err })
          reject(err)
        } else {
          store.dispatch('addLog', { type: '3', message: `Sucess deleting file : ${path}` })
          resolve()
        }
      })
    })
  }

  rename (oldPath, newPath) {
    return new Promise((resolve, reject) => {
      store.dispatch('addLog', { type: '1', message: `Renaming file ${oldPath} to ${newPath} ...` })
      this.connexion.rename(oldPath, newPath, (err) => {
        if (err) {
          store.dispatch('addLog', { type: '2', message: `Error renaming file : ${newPath}` })
          store.dispatch('addLog', { type: '4', message: err })
          reject(err)
        } else {
          store.dispatch('addLog', { type: '3', message: `Sucess renaming file : ${newPath}` })
          resolve()
        }
      })
    })
  }

  download (path) {
    return new Promise((resolve, reject) => {
      store.dispatch('addLog', { type: '1', message: `Downloading file "${path}" ...` })
      this.connexion.get(path, (err, data) => {
        if (err) {
          store.dispatch('addLog', { type: '2', message: `Error downloading file : ${path}` })
          store.dispatch('addLog', { type: '4', message: err })
          reject(err)
        } else {
          store.dispatch('addLog', { type: '3', message: `Sucess downloading file : ${path}` })
          resolve(data)
        }
      })
    })
  }

  upload (filePath, distPath) {
    return new Promise((resolve, reject) => {
      store.dispatch('addLog', { type: '1', message: `Uploading file "${distPath}" ...` })
      this.connexion.put(filePath, distPath, (err) => {
        if (err) {
          store.dispatch('addLog', { type: '2', message: `Error uploading file : ${distPath}` })
          store.dispatch('addLog', { type: '4', message: err })
          reject(err)
        } else {
          store.dispatch('addLog', { type: '3', message: `Sucess uploading file : ${distPath}` })
          resolve()
        }
      })
    })
  }
}
