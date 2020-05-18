const http = require('http')
const parse = require('url').parse
const join = require('path').join
const fs = require('fs')

let root = __dirname

const server = http.createServer(function (req, res) {
  let url = parse(req.url)
  let path = join(root, url.pathname)
  // let stream = fs.createReadStream(path)
  // stream.on('data', function (chunk) {
  //   res.write(chunk)
  // })
  // stream.on('end', function () {
  //   res.end()
  // })
  // stream.pipe(res)

  // stream.on('error', function (err) {
  //   res.statusCode = 500
  //   res.end('Internal Server Error')
  // })

  fs.stat(path, function (err, stat) {
    if (err) {
      if ('ENOENT' === err.code) {
        res.statusCode = 404
        res.end('Not Found')
      } else {
        res.statusCode = 500
        res.end('Internal Server Error')
      }
    } else {
      res.setHeader('Content-Length', stat.size)

      const stream = fs.createReadStream(path)
      stream.pipe(res)
      stream.on('error', function (err) {
        res.statusCode = 500
        res.end('Internal Server Error')
      })
    }
  })
})

server.listen(3000)
