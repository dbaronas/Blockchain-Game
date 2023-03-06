import NPC from "./NPC.js"
import Player from "./Player.js"

export default class BeginningScene extends Phaser.Scene {
    constructor()   {
        super('BeginningScene')
    }
    
    preload() {
        Player.preload(this)
        this.canMove = true
        this.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            e: Phaser.Input.Keyboard.KeyCodes.E
        })
        this.load.atlas('boy', 'assets/boy.png', 'assets/boy_atlas.json')
        this.load.image('tiles', 'assets/tileset.png')
        this.load.tilemapTiledJSON('map', 'assets/tiledmap.json')
    }
    create() {
        let map = this.make.tilemap({ key: 'map' });
        var tileset = map.addTilesetImage('tileset', 'tiles', 32, 32);
        var water = map.createLayer('water', tileset, 0, 0);
        this.fishing_zone = map.createLayer('fishingZone', tileset, 0, 0);
        var ground = map.createLayer('ground', tileset, 0, 0);
        water.setCollisionBetween(1, 2)
        let testPlayer = new NPC({scene:this, x:250, y:250, texture:'boy', frame:'96'})
        testPlayer.update()

        var self = this
        this.socket = io()
        this.otherPlayers = this.physics.add.group()
        this.socket.on('currentPlayers', function (players) {
            Object.keys(players).forEach(function (id) {
                if (players[id].playerId === self.socket.id) {
                    self.addPlayer(self, players[id])
                    self.physics.add.collider(self.player, water)
                    self.physics.add.collider(self.player, testPlayer)
                    self.physics.add.collider(self.player, self.fishing_zone)
                } else {
                    self.addOtherPlayers(self, players[id])
                }
            })
        })
        this.socket.on('newPlayer', function (playerInfo) {
            self.addOtherPlayers(self, playerInfo)
        })
        this.socket.on('disc', function (playerId) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.destroy()
                }
            })
        })
        this.socket.on('playerMoved', function (playerInfo) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerInfo.playerId === otherPlayer.playerId) {
                    otherPlayer.setPosition(playerInfo.x, playerInfo.y)
                }
            })
        })
    }

    addPlayer(self, playerInfo) {
        self.player = new Player({scene:this, x: playerInfo.x, y: playerInfo.y, texture: 'boy', frame: '96'})
    }

    addOtherPlayers(self, playerInfo) {
        const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'boy').setOrigin(0.5, 0.5).setDisplaySize(50, 50)
        otherPlayer.playerId = playerInfo.playerId
        self.otherPlayers.add(otherPlayer)
    }

    update() {
        if(this.player && this.canMove) {
            this.player.update()
    
            if (this.fishing_zone.hasTileAtWorldXY(this.player.x, this.player.y, null, 0) && Phaser.Input.Keyboard.JustDown(this.inputKeys.e)) {
                const randomDelay = Phaser.Math.Between(5000, 10000)
                this.canMove = false
                console.log("fishing")
                this.fishingTimer = this.time.addEvent({
                    delay: randomDelay,
                    callback: () => {
                        this.canMove = true
                        console.log("you just got a fish boi")
                    },
                    callbackScope: this,
                    loop: false
                })
            } else {
                console.log("not fishing")
            }
    
            var x = this.player.x
            var y = this.player.y
            if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
                this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y })
            }
            this.player.oldPosition = {
                x: this.player.x,
                y: this.player.y,
            }
        } else if (!this.canMove && Phaser.Input.Keyboard.JustDown(this.inputKeys.e)) {
            this.canMove = true
            console.log("stopped fishing")
            if (this.fishingTimer) {
                this.fishingTimer.remove()
                this.fishingTimer = null
            } // cancel timer so if the player cancels, he wouldnt get fish after the timer ends
        }
    }
}