module.exports = function pets(req, res, next) {
  if (req.url.match(/^\/pet\/(.+)/)) {
    foo()
  } else {
    next()
  }
}
