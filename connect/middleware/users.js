const db = {
  users: [
    { name: 'tob' },
    { name: 'loki' },
    { name: 'jane' }
  ]
}

module.exports = function users(req, res, next) {
  const match = req.url.match(/^\/user\/(.+)/)

  if (match) {
    const user = db.users.find(user => user.name === match[1])
    if (user) {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(user))
    } else {
      const err = new Error('User not found')
      err.notFound = true
      next(err)
    }
  } else {
    next()
  }
}
