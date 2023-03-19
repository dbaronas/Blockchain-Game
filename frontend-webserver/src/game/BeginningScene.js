import CatchModal from "./CatchModal.js"
import NPC from "./NPC.js"
import Player from "./Player.js"

export default class BeginningScene extends Phaser.Scene {
    constructor() {
        super('BeginningScene')
    }
    
    preload() {
        Player.preload(this)
        CatchModal.preload(this)
        this.canMove = true
        this.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            e: Phaser.Input.Keyboard.KeyCodes.E
        })
        this.load.atlas('bateman', 'assets/bateman/bateman.png', 'assets/bateman/bateman_atlas.json')
        this.load.image('tiles', 'assets/tileset.png')
        this.load.tilemapTiledJSON('map', 'assets/map3.json')
    }

    create() {
        this.fishTypes = ['salmon', 'bass', 'pike', 'pufferfish']
        let map = this.make.tilemap({ key: 'map' });
        var tileset = map.addTilesetImage('tileset', 'tiles', 32, 32, 2, 3);
        var water = map.createLayer('water', tileset, 0, 0);
        this.fishing_zone = map.createLayer('fishingZone', tileset, 0, 0);
        var ground = map.createLayer('ground', tileset, 0, 0);
        water.setCollisionBetween(3, 4)
        let testPlayer = new NPC({scene:this, x:250, y:250, texture:'bateman', frame:'bateman_13'})
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
                    self.physics.add.collider(self.player.selectedItem, water)
                    self.physics.add.collider(self.player.selectedItem, testPlayer)
                    self.physics.add.collider(self.player.selectedItem, self.fishing_zone)
                    self.physics.add.collider(self.player.username, water)
                    self.physics.add.collider(self.player.username, testPlayer)
                    self.physics.add.collider(self.player.username, self.fishing_zone)
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
                    otherPlayer.username.destroy()
                    otherPlayer.selectedItem.destroy()
                }
            })
        })
        this.socket.on('playerMoved', function (playerInfo) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerInfo.playerId === otherPlayer.playerId) {
                    otherPlayer.setPosition(playerInfo.x, playerInfo.y)
                    otherPlayer.username.setPosition(playerInfo.usernamex, playerInfo.usernamey)
                    otherPlayer.anims.play(playerInfo.animation, true)
                    otherPlayer.selectedItem.setPosition(playerInfo.itemx, playerInfo.itemy)
                }
            })
        })

        this.socket.on('item-selected', function(playerInfo) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerInfo.playerId === otherPlayer.playerId) {
                    if (playerInfo.frame === -1) {
                        otherPlayer.selectedItem.visible = false
                    } else {
                        otherPlayer.selectedItem.visible = true
                        otherPlayer.selectedItem.setTexture('items', playerInfo.frame)
                        console.log(otherPlayer.selectedItem)
                    }
                }
            })
        })

        this.scene.get('InventoryScene').events.on('select-item', (frame) => {
            if (frame === -1) {
                this.player.selectedItem.visible = false
                this.socket.emit('select-item-img', { frame: frame }) //geriau butu turet tuscia frame, nereiktu if'u tiek (ji det image pradzioj kad butu galima paskui papildyt items.png)
            } else {
                if (this.player.selectedItem) {
                    this.player.selectedItem.setTexture('items', frame)
                    this.socket.emit('select-item-img', { frame: frame })
                }
                this.player.selectedItem.visible = true
            }
        })
    }

    addPlayer(self, playerInfo) {
        self.player = new Player({scene:this, x: playerInfo.x, y: playerInfo.y, texture: 'bateman', frame: 'bateman_13', isLocal: true})
        self.player.setUsername("Arthur")
        self.inventoryScene = self.scene.launch('InventoryScene', {scene: this})
    }

    addOtherPlayers(self, playerInfo) {
        const otherPlayer = new Player({scene: this, x: playerInfo.x, y: playerInfo.y, texture: 'bateman', frame: 'bateman_13', isLocal: false})
        otherPlayer.playerId = playerInfo.playerId
        otherPlayer.animation = playerInfo.animation
        otherPlayer.setUsername("ArthurKitas")
        self.otherPlayers.add(otherPlayer)
    }

    update() {
        if(this.player && this.canMove) {
            this.player.update()
    
            if (this.fishing_zone.hasTileAtWorldXY(this.player.x, this.player.y, null, 0) && Phaser.Input.Keyboard.JustDown(this.inputKeys.e)) {
                const randomDelay = Phaser.Math.Between(1000, 2000)
                this.canMove = false
                console.log("fishing")
                this.fishingTimer = this.time.addEvent({
                    delay: randomDelay,
                    callback: () => {
                        this.canMove = true
                        const randomFishType = Phaser.Utils.Array.GetRandom(this.fishTypes);
                        console.log(randomFishType)
                        this.player.inventory.addItem({name: randomFishType, quantity: 1})
                        this.scene.get('InventoryScene').refresh()
                        this.modal = new CatchModal()
                        this.add.existing(this.modal)
                        this.scene.launch('modal')
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
                this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y, animation: this.player.animation, usernamex: this.player.username.x,
                usernamey: this.player.username.y, itemx: this.player.selectedItem.x, itemy: this.player.selectedItem.y })
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
            } // cancel timer so if the player cancels fishing, he wouldnt get fish after the timer ends
        }
    }
}