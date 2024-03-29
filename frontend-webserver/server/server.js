const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { JSDOM } = require( "jsdom" )
const { window } = new JSDOM( "" )
const $ = require( 'jquery' )( window )
const cookie = require('cookie')
const path = require('path')
const LootTable = require('loot-table-advanced')
const Filter = require('bad-words')
const filter = new Filter()
require('dotenv').config()
let maintenance = false

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('../build'))



if(maintenance === true) {
    app.get('*', (req, res) => {
        res.sendFile(__dirname +  '/maintenance.html')
    })
} else {
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../build', 'index.html'), function(err) {
            if(err) {
                res.sendFile(__dirname +  '/maintenance.html')
            }
        })
    })
}

server.listen(process.env.PORT, () => {
    console.log('Running...')
})

let users = 0
let currentRoomName = null
const rooms = {}

io.on('connection', function (socket) {

    users++

    socket.emit('player-connected')
    console.log('player connected: ' + socket.id)

    socket.on('player-address', async (address) => {
        const response = await $.ajax({
            type: 'POST',
            url: `${process.env.BACKEND}/api/v1/db/playerData`,
            data: { address },
            xhrFields: { withCredentials: true },
            crossDomain: true,
            async: true,
            error: function (result, status) {
                console.log(result)
            }
        })
        socket.address = address
        socket.username = response.username
        socket.island = response.data.island
        socket.inventory = response.data.inventory
        socket.stats = response.data.stats
    })

    socket.on('player-play', () => {
        socket.emit('player-join', socket.island)
    })

    socket.on('join-room', async (roomName) => {

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
        socket.island = roomName
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
            let address = socket.address
            let inventory = []
            inventory.push(socket.inventory.coins)
            for(const key of Object.keys(socket.inventory.items)) {
                const item = socket.inventory.items[key]
                inventory.push(item)
            }
            for(const key of Object.keys(socket.nfts.items)) {
                const item = socket.nfts.items[key]
                inventory.push(item)
            }
            socket.stats.find(stat => stat.name === 'fishing_speed').value = 0
            let data = {
                island: socket.island,
                inventory: inventory,
                stats: socket.stats
            }
            $.ajax({
                type: 'POST',
                url: `${process.env.BACKEND}/api/v1/db/sendPlayerData`,
                data: { address, data },
                xhrFields: { withCredentials: true },
                crossDomain: true,
                async: true,
                error: function (result, status) {
                    console.log(result)
                }
            })
            users--
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
            io.emit('messageResponse', data);
        })

        socket.removeAllListeners('player-inventory')
        socket.on('player-inventory', (inventory) => {
            socket.inventory = inventory
        })

        socket.removeAllListeners('player-nfts')
        socket.on('player-nfts', (nfts) => {
            socket.nfts = nfts
        })

        socket.removeAllListeners('get-inventory')
        socket.on('get-inventory', () => {
            socket.emit('send-inventory', socket.inventory)
        })

        socket.removeAllListeners('player-stats')
        socket.on('player-stats', (stats) => {
            socket.stats = stats
            socket.emit('statsLoaded', socket.stats)
        })

        socket.removeAllListeners('update-stats')
        socket.on('update-stats', (stats) => {
            socket.stats = stats
        })
    
        socket.removeAllListeners('get-stats')
        socket.on('get-stats', () => {
            socket.emit('send-stats', socket.stats)
        })

        socket.removeAllListeners('get-pool')
        socket.on('get-pool', () => {
            $.ajax({
                type: "POST",
                url: `${process.env.BACKEND}/api/v1/db/lootPool`,
                data: { island: socket.island },
                success: async function (result) {
                    const lootPool = result
                    let pool = []
                    for await (const item of lootPool) {
                        pool.push(LootTable.LootTableEntry(item.item_id, item.weight))
                    }
                    const loot = LootTable.GetLoot(pool)
                    const item = lootPool.find(item => item.item_id === loot[0].id)
                    socket.emit('send-pool', item)
                },
                error: function (result, status) {
                    console.log(result)
                }
            })
        })

        socket.removeAllListeners('mint')
        socket.on('mint', (data) => {
            console.log(data.id)
            $.ajax({
                type: "POST",
                url: `${process.env.BACKEND}/api/v1/721/mint`,
                data: JSON.stringify({ "address": socket.address, "id": data.id, "name": "name", "durability" : 100, "signature": data.signature, "action" : "mint" }),
                contentType: "application/json",
                success: function (result) {
                    console.log(result)
                },
                error: function (result, status) {
                    console.log(result)
                }
            })
        })

        socket.removeAllListeners('get-nonce')
        socket.on('get-nonce', async () => {
            const result = await $.ajax({
                type: "POST",
                url: `${process.env.BACKEND}/api/v1/db/${socket.address}/nonce`,
                contentType: "application/json",
            })
            socket.emit('nonce', result)
        })
    })

    socket.on('player-inventory', (inventory) => {
        socket.inventory.items = inventory.items
        socket.inventory.coins = inventory.coins
    })

    socket.on('get-inventory', () => {
        socket.emit('send-inventory', socket.inventory)
    })

    socket.on('player-stats', (stats) => {
        socket.stats = stats
        socket.emit('statsLoaded')
    })

    socket.on('get-stats', () => {
        socket.emit('send-stats', socket.stats)
    })
    
    socket.on('disconnect', function () {
        console.log('player disconnected: ' + socket.id)
        users--
        socket.disconnect()
    })
})