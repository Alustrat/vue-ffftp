const dirSeperator = '\\'
const home = require('os').homedir()

export function rewritePirateKey (path) {
  return path.replace('~', home)
    .replace(/\//g, dirSeperator)
}

export function rewritePath (path) {
  // eslint-disable-next-line no-useless-escape
  return path.replace(/([^a-zA-Z0-9.\/])/g, '\\$1')
}

export function rewritePathForSftp (path) {
  let sftpPath = (path
    .replace(/\//g, "'/'")
    .replace(/'/, '')) + "'"
  return sftpPath
}

export function getDownloadPath (currentPath, downloadPath, item) {
  let itemPath = `${item.path}${dirSeperator}${item.name}`
  .replace(currentPath, '')
  .replace('/', dirSeperator)

  return `${downloadPath}${dirSeperator}${itemPath}`
}

export function getUploadLocalPath (item) {
  let sysPath = (item.path).split(dirSeperator)
  sysPath.pop()

  return sysPath.join(dirSeperator)
}

export function getUploadPath (basePath, uploadPath, item) {
  let itemPath = uploadPath + (item.path
    .replace(basePath, '')
    .replace(new RegExp(dirSeperator + dirSeperator, 'g'), '/'))

  return itemPath
}

export function getItemPath (basePath, itemName) {
  let item = {
    name: itemName,
    path: basePath + dirSeperator + itemName
  }

  return item
}
