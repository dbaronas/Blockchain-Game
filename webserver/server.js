const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const PORT = 3000
var players = {}


//test
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})


server.listen(PORT, () => {
    console.log('3000')
})

var players = {}

io.on('connection', function (socket) {
    console.log('a user connected: ', socket.id)
    players[socket.id] = {
      x: 100,
      y: 150,
      playerId: socket.id,
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
      socket.broadcast.emit('playerMoved', players[socket.id])
    })
})