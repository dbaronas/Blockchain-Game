const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { JSDOM } = require( "jsdom" )
const { window } = new JSDOM( "" )
const $ = require( 'jquery' )( window )
const cookie = require('cookie')
const path = require('path')
const Filter = require('bad-words')
const filter = new Filter()
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

let currentRoomName = null
const rooms = {}

io.on('connection', function (socket) {

    var cookies = cookie.parse(socket.handshake.headers.cookie)
    var token = cookies['access-token']

    socket.on('join-room', async (roomName) => {
        const response = await $.ajax({
            type: 'POST',
            url: `http://${process.env.BACKEND}/api/v1/auth/username`,
            data: { token },
            xhrFields: { withCredentials: true },
            crossDomain: true,
            async: true,
            error: function (result, status) {
                console.log(result)
            }
        })
        socket.username = response
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
            playerUsername: socket.username,
            animation: 'idle'
        }
        socket.join(roomName)

        socket.emit('currentPlayers', room.players)
        socket.to(roomName).emit('newPlayer', room.players[socket.id])

        socket.removeAllListeners('disconnect')
        socket.on('disconnect', function () {
            console.log('user disconnected: ', socket.id)
            delete room.players[socket.id]
            io.to(roomName).emit('player-left', socket.id)
            socket.disconnect()
        })
    
        socket.removeAllListeners('leave-room')
        socket.on('leave-room', function() {
            console.log('user left room: ', socket.id)
            socket.leave(roomName)
            delete room.players[socket.id]
            io.to(roomName).emit('player-left', socket.id)
        })

        socket.removeAllListeners('playerMovement')
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
    
        socket.removeAllListeners('select-item-img')
        socket.on('select-item-img', function(data) {
            if (room.players[socket.id]) {
                room.players[socket.id].frame = data.frame
                room.players[socket.id].textureKey = data.textureKey
                socket.broadcast.to(roomName).emit('item-selected', room.players[socket.id])
            }
        })

        socket.removeAllListeners('message')
        socket.on('message', (data) => {
            data = socket.username + ': ' + filter.clean(data)
            console.log(data)
            io.emit('messageResponse', data);
        })
    })
})