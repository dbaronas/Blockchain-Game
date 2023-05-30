import NPC from "./NPC.js"
import Player from "./Player.js"

export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super('TutorialScene')
        this.roomName = 'TutorialScene'
    }

    preload() {
        Player.preload(this)
        NPC.preload(this)
        this.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            e: Phaser.Input.Keyboard.KeyCodes.E,
            i: Phaser.Input.Keyboard.KeyCodes.I
        })
        this.load.image('modal', 'assets/modal.png')
        this.load.image('button', 'assets/btn.png')
        this.load.image('tilesbegin', 'assets/tileset.png')
        this.load.tilemapTiledJSON('map2', 'assets/tutorial_map.json')
    }

    create() {
        this.socket = this.registry.get('socket')
        this.canMove = true
        const map = this.make.tilemap({key: 'map2'})
        const tileset = map.addTilesetImage('tileset', 'tilesbegin', 32, 32, 2, 3)
        const layer = map.createLayer('Tile Layer 1', tileset, 0, 0)
        var water = map.createLayer('water', tileset, 0, 0)
        this.fishing_zone = map.createLayer('fishingZone', tileset, 0, 0)
        water.setCollisionBetween(3, 4)
        this.player = new Player({scene:this, x:100, y:150, texture:'fisherman', frame:'fisherman_13', isLocal: true})
        this.player.expBar.destroy()
        this.player.levelingGui.destroy()
        this.player.inventory.addItem({item_id: 'fr_1', name: 'Tutorial Rod', stats: {stats: {fishing_speed: 10}}, quantity: 1, type: 'fishing_rod'})
        this.player.inventory.coins = {item_id: 'golden_coin', quantity: 0}
        this.player.setUsername("Arthur")
        this.npc = new NPC({scene:this, x:100, y:100, texture:'fisherman', frame:'fisherman_13'})
        this.npc.isInteractive = false
        this.physics.add.collider(this.player, water)
        this.physics.add.collider(this.player, this.npc)
        this.physics.add.collider(this.player, this.fishing_zone)
        this.physics.add.collider(this.player.username, water)
        this.physics.add.collider(this.player.username, this.npc)
        this.physics.add.collider(this.player.username, this.fishing_zone)
        this.physics.add.collider(this.player.selectedItem, water)
        this.physics.add.collider(this.player.selectedItem, this.npc)
        this.physics.add.collider(this.player.selectedItem, this.fishing_zone)
        this.quest = 1
        this.started = false
        this.iCounter = 0
        this.isShopClosed = false
        this.isQuest6Closed = false
        this.isQuest7Closed = false

        this.scene.get('ShopScene').events.on('shutdown', () => {
            this.isShopClosed = true
        })

        this.scene.get('quest-modal').events.on('shutdown', () => {
            if (this.quest === 6) {
                this.isQuest6Closed = true
            }
        })

        this.scene.get('quest-modal').events.on('shutdown', () => {
            if (this.quest === 7) {
                this.isQuest7Closed = true
            }
        })

        var missionButton = this.add.image(900, 348, 'button').setInteractive({ pixelPerfect: true }).setScale(0.4).setOrigin(0.5, 0).setScrollFactor(0, 0)
        var missionButtonText = this.add.text(900, 500, 'Check mission').setOrigin(0.5, -1).setFontSize(12).setScrollFactor(0, 0)

        var skipMission = this.add.image(900, 313, 'button').setInteractive({ pixelPerfect: true }).setScale(0.4).setOrigin(0.5, 0).setScrollFactor(0, 0).on('pointerdown', () => {
            this.scene.stop('InventoryScene')
            this.scene.start('BeginningScene')
            this.scene.stop()
            this.socket.off()
        })
        var skipText = this.add.text(900, 465, 'Skip tutorial').setOrigin(0.5, -1).setFontSize(12).setScrollFactor(0, 0)

        missionButton.on('pointerdown', () => {
            this.started = false
        })

        this.inventoryScene = this.scene.launch('InventoryScene', {scene: this})

        this.scene.get('TutorialScene').events.on('select-item', (data) => {
            if (data.frame === -1) {
                this.player.selectedItem.visible = false
            } else {
                if (this.player.selectedItem) {
                    this.player.selectedItem.setTexture(data.textureKey, data.frame)
                }
                this.player.selectedItem.visible = true
            }
        })
    }

    update() {
        if(this.player && this.canMove) {
            this.player.update()

            if(this.npc) {
                this.npc.update()
                this.npc.handleCollision(this.player, this)
            }

            switch(this.quest) {
                case 1:
                    if(this.started == false) {
                        this.scene.pause()
                        this.scene.launch('quest-modal', { scene: this, quest: this.quest })
                        this.started = true
                    }
                    ("thats mission1")
                    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.left)) {
                        this.aButtonClicked = true
                    }
                    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.up)) {
                        this.wButtonClicked = true
                    }
                    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.right)) {
                        this.dButtonClicked = true
                    }
                    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.down)) {
                        this.sButtonClicked = true
                    }
                    if (this.aButtonClicked && this.wButtonClicked && this.dButtonClicked && this.sButtonClicked) {
                        this.quest++
                        this.started = false
                    }
                    break
                case 2:
                    if(this.started == false) {
                        this.scene.pause()
                        this.scene.launch('quest-modal', { scene: this, quest: this.quest })
                        this.started = true
                    }
                    if (this.fishing_zone.hasTileAtWorldXY(this.player.x, this.player.y, null, 0)) {
                        this.quest++
                        this.started = false
                    }
                    break
                case 3:
                    if(this.started == false) {
                        this.scene.pause()
                        this.scene.launch('quest-modal', { scene: this, quest: this.quest })
                        this.started = true
                    }
                    if (this.fishing_zone.hasTileAtWorldXY(this.player.x, this.player.y, null, 0) && Phaser.Input.Keyboard.JustDown(this.inputKeys.e) && this.scene.get('InventoryScene').isItemFishingRod()) {
                        const randomDelay = Phaser.Math.Between(1000, 2000)
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
                                this.player.inventory.addItem({contract_type: "ERC-1155", item_id: "salmon", location: "BeginningScene", name: "Salmon", owner: null, quantity: 1, rarity: "common", stackable: true, stats: null, type: "fish", weight: 500})
                            },
                            callbackScope: this,
                            loop: false
                        })
                        this.quest++
                        this.started = false
                    }
                    break
                case 4:
                    if(this.started == false) {
                        this.scene.pause()
                        this.scene.launch('quest-modal', { scene: this, quest: this.quest })
                        this.started = true
                    }
                    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.i)) {
                        this.iCounter++
                        if (this.iCounter == 2) {
                            this.quest++
                            this.started = false
                        }
                    }
                    break
                case 5:
                    if(this.started == false) {
                        this.scene.pause()
                        this.scene.launch('quest-modal', { scene: this, quest: this.quest })
                        this.started = true
                    }
                    this.npc.isInteractive = true
                    if(this.player.inventory.coins.quantity > 0 && this.isShopClosed) {
                        this.quest++
                        this.started = false
                    }
                    break
                case 6:
                    if(this.started == false) {
                        this.scene.pause()
                        this.scene.launch('quest-modal', { scene: this, quest: this.quest })
                        this.started = true
                    }
                    if(this.isQuest6Closed) {
                        this.quest++
                        this.started = false
                    }
                    break
                case 7:
                    if(this.started == false) {
                        this.scene.pause()
                        this.scene.launch('quest-modal', { scene: this, quest: this.quest })
                        this.started = true
                    }
                    if(this.isQuest7Closed) {
                        this.quest++
                        this.started = false
                        this.scene.stop('InventoryScene')
                        this.scene.start('BeginningScene')
                        this.scene.stop()
                        this.socket.off()
                    }
                    break
            }
        }
    }
}