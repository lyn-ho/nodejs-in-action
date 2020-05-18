// module.exports = function errorHandler() {
//   const env = process.env.NODE_ENV || 'development'

//   return function (err, req, res, next) {
//     res.statusCode = 500

//     switch (env) {
//       case 'development':
//         res.setHeader('Content-Type', 'application/json')
//         res.end(JSON.stringify(err))
//         break
//       default:
//         res.end('Server error')
//     }
//   }
// }

module.exports = function errorHandler(err, req, res, next) {
  console.error(err.stack)

  res.setHeader('Content-Type', 'application/json')
  if (err.notFound) {
    res.statusCode = 404
    res.end(JSON.stringify({ error: err.message }))
  } else {
    res.statusCode = 500
    res.end(JSON.stringify({ error: 'Internal Server Error' }))
  }
}
