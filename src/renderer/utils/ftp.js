const Client = require('ftp')

var connexion = ''

export function ftpNewConnexion (config) {
  connexion = new Client()

  return new Promise((resolve, reject) => {
    connexion.connect(config)

    connexion.on('greeting', () => {
      console.log('connexion to the server : greeting !')
    })

    connexion.on('ready', () => {
      console.log('connexion to the server : ready !')
      resolve()
    })

    connexion.on('error', (err) => {
      console.log('Error connecting to the server')
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
    connexion.list(path, (err, data) => {
      if (err) reject(err)
      else {
        let items = []
        data.forEach(item => {
          if (item.name !== '.' && item.name !== '..') items.push(item)
        })
        resolve(items)
      }
    })
  })
}

export function ftpMkdir (path) {
  return new Promise((resolve, reject) => {
    connexion.mkdir(path, true, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export function ftpRmdir (path) {
  return new Promise((resolve, reject) => {
    connexion.rmdir(path, true, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export function ftpDelete (path) {
  return new Promise((resolve, reject) => {
    connexion.delete(path, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export function ftpRename (oldPath, newPath) {
  return new Promise((resolve, reject) => {
    connexion.rename(oldPath, newPath, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export function ftpDownload (path) {
  return new Promise((resolve, reject) => {
    connexion.get(path, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

export function ftpUpload (filePath, distPath) {
  return new Promise((resolve, reject) => {
    connexion.put(filePath, distPath, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}
