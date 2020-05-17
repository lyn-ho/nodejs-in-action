const socketio = require('socket.io')

let io

let guestNumber = 1
let nickNames = {}
let namesUsed = []
let currentRoom = {}

exports.listen = function (server) {
  io = socketio.listen(server)

  io.set('log level', 1)

  io.sockets.on('connection', function (socket) {
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)
    joinRoom(socket, 'Lobby')

    handleMessageBroadcasting(socket, nickNames)
    handleNameChangeAttempts(socket, nickNames, namesUsed)
    handleRoomJoining(socket)

    socket.on('rooms', function () {
      socket.emit('rooms', Object.keys(io.sockets.manager.rooms))
    })

    handleClientDisconnection(socket, nickNames, namesUsed)
  })
}

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  let name = 'Guest' + guestNumber

  nickNames[socket.id] = name
  socket.emit('nameResult', {
    success: true,
    name
  })

  namesUsed.push(name)

  return guestNumber + 1
}

function joinRoom(socket, room) {
  socket.join(room)

  currentRoom[socket.id] = room

  socket.emit('joinResult', { room })

  socket.broadcast.to(room).emit('message', {
    text: nickNames[socket.id] + ' has joined ' + room + '.'
  })

  let usersInRoom = io.sockets.clients(room)
  if (usersInRoom.length > 1) {
    let usersInRoomSummary = 'Users currently in ' + room + ': '

    for (let index in usersInRoom) {
      let userSockedId = usersInRoom[index].id
      if (userSockedId !== socket.id) {
        if (index > 0) {
          usersInRoomSummary += ', '
        }
        usersInRoomSummary += nickNames[userSockedId]
      }
    }
    usersInRoomSummary += '.'
    socket.emit('message', { text: usersInRoomSummary })
  }
}

function handleMessageBroadcasting(socket, nickNames) {
  socket.on('message', function (message) {
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.text
    })
  })
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  socket.on('nameAttempt', function (name) {
    if (name.indexOf('Guest') === 0) {
      socket.emit('nameResult', {
        success: false,
        message: 'Names cannot begin with "Guest".'
      })
    } else {
      if (namesUsed.indexOf(name) === -1) {
        let previousName = nickNames[socket.id]
        let previousNameIndex = namesUsed.indexOf(previousName)
        namesUsed.push(name)
        nickNames[socket.id] = name
        delete namesUsed[previousNameIndex]

        socket.emit('nameResult', {
          success: true,
          name: name
        })
      } else {
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use.'
        })
      }
    }
  })
}

function handleRoomJoining(socket) {
  socket.on('join', function (room) {
    socket.leave(currentRoom[socket.id])
    joinRoom(socket, room.newRoom)
  })
}

function handleClientDisconnection(socket, nickNames, namesUsed) {
  socket.on('disconnect', function () {
    let nameIndex = namesUsed.indexOf(nickNames[socket.id])
    delete namesUsed[nameIndex]
    delete nickNames[socket.id]
  })
}
