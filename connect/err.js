const connect = require('connect')

const hello = require('./middleware/hello')
const users = require('./middleware/users')
const pets = require('./middleware/pets')
const errorHandler = require('./middleware/errorHandler')
const errorPage = require('./middleware/errorPage')

// connect().use(function hello(req, res) {
//   foo()
//   res.setHeader('Content-Type', 'text/plain')
//   res.end('hello world')
// })
//   .use(errorHandler())
//   .listen(3000)

const api = connect().use(users).use(pets).use(errorHandler)

connect().use(hello).use('/api', api).use(errorPage).listen(3000)
