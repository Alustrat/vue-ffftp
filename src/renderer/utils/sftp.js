import store from '../store/index'
import { rewritePathForSftp } from './regex'
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

  ls (path) {
    return new Promise((resolve, reject) => {
      this.connexion.requestSFTP()
        .then((sftp) => {
          return new Promise((resolve, reject) => {
            sftp.readdir(path, (err, data) => {
              sftp.end()
              if (err) return reject(err)
              let items = []
              data.forEach((item, i) => {
                items[i] = {
                  name: item.filename,
                  type: item.longname[0],
                  size: item.attrs.size,
                  date: item.attrs.mtime
                }
              })
              return resolve(items)
            })
          })
        })
        .then((list) => resolve(list))
    })
  }

  mkdir (path) {
    return new Promise((resolve, reject) => {
      store.dispatch('addLog', { type: '1', message: `Creating folder "${path}" ...` })
      this.connexion.mkdir(path)
        .then(() => {
          store.dispatch('addLog', { type: '3', message: `Sucess creating folder : ${path}` })
          resolve()
        })
        .catch((err) => {
          store.dispatch('addLog', { type: '2', message: `Error creating folder : ${path}` })
          store.dispatch('addLog', { type: '4', message: err })
          reject(err)
        })
    })
  }

  rmdir (path) {
    path = rewritePathForSftp(path)
    return new Promise((resolve, reject) => {
      this.connexion.exec(`rm -rf ${path}`)
        .then(() => {
          store.dispatch('addLog', { type: '3', message: `Sucess deleting folder : ${path}` })
          resolve()
        })
        .catch((err) => {
          store.dispatch('addLog', { type: '2', message: `Error deleting folder : ${path}` })
          store.dispatch('addLog', { type: '4', message: err })
          reject(err)
        })
    })
  }

  delete (path) {
    path = rewritePathForSftp(path)
    return new Promise((resolve, reject) => {
      this.connexion.exec(`rm ${path}`)
        .then(() => {
          store.dispatch('addLog', { type: '3', message: `Sucess deleting file : ${path}` })
          resolve()
        })
        .catch((err) => {
          store.dispatch('addLog', { type: '2', message: `Error deleting file : ${path}` })
          store.dispatch('addLog', { type: '4', message: err })
          reject(err)
        })
    })
  }

  rename (oldPath, newPath) {
    oldPath = rewritePathForSftp(oldPath)
    newPath = rewritePathForSftp(newPath)
    return new Promise((resolve, reject) => {
      this.connexion.exec(`mv ${oldPath} ${newPath}`)
        .then(() => {
          store.dispatch('addLog', { type: '3', message: `Sucess renaming file : ${newPath}` })
          resolve()
        })
        .catch((err) => {
          store.dispatch('addLog', { type: '2', message: `Error renaming file : ${newPath}` })
          store.dispatch('addLog', { type: '4', message: err })
          reject(err)
        })
    })
  }

  download (distPath, localPath) {
    rewritePathForSftp(distPath)
    return new Promise((resolve, reject) => {
      this.connexion.getFile(localPath, distPath)
        .then(() => {
          store.dispatch('addLog', { type: '3', message: `Sucess downloading file : ${distPath}` })
          resolve()
        })
        .catch((err) => {
          store.dispatch('addLog', { type: '2', message: `Error downloading file : ${distPath}` })
          store.dispatch('addLog', { type: '4', message: err })
          reject(err)
        })
    })
  }

  upload (localPath, distPath) {
    return new Promise((resolve, reject) => {
      this.connexion.putFile(localPath, distPath)
        .then(() => {
          store.dispatch('addLog', { type: '3', message: `Sucess uploading file : ${distPath}` })
          resolve()
        })
        .catch((err) => {
          store.dispatch('addLog', { type: '2', message: `Error uploading file : ${distPath}` })
          store.dispatch('addLog', { type: '4', message: err })
          reject(err)
        })
    })
  }
}
