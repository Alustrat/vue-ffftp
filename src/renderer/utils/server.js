import Ftp from './ftp'
import Sftp from './sftp'
import store from '../store/index'
import eachOf from 'async/eachOf'
import eachOfLimit from 'async/eachOfLimit'
import { getDownloadPath, getUploadPath, getUploadLocalPath, getItemPath } from '@/utils/regex'

const fs = require('fs-extra')

export default class Server {
  constructor () {
    this.connexion = ''
    this.foldersToCreate = []
    this.filesToDownload = []
  }

  async connect (config) {
    config.serverConfig.username = config.serverConfig.user
    this.connexion = config.sftp ? new Sftp() : new Ftp()
    store.dispatch('resetPath', config.sftp)

    return this.connexion.connect(config.serverConfig)
  }

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // DELETE
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  deleteItems (currentPath, items) {
    return new Promise((resolve, reject) => {
      eachOf(items, (item, i, callback) => {
        let filePath = `${currentPath}/${item.name}`
        if (item.type === 'd') {
          this.connexion.ls(filePath)
            .then((list) => this.deleteItems(filePath, list))
            .then(() => this.connexion.rmdir(filePath))
            .then(() => callback())
        } else if (item.type === '-') {
          this.connexion.delete(filePath)
            .then(() => callback())
        }
      }, () => resolve())
    })
  }

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // DOWNLOAD
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  downloadItems (items, path, downloadPath = null) {
    return new Promise((resolve, reject) => {
      if (downloadPath) {
        this.foldersToCreate = []
        this.filesToDownload = []
      }

      eachOf(items, (item, i, callback) => {
        if (item.type === 'd') {
          this.foldersToCreate.push({'path': path, 'name': item.name})
          this.connexion.ls(`${path}/${item.name}`)
            .then((subItems) => this.downloadItems(subItems, `${path}/${item.name}`))
            .then(() => callback())
        } else if (item.type === '-') {
          this.filesToDownload.push({'path': path, 'name': item.name})
          callback()
        }
      }, () => {
        if (!downloadPath) return resolve()
        return this.createFoldersToDisk(path, downloadPath)
          .then(() => this.downloadFilesToDisk(path, downloadPath))
          .then(() => resolve())
      })
    })
  }

  createFoldersToDisk (basePath, downloadPath) {
    return new Promise((resolve, reject) => {
      eachOf(this.foldersToCreate, (folder, i, callback) => {
        fs.mkdir(getDownloadPath(basePath, downloadPath, folder))
          .then(() => callback())
      }, () => resolve())
    })
  }

  downloadFilesToDisk (basePath, downloadPath) {
    return new Promise((resolve, reject) => {
      eachOfLimit(this.filesToDownload, 1, (file, i, callback) => {
        this.connexion.download(`${file.path}/${file.name}`, getDownloadPath(basePath, downloadPath, file))
          .then(() => callback())
      }, () => resolve())
    })
  }

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // UPLOAD
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  uploadItems (items, distPath = null) {
    return new Promise((resolve, reject) => {
      if (distPath) {
        this.foldersToCreate = []
        this.filesToDownload = []
      }
      let localPath = getUploadLocalPath(items[0])

      eachOf(items, (item, i, callback) => {
        fs.stat(item.path)
          .then((stats) => {
            if (stats.isDirectory()) {
              this.foldersToCreate.push({'path': item.path, 'name': item.name})
              fs.readdir(item.path)
                .then((list) => this.uploadItems(list.map(x => getItemPath(item.path, x))))
                .then(() => callback())
            } else if (stats.isFile()) {
              this.filesToDownload.push({'path': item.path, 'name': item.name})
              callback()
            }
          })
      }, () => {
        if (!distPath) return resolve()
        return this.createFoldersToDist(localPath, distPath)
          .then(() => this.uploadFilesToDist(localPath, distPath))
          .then(() => resolve())
      })
    })
  }

  createFoldersToDist (localPath, distPath) {
    return new Promise((resolve, reject) => {
      eachOf(this.foldersToCreate, (folder, i, callback) => {
        this.connexion.mkdir(getUploadPath(localPath, distPath, folder))
          .then(() => callback())
      }, () => resolve())
    })
  }

  uploadFilesToDist (localPath, distPath) {
    return new Promise((resolve, reject) => {
      eachOfLimit(this.filesToDownload, 1, (file, i, callback) => {
        this.connexion.upload(file.path, getUploadPath(localPath, distPath, file))
          .then(() => callback())
      }, () => resolve())
    })
  }
}
