const express = require('express')
const app = express()
const server = require('http').Server(app)
const path = require('path')
const io = require('socket.io')(server)
const PORT = 3000
let maintenance = false
var players = {}


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

server.listen(PORT, () => {
    console.log('3000')
})

var players = {}

io.on('connection', function (socket) {
    console.log('a user connected: ', socket.id)
    players[socket.id] = {
      x: 500,
      y: 500,
      playerId: socket.id,
      animation: 'idle'
    }
    socket.emit('currentPlayers', players)
    socket.broadcast.emit('newPlayer', players[socket.id])
  
    socket.on('disconnect', function () {
      console.log('user disconnected: ', socket.id)
      delete players[socket.id]
      io.emit('disc', socket.id)
    })
  
    socket.on('playerMovement', function (movementData) {
      players[socket.id].x = movementData.x
      players[socket.id].y = movementData.y
      players[socket.id].animation = movementData.animation
      players[socket.id].usernamex = movementData.usernamex
      players[socket.id].usernamey = movementData.usernamey
      players[socket.id].itemx = movementData.itemx
      players[socket.id].itemy = movementData.itemy
      socket.broadcast.emit('playerMoved', players[socket.id])
    })

    socket.on('select-item-img', function(data) {
      players[socket.id].frame = data.frame
      players[socket.id].textureKey = data.textureKey
      socket.broadcast.emit('item-selected', players[socket.id]);
    })
})