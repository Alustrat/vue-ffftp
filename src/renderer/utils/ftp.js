import store from '../store/index'

const Client = require('ftp')
var connexion = ''

export function ftpNewConnexion (config) {
  connexion = new Client()

  return new Promise((resolve, reject) => {
    connexion.connect(config)
    store.dispatch('addLog', { type: '1', message: 'Connexion to the server ...' })

    connexion.on('greeting', () => {
      store.dispatch('addLog', { type: '1', message: 'Connexion with server etablished !' })
    })

    connexion.on('ready', () => {
      store.dispatch('addLog', { type: '3', message: 'Connexion with server ready !' })
      resolve()
    })

    connexion.on('error', (err) => {
      store.dispatch('addLog', { type: '2', message: 'Error connecting to the server !' })
      store.dispatch('addLog', { type: '4', message: err })
      reject(new Error(err))
    })
  })
}

export function ftpDestroy () {
  connexion.destroy()
  connexion = ''
}

export function ftpLs (path) {
  return new Promise((resolve, reject) => {
    store.dispatch('addLog', { type: '1', message: `Listing path "${path}" ...` })
    connexion.list(path, (err, data) => {
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

export function ftpMkdir (path) {
  return new Promise((resolve, reject) => {
    store.dispatch('addLog', { type: '1', message: `Creating folder "${path}" ...` })
    connexion.mkdir(path, true, (err) => {
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

export function ftpRmdir (path) {
  return new Promise((resolve, reject) => {
    store.dispatch('addLog', { type: '1', message: `Deleting folder "${path}" ...` })
    connexion.rmdir(path, true, (err) => {
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

export function ftpDelete (path) {
  return new Promise((resolve, reject) => {
    store.dispatch('addLog', { type: '1', message: `Deleting file "${path}" ...` })
    connexion.delete(path, (err) => {
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

export function ftpRename (oldPath, newPath) {
  return new Promise((resolve, reject) => {
    store.dispatch('addLog', { type: '1', message: `Renaming file ${oldPath} to ${newPath} ...` })
    connexion.rename(oldPath, newPath, (err) => {
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

export function ftpDownload (path) {
  return new Promise((resolve, reject) => {
    store.dispatch('addLog', { type: '1', message: `Downloading file "${path}" ...` })
    connexion.get(path, (err, data) => {
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

export function ftpUpload (filePath, distPath) {
  return new Promise((resolve, reject) => {
    store.dispatch('addLog', { type: '1', message: `Uploading file "${distPath}" ...` })
    connexion.put(filePath, distPath, (err) => {
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
