import { ftpLs, ftpRmdir, ftpDelete, ftpDownload, ftpUpload, ftpMkdir } from '@/utils/ftp'
import { rewritePath } from '@/utils/regex'
import eachOf from 'async/eachOf'
import eachOfLimit from 'async/eachOfLimit'

const fs = require('fs')
const dirSeperator = '\\'

var foldersToCreate = []
var filesToDownload = []

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// DELETE
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

export function deleteItems (currentPath, items) {
  return new Promise((resolve, reject) => {
    eachOf(items, (item, i, callback) => {
      let filePath = `${currentPath}/${item.name}`
      if (item.type === 'd') {
        ftpRmdir(filePath, true).then(response => { callback() }, () => { callback() })
      } else if (item.type === '-') {
        ftpDelete(filePath).then(response => { callback() }, () => { callback() })
      }
    }, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// DOWNLOAD
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

export function downloadItems (downloadPath, currentPath, items) {
  return new Promise((resolve, reject) => {
    foldersToCreate = []
    filesToDownload = []

    eachOf(items, (item, i, callback) => {
      if (item.type === 'd') {
        foldersToCreate.push({'path': currentPath, 'name': item.name})
        getDownloadTree(`${currentPath}/${item.name}`).then(() => { callback() })
      } else if (item.type === '-') {
        filesToDownload.push({'path': currentPath, 'name': item.name})
        callback()
      }
    }, (err) => {
      if (err) reject(err)
      createFoldersToDisk(currentPath, downloadPath).then(() => {
        downloadFilesToDisk(currentPath, downloadPath).then(() => {
          resolve()
        })
      })
    })
  })
}

export function getDownloadTree (path) {
  return new Promise((resolve, reject) => {
    let folders = []
    let lsPath = rewritePath(path)

    ftpLs(lsPath).then(response => {
      response.forEach((item) => {
        if (item.type === 'd') {
          foldersToCreate.push({'path': path, 'name': item.name})
          folders.push({'path': path, 'name': item.name})
        } else if (item.type === '-') {
          filesToDownload.push({'path': path, 'name': item.name})
        }
      })
      eachOf(folders, (folder, i, callback) => {
        getDownloadTree(`${folder.path}/${folder.name}`).then(() => {
          callback()
        })
      }, () => { resolve() })
    }, (err) => { reject(err) })
  })
}

function createFoldersToDisk (currentPath, downloadPath) {
  return new Promise((resolve, reject) => {
    eachOf(foldersToCreate, (folder, i, callback) => {
      let localPath = `${folder.path}${dirSeperator}${folder.name}`
        .replace(currentPath, '')
        .replace('/', dirSeperator)
      fs.mkdir(`${downloadPath}${dirSeperator}${localPath}`, () => { callback() })
    }, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

function downloadFilesToDisk (currentPath, downloadPath) {
  return new Promise((resolve, reject) => {
    eachOfLimit(filesToDownload, 1, (file, i, callback) => {
      let newFilePath = `${file.path}${dirSeperator}${file.name}`
          .replace(currentPath, '')
          .replace('/', dirSeperator)
      ftpDownload(`${file.path}/${file.name}`).then(response => {
        let stream = response.pipe(fs.createWriteStream(`${downloadPath}${dirSeperator}${newFilePath}`))
        stream.on('finish', () => { callback() })
      }, () => { callback() })
    }, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// UPLOAD
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

export function uploadItems (currentPath, items) {
  return new Promise((resolve, reject) => {
    foldersToCreate = []
    filesToDownload = []

    let uploadPathArray = items[0].path.split(dirSeperator)
    uploadPathArray.pop()
    let uploadPath = uploadPathArray.join(dirSeperator)

    eachOf(items, (item, i, callback) => {
      fs.stat(item.path, (err, stats) => {
        if (err) console.log('error accessing to the stats of ', item.path)
        else if (stats.isDirectory()) {
          foldersToCreate.push({'path': item.path, 'name': item.name})
          getUploadTree(item.path).then(() => { callback() })
        } else if (stats.isFile()) {
          filesToDownload.push({'path': item.path, 'name': item.name})
          callback()
        }
      })
    }, (err) => {
      if (err) reject(err)
      createFoldersToDist(currentPath, uploadPath).then(() => {
        uploadFilesToDist(currentPath, uploadPath).then(() => { resolve() })
      })
    })
  })
}

function getUploadTree (path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, items) => {
      if (err) reject(err)
      let uploadTreePromises = []
      let folders = []
      items.forEach(item => {
        let itemPath = `${path}${dirSeperator}${item}`
        if (fs.statSync(itemPath).isDirectory()) {
          foldersToCreate.push({'path': itemPath, 'name': item})
          folders.push({'path': itemPath, 'name': item})
        } else if (fs.statSync(itemPath).isFile()) {
          filesToDownload.push({'path': itemPath, 'name': item})
        }
      })
      folders.forEach(folder => {
        uploadTreePromises.push(getUploadTree(folder.path))
      })
      Promise.all(uploadTreePromises).then((result) => { resolve() })
    })
  })
}

function createFoldersToDist (currentPath, uploadPath) {
  return new Promise((resolve, reject) => {
    eachOf(foldersToCreate, (folder, i, callback) => {
      let distPath = currentPath + (folder.path
          .replace(uploadPath, '')
          .replace(/\\/g, '/'))
      ftpMkdir(distPath).then(response => { callback() }, () => { callback() })
    }, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

function uploadFilesToDist (currentPath, uploadPath) {
  return new Promise((resolve, reject) => {
    eachOfLimit(filesToDownload, 1, (file, i, callback) => {
      let distPath = currentPath + (file.path
            .replace(uploadPath, '')
            .replace(/\\/g, '/'))
      ftpUpload(file.path, distPath).then(() => { callback() })
    }, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}
