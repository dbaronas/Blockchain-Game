import NPC from "./NPC.js"
import Player from "./Player.js"

export default class BeginningScene extends Phaser.Scene {
    constructor()   {
        super('BeginningScene')
    }
    
    preload() {
        Player.preload(this)
        this.load.atlas('boy', 'assets/boy.png', 'assets/boy_atlas.json')
        this.load.image('tiles', 'assets/RPG Nature Tileset.png')
        this.load.tilemapTiledJSON('map', 'assets/tiledmap.json')
    }
    create() {
        let map = this.make.tilemap({ key: 'map' });
        var tileset = map.addTilesetImage('tileset', 'tiles');
        var ground = map.createStaticLayer('ground', tileset, 0, 0);
        var water = map.createStaticLayer('water', tileset, 0, 0);
        var fishing_zone = map.createStaticLayer('fishingzone', tileset, 0, 0);
        water.setCollisionBetween(41, 42)
        let testPlayer = new NPC({scene:this, x:100, y:100, texture:'boy', frame:'96'})
        testPlayer.setImmovable(true).setSize(1, 1, true)
        testPlayer.body.setCircle(10, 15, 15)
        testPlayer.update()

        var self = this
        this.socket = io()
        this.otherPlayers = this.physics.add.group()
        this.socket.on('currentPlayers', function (players) {
            Object.keys(players).forEach(function (id) {
                if (players[id].playerId === self.socket.id) {
                    self.addPlayer(self, players[id])
                    self.player.body.setCircle(10, 15, 15)
                    self.physics.add.collider(self.player, water)
                    self.physics.add.collider(self.player, testPlayer)
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

        this.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
        })
    }

    addPlayer(self, playerInfo) {
        self.player = new Player({scene:this, x: playerInfo.x, y: playerInfo.y, texture: 'player_male', frame: 'townsfolk_m_idle_1'})
    }

    addOtherPlayers(self, playerInfo) {
        const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'boy').setOrigin(0.5, 0.5).setDisplaySize(50, 50)
        otherPlayer.playerId = playerInfo.playerId
        self.otherPlayers.add(otherPlayer)
    }

    update() {
        if(this.player) {
            this.player.update()

            var x = this.player.x
            var y = this.player.y
            if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
                this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y })
            }
            // save old position data
            this.player.oldPosition = {
                x: this.player.x,
                y: this.player.y,
            }
        }
    }
}