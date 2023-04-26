import NPC from "./NPC.js"
import Player from "./Player.js"

export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super('TutorialScene')
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
        this.load.image('tilesbegin', 'assets/tileset.png')
        this.load.tilemapTiledJSON('map2', 'assets/tutorial_map.json')
    }

    create() {
        this.canMove = true
        this.fishTypes = ['salmon', 'bass', 'pike', 'pufferfish']
        const map = this.make.tilemap({key: 'map2'})
        const tileset = map.addTilesetImage('tileset', 'tilesbegin', 32, 32, 2, 3)
        const layer = map.createLayer('Tile Layer 1', tileset, 0, 0)
        var water = map.createLayer('water', tileset, 0, 0)
        this.fishing_zone = map.createLayer('fishingZone', tileset, 0, 0)
        water.setCollisionBetween(3, 4)
        this.player = new Player({scene:this, x:100, y:150, texture:'fisherman', frame:'fisherman_13', isLocal: true})
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

        this.scene.get('ShopScene').events.on('shutdown', () => {
            this.isShopClosed = true
        })

        this.scene.get('quest-modal').events.on('shutdown', () => {
            if (this.quest === 6) {
                this.isQuest6Closed = true
            }
        })

        this.inventoryScene = this.scene.launch('InventoryScene', {scene: this})
        this.scene.get('InventoryScene').refresh()

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
        //1. wasd viaksciot 2. move on fishing zone 3. fish with e (have to equip fishing rod) 4. sell fish to npc 5. chat
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
                    console.log("thats mission1")
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
                        console.log("Mission complete 1")
                    }
                    break
                case 2:
                    if(this.started == false) {
                        this.scene.pause()
                        this.scene.launch('quest-modal', { scene: this, quest: this.quest })
                        this.started = true
                    }
                    console.log("thats mission2")
                    if (this.fishing_zone.hasTileAtWorldXY(this.player.x, this.player.y, null, 0)) {
                        this.quest++
                        this.started = false
                        console.log("Mission complete 2")
                    }
                    break
                case 3:
                    if(this.started == false) {
                        this.scene.pause()
                        this.scene.launch('quest-modal', { scene: this, quest: this.quest })
                        this.started = true
                    }
                    console.log("thats mission3")
                    if (this.fishing_zone.hasTileAtWorldXY(this.player.x, this.player.y, null, 0) && Phaser.Input.Keyboard.JustDown(this.inputKeys.e) && this.scene.get('InventoryScene').isItemFishingRod()) {
                        const randomDelay = Phaser.Math.Between(1000, 2000)
                        this.canMove = false
                        this.fishingTimer = this.time.addEvent({
                            delay: randomDelay,
                            callback: () => {
                                this.canMove = true
                                const randomFishType = Phaser.Utils.Array.GetRandom(this.fishTypes)
                                this.player.inventory.addItem({name: randomFishType, quantity: 1, type: 'fish'})
                                this.scene.get('InventoryScene').refresh()
                            },
                            callbackScope: this,
                            loop: false
                        })
                        this.quest++
                        this.started = false
                        console.log("Mission complete 3")
                    }
                    break
                case 4:
                    if(this.started == false) {
                        this.scene.pause()
                        this.scene.launch('quest-modal', { scene: this, quest: this.quest })
                        this.started = true
                    }
                    console.log("thats mission4")
                    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.i)) {
                        this.iCounter++
                        if (this.iCounter == 2) {
                            this.quest++
                            this.started = false
                            console.log("Mission complete 4")
                        }
                    }
                    break
                case 5:
                    if(this.started == false) {
                        this.scene.pause()
                        this.scene.launch('quest-modal', { scene: this, quest: this.quest })
                        this.started = true
                    }
                    console.log("thats mission5")
                    this.npc.isInteractive = true
                    if(this.player.inventory.coins > 0 && this.isShopClosed) {
                        this.quest++
                        this.started = false
                        console.log("Mission complete 5")
                    }
                    break

                case 6:
                    console.log("thats mission6")
                    if(this.started == false) {
                        this.scene.pause()
                        this.scene.launch('quest-modal', { scene: this, quest: this.quest })
                        this.started = true
                    }
                    if(this.isQuest6Closed) {
                        this.quest++
                        this.started = false
                        this.scene.stop('InventoryScene')
                        this.scene.start('menu')
                        this.scene.stop()
                        console.log("Mission complete 6")
                    }
                    break
            }
        } else if (!this.canMove && Phaser.Input.Keyboard.JustDown(this.inputKeys.e)) {
            this.canMove = true
            if (this.fishingTimer) {
                this.fishingTimer.remove()
                this.fishingTimer = null
            }
        }
    }
}