const http = require('http')
const formidable = require('formidable')

const server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'GET':
      show(req, res)
      break
    case 'POST':
      upload(req, res)
      break
  }
})

server.listen(3000)

function show(_req, res) {
  const html = `
<html>
  <head>
    <title>Upload File</title>
  </head>
  <body>
    <h1>Upload File</h1>
    <form method="post" action="/" enctype="multipart/form-data">
      <p><input type="text" name="name" /></p>
      <p><input type="file" name="file" /></p>
      <p><input type="submit" value="Upload" /></p>
    </form>
  </body>
</html>
  `
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

function upload(req, res) {
  if (!isFormData(req)) {
    res.statusCode = 404
    res.end('Bad Request: expecting multipart/form-data')
    return
  }

  const form = new formidable.IncomingForm()

  form.on('field', function (field, value) {
    console.log(field)
    console.log(value)
  })

  form.on('file', function (name, _file) {
    console.log(name)
    // console.log(file)
  })

  form.on('progress', function (bytesReceived, bytesExpected) {
    let percent = Math.floor(bytesReceived / bytesExpected * 100)
    console.log(percent)
  })

  form.on('end', function () {
    res.end('Upload complete!')
  })

  form.parse(req)
}

function isFormData(req) {
  const type = req.headers['content-type'] || []
  return 0 === type.indexOf('multipart/form-data')
}
