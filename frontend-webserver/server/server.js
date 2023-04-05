const express = require('express')
const app = express()
const server = require('http').Server(app)
const path = require('path')
const io = require('socket.io')(server)
require('dotenv').config()
let maintenance = false

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('../build'))

if(maintenance === true) {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build','maintenance.html'))
  })
} else {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'), function(err) {
      if(err) {
        res.sendFile(path.resolve(__dirname, '../build', 'maintenance.html'))
      }
    })
})
}

server.listen(process.env.PORT, () => {
    console.log('Running...')
})

const rooms = {}
let currentRoomName = null

io.on('connection', function (socket) {
    socket.on('join-room', (roomName) => {
        console.log('a user connected to room ' + roomName + ': ', socket.id)

        if (currentRoomName !== null && currentRoomName !== roomName) {
            const currentRoom = rooms[currentRoomName]
            delete currentRoom.players[socket.id]
            socket.leave(currentRoomName)
            io.to(currentRoomName).emit('player-left', socket.id)
        }

        currentRoomName = roomName

        let room = rooms[roomName]

        if (!room) {
            room = { players: {} }
            rooms[roomName] = room
        }

        room.players[socket.id] = {
            x: 500,
            y: 500,
            playerId: socket.id,
            animation: 'idle'
        }
        socket.join(roomName)

        socket.emit('currentPlayers', room.players)
        socket.broadcast.to(roomName).emit('newPlayer', room.players[socket.id])

        // socket.on('switch-scene', (sceneName, roomName) => {
        //     socket.leave(roomName)
        //     console.log(`user left room: ${roomName}`)
        //     io.to(roomName).emit('player-left', socket.id)
        //     socket.join(sceneName)
        //     console.log(`user joined room: ${sceneName}`)
        // })

        socket.on('disconnect', function () {
            console.log('user disconnected: ', socket.id)
            delete room.players[socket.id]
            io.to(roomName).emit('player-left', socket.id)
        })
    
        socket.on('leave-room', function () {
            console.log('user left room: ', socket.id)
            socket.leave(roomName)
            delete room.players[socket.id]
            io.to(roomName).emit('player-left', socket.id)
        })

        socket.on('playerMovement', function (movementData) {
            if (room.players[socket.id]) {
                room.players[socket.id].x = movementData.x
                room.players[socket.id].y = movementData.y
                room.players[socket.id].animation = movementData.animation
                room.players[socket.id].usernamex = movementData.usernamex
                room.players[socket.id].usernamey = movementData.usernamey
                room.players[socket.id].itemx = movementData.itemx
                room.players[socket.id].itemy = movementData.itemy
                socket.broadcast.to(roomName).emit('playerMoved', room.players[socket.id])
            }
        })
    
        socket.on('select-item-img', function(data) {
            if (room.players[socket.id]) {
                room.players[socket.id].frame = data.frame
                room.players[socket.id].textureKey = data.textureKey
                socket.broadcast.to(roomName).emit('item-selected', room.players[socket.id])
            }
        })
    })
})