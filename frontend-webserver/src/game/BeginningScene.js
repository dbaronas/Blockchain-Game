import NPC from "./NPC.js"
import Player from "./Player.js"
import Boat from "./Boat.js"
import items from "./Items.js"

export default class BeginningScene extends Phaser.Scene {
    constructor() {
        super('BeginningScene')
        this.roomName = 'BeginningScene'
    }

    init(data) {
        this.playerInventory = data.inventory
        this.playerStats = data.stats
        this.socket = data.socket
        this.playerNFTs = data.nfts
    }

    preload() {
        Player.preload(this)
        NPC.preload(this)
        Boat.preload(this)
        this.load.atlas('fisherman', 'assets/fisherman/fisherman.png', 'assets/fisherman/fisherman_atlas.json')
        this.load.image('tiles', 'assets/tileset.png')
        this.load.tilemapTiledJSON('map', 'assets/map3.json')
        this.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            e: Phaser.Input.Keyboard.KeyCodes.E,
            f: Phaser.Input.Keyboard.KeyCodes.F
        })
    }

    create() {
        this.canMove = true
        this.fishTypes = ['salmon', 'bass', 'pike', 'pufferfish']
        this.fishRod = ['fr_1', 'fr_2']
        let map = this.make.tilemap({ key: 'map' })
        var tileset = map.addTilesetImage('tileset', 'tiles', 32, 32, 2, 3)
        var water = map.createLayer('water', tileset, 0, 0)
        this.fishing_zone = map.createLayer('fishingZone', tileset, 0, 0)
        var ground = map.createLayer('ground', tileset, 0, 0)
        this.boat = new Boat({scene:this, x:670, y:690})
        water.setCollisionBetween(3, 4)
        this.npc = new NPC({scene:this, x:250, y:250, texture:'fisherman', frame:'fisherman_13'})

        this.teleportText = this.add.text(670, 680,'Teleport to the next island (F)',{
            fontFamily: 'VT323',
            fontSize: '10px',
            color: '#fff',
            stroke: '#000000',
            strokeThickness: 1,
            shadow: { color: '#000000', fill: true, blur: 1, stroke: true }
        }).setOrigin(0.5, 2.2).setResolution(5)
        this.teleportText.setDepth(2)
        this.boatOverlapTween = null

        this.scene.get('chat').setScene(this)
        var self = this
        this.socket = this.registry.get('socket')
        this.socket.emit('join-room', this.roomName)
        this.otherPlayers = this.physics.add.group()
        this.socket.on('currentPlayers', function (players) {
            Object.keys(players).forEach(function (id) {
                if (players[id].playerId === self.socket.id) {
                    self.addPlayer(self, players[id])
                    self.physics.add.collider(self.player, water)
                    self.physics.add.collider(self.player, self.npc)
                    self.physics.add.collider(self.player, self.fishing_zone)
                    self.physics.add.collider(self.player.selectedItem, water)
                    self.physics.add.collider(self.player.selectedItem, self.npc)
                    self.physics.add.collider(self.player.selectedItem, self.fishing_zone)
                    self.physics.add.collider(self.player.levelingGui, water)
                    self.physics.add.collider(self.player.levelingGui, self.npc)
                    self.physics.add.collider(self.player.levelingGui, self.fishing_zone)
                    self.physics.add.collider(self.player.username, water)
                    self.physics.add.collider(self.player.username, self.npc)
                    self.physics.add.collider(self.player.username, self.fishing_zone)
                } else {
                    self.addOtherPlayers(self, players[id])
                }
            })
        })
        this.socket.on('newPlayer', function (playerInfo) {
            self.addOtherPlayers(self, playerInfo)
        })
        this.socket.on('player-left', function (playerId) {
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
                        otherPlayer.selectedItem.setTexture(playerInfo.textureKey, playerInfo.frame)
                    }
                }
            })
        })

        this.scene.get('BeginningScene').events.on('select-item', (data) => {
            if (data.frame === -1) {
                this.player.selectedItem.visible = false
                this.socket.emit('select-item-img', { frame: data.frame })
            } else {
                if (this.player.selectedItem) {
                    this.player.selectedItem.setTexture(data.textureKey, data.frame)
                    this.socket.emit('select-item-img', { frame: data.frame, textureKey: data.textureKey })
                }
                this.player.selectedItem.visible = true
            }
            if (data.textureKey === 'rods' && this.player.stats) {
                this.player.stats.find(stat => stat.name === 'fishing_speed').value += data.rodStats - this.player.lastRodSpeed
                this.player.lastRodSpeed = data.rodStats
            }
        })
    }

    addPlayer(self, playerInfo) {
        self.player = new Player({scene: this, x: playerInfo.x, y: playerInfo.y, texture: 'fisherman', frame: 'fisherman_13', isLocal: true})
        if(this.playerStats) {
            this.player.stats = this.playerStats
            self.socket.emit('player-stats', this.player.stats)
        } else {
            self.socket.emit('get-stats')
            self.socket.on('send-stats', (stats) => {
                if (stats) {
                    this.player.stats = stats
                    self.socket.emit('player-stats', this.player.stats)
                }
            })
        }
        if(this.playerInventory && this.player.nftsList) {
            this.player.inventory = this.playerInventory
            this.player.nftsList = this.playerNFTs
            self.socket.emit('player-inventory', { items: this.player.inventory.items, coins: this.player.inventory.coins })
            self.socket.emit('player-nfts', { items: this.player.nftsList })
        } else {
            self.socket.emit('get-inventory')
            self.socket.on('send-inventory', (inventory) => {
                this.player.inventory.items = []
                inventory.forEach(item => {
                    if(item.item_id == 'golden_coin') {
                        this.player.inventory.coins = item
                    } else if (item.type == 'trophy'){
                        this.player.nftsList.push(item)
                        this.player.stats.find(stat => stat.name === 'fishing_speed').value += item.stats.stats.fishing_speed
                    } else {
                        this.player.inventory.items.push(item)
                    }
                })
                self.socket.emit('player-nfts', { items: this.player.nftsList })
                self.socket.emit('player-inventory', { items: this.player.inventory.items, coins: this.player.inventory.coins })
                this.scene.get('InventoryScene').refresh()
                this.scene.get('InventoryScene').refreshCoins()
            })
        }
        self.player.setUsername(playerInfo.playerUsername)
        self.inventoryScene = self.scene.launch('InventoryScene', {scene: this})
        if(!this.scene.isActive('chat')) {
            self.scene.launch('chat', {scene: this, io: this.socket})
        } else {
            self.scene.get('chat').setEmit()
        }
    }

    addOtherPlayers(self, playerInfo) {
        const otherPlayer = new Player({scene: this, x: playerInfo.x, y: playerInfo.y, texture: 'fisherman', frame: 'fisherman_13', isLocal: false})
        otherPlayer.playerId = playerInfo.playerId
        otherPlayer.animation = playerInfo.animation
        otherPlayer.setUsername(playerInfo.playerUsername)
        if(otherPlayer.levelingGui) {
            otherPlayer.levelingGui.destroy()
        }
        self.otherPlayers.add(otherPlayer)
    }

    update() {
        if(this.player && this.canMove) {
            this.player.update()

            if(this.npc) {
                this.npc.update()
                this.npc.handleCollision(this.player, this)
            }

            if (this.boat) {
                if (this.physics.overlap(this.player, this.boat.circle)) {
                    this.teleportText.setVisible(true)
                    if (!this.boatOverlapTween) {
                        this.boatOverlapTween = this.tweens.add({
                            targets: this.teleportText,
                            alpha: 0.4,
                            duration: 1000,
                            ease: 'Power1',
                            yoyo: true,
                            repeat: -1,
                        })
                    }
                    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.f)) {
                        this.boatOverlapTween.stop()
                        this.boatOverlapTween = null
                        this.socket.emit('leave-room')
                        this.scene.start('BeginningScene2', { inventory: this.player.inventory, stats: this.player.stats, socket: this.socket, nfts: this.player.nftsList })
                        this.socket.off()
                        this.scene.stop('BeginningScene')
                    }
                } else {
                    if (this.boatOverlapTween) {
                        this.boatOverlapTween.stop()
                        this.boatOverlapTween = null
                        this.teleportText.setAlpha(1)
                    }
                    this.teleportText.setVisible(false)
                }
            }
    
            if(this.fishing_zone.hasTileAtWorldXY(this.player.x, this.player.y, null, 0) && Phaser.Input.Keyboard.JustDown(this.inputKeys.e) && this.scene.get('InventoryScene').isItemFishingRod()) {
                this.player.setVelocity(0)
                this.player.username.body.setVelocity(0)
                this.player.selectedItem.setVelocity(0)
                this.player.levelingGui.body.setVelocity(0)
                const speed = 1 - (this.player.stats.find(stat => stat.name === 'fishing_speed').value / 100)
                const minDelay = 1000 * speed
                const maxDelay = 2000 * speed
                const randomDelay = Phaser.Math.Between(minDelay, maxDelay)
                console.log('player: ' + this.player)
                console.log('min: ' + minDelay)
                console.log('max: ' + maxDelay)
                console.log('delay: ' + randomDelay)
                console.log('speed stat:' + this.player.stats.find(stat => stat.name === 'fishing_speed').value)
                console.log('speed:' + speed)
                this.canMove = false
                this.fishingText = this.add.text(this.player.x - 30, this.player.y - 48, 'Fishing...', {
                    fontSize: '10px',
                    fill: '#000000'
                }).setDepth(100).setResolution(5)
                this.tweens.add({
                    targets: this.fishingText,
                    alpha: 0,
                    duration: 1000,
                    ease: 'Power1',
                    yoyo: true,
                    repeat: -1
                })
                this.fishingText.setVisible(true)
                this.fishingTimer = this.time.addEvent({
                    delay: randomDelay,
                    callback: () => {
                        this.fishingText.setVisible(false)
                        this.canMove = true
                        self = this
                        this.socket.emit('get-pool')
                        this.socket.removeAllListeners('send-pool')
                        this.socket.on('send-pool', function(item) {
                            item.quantity = 1
                            if(item.type === 'fish') {
                                self.player.inventory.addItem(item)
                                self.socket.emit('player-inventory', { items: self.player.inventory.items, coins: self.player.inventory.coins })
                                self.player.addExp(items[item.item_id].exp)
                                self.socket.emit('update-stats', self.player.stats)
                            } else if (item.type === 'fishing_rod' || item.type === 'trophy') {
                                self.scene.pause()
                                self.scene.launch('modal', { randomNFT: item, scene: self.scene, type: item.type })
                                if (item.type === 'fishing_rod') {
                                    self.socket.emit('player-inventory', { items: self.player.inventory.items, coins: self.player.inventory.coins })
                                }
                            }
                        })
                    },
                    callbackScope: this,
                    loop: false
                })
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
            if (this.fishingTimer) {
                this.fishingTimer.remove()
                this.fishingTimer = null
                this.fishingText.setVisible(false)
            }
        }
    }
}