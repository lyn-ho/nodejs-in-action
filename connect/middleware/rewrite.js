const url = require('url')

module.exports = function rewrite(req, res, next) {
  console.log('before ---- ', req.url)
  const path = url.parse(req.url).pathname

  const match = path.match(/^\/blog\/posts\/(.+)/)

  if (match) (
    findPostIdBySlug(match[0], function (err, id) {
      if (err) return next(err)
      if (!id) return next(new Error('User not found'))
      req.url = `/blog/posts/${id}`
      console.log('after ---- ', req.url)
      // next()
      res.end(`/blog/posts/${id}`)
    })
  )
}

function findPostIdBySlug(id, cb) {
  if (!id) {
    cb(new Error('Not matched'))
    return
  }
  console.log('id ---- ', id)
  cb(null, id)
}
