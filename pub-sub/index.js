const events = require('events')
const net = require('net')

const channel = new events.EventEmitter

channel.clients = {}
channel.subscriptions = {}

channel.on('join', function (id, client) {
  this.clients[id] = client
  this.subscriptions[id] = function (senderId, message) {
    if(id !== senderId) this.clients[id].write(message)
  }
  this.on('broadcast', this.subscriptions[id])
})

channel.on('leave', function (id) {
  channel.removeListener('broadcast', this.subscriptions[id])
  channel.emit('broadcast', id, id + ' has left the chat.\n')
})

channel.on('shutdown', function () {
  channel.emit('broadcast', '', 'Chat has shut down.\n')
  channel.removeAllListeners('broadcast')
})

channel.on('join', function (id, client) {
  const welcome = `Welcome!\nGuests online: ${this.listeners('broadcast').length}\n`
  client.write(welcome)
})

channel.setMaxListeners(50)

const server = net.createServer(function (client) {
  const id = client.remoteAddress + ':' + client.remotePort

  channel.emit('join', id, client)
  client.on('data', function (data) {
    data = data.toString()
    if (data === 'shutdown\r\n') {
      channel.emit('shutdown')
    }
    channel.emit('broadcast', id, data)
  })

  client.on('close', function () {
    channel.emit('leave', id)
  })
})

server.listen(8888)
