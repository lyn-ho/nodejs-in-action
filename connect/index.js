const connect = require('connect')

// const app = connect()

// app.use(logger)
// app.use(hello)

// app.listen(3000)

// connect()
//   .use(logger)
//   .use('/admin', restrict)
//   .use('/admin', admin)
//   .use(hello)
//   .listen(3000)

function logger(req, res, next) {
  console.log('%s %s', req.method, req.url)
  next()
}

function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.end('hello world')
}

// 认证中间件
function restrict(req, res, next) {
  const authorization = req.headers.authorization

  if (!authorization) return next(new Error('Unauthorized'))

  const parts = authorization.split(' ')
  const scheme = parts[0]
  // const auth = new Buffer(parts[1], 'base64').toString().split(':')
  const auth = Buffer.from(parts[1], 'base64').toString().split(':')
  const user = auth[0]
  const pass = auth[1]

  authenticateWithDatabase(user, pass, function (err) {
    if (err) return next(err)

    next()
  })
}

function admin(req, res, next) {
  switch (req.url) {
    case '/':
      res.end('try /users')
      break
    case '/users':
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(['tob', 'loki', 'jane']))
      break
    default:
      case '/':
      res.end('try /users')
  }
}

function authenticateWithDatabase(user, pass, cb) {
  cb()
}

// connect().use(setup(':method :url')).listen(3000)

// 可配置中间件
function setup(format) {
  const regexp = /:(\w+)/g

  return function logger(req, res, next) {
    const str = format.replace(regexp, function (match, property) {
      return req[property]
    })
    console.log(str)

    next()
  }
}

const router = require('./middleware/router')

const routes = {
  GET: {
    '/users': function (req, res) {
      res.end('tob, loki, ferret')
    },
    '/user/:id': function (req, res, id) {
      res.end('user ' + id)
    }
  },

  DELETE: {
    '/user/:id': function (req, res, id) {
      res.end('deleted user ' + id)
    }
  }
}

// connect().use(router(routes)).listen(3000)

const rewrite = require('./middleware/rewrite')

connect().use(rewrite).use(hello).listen(3000)
