const parse = require('url').parse

module.exports = function route(obj) {
  return function (req, res, next) {
    if (!obj[req.method]) {
      next()
      return
    }

    const routes = obj[req.method]
    const url = parse(req.url)
    const paths = Object.keys(routes)

    for (let i = 0;i < paths.length;i++) {
      let path = paths[i]
      const fn = routes[path]

      path = path.replace(/\//g, '\\/').replace(/:(\w+)/g, '([^\\/]+)')

      const reg = new RegExp(`^${path}$`)
      const captures = url.pathname.match(reg)
      if (captures) {
        const args = [req, res].concat(captures.slice(1))
        fn.apply(null, args)
        return
      }
    }
    next()
  }
}
