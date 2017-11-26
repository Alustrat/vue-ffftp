export function rewritePath (path) {
  // eslint-disable-next-line no-useless-escape
  return path.replace(/([^a-zA-Z0-9.\/])/g, '\\$1')
}
