import NPC from "./NPC.js"
import Player from "./Player.js"

export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super('TutorialScene')
    }

    preload() {
        Player.preload(this)
        this.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
        })
        this.load.image('tiles2', 'assets/MasterSimple.png')
        this.load.tilemapTiledJSON('map2', 'assets/map.json')
    }

    create() {
        const map = this.make.tilemap({key: 'map2'})
        const tileset = map.addTilesetImage('MasterSimple', 'tiles2', 16, 16, 0, 0)
        const layer = map.createLayer('Tile Layer 1', tileset, 0, 0)
        this.player = new Player({scene:this, x:100, y:150, texture:'fisherman', frame:'fisherman_13', isLocal: true})
        this.player.setUsername("Arthur")
        let testPlayer = new NPC({scene:this, x:100, y:100, texture:'fisherman', frame:'fisherman_13'})
        testPlayer.update()
        this.physics.add.collider(this.player, testPlayer)
        this.physics.add.collider(this.player.username, testPlayer)
        this.physics.add.collider(this.player.selectedItem, testPlayer)
    }

    update() {
        this.player.update()
        if(this.player.x > 412 && this.player.y > 412){
            this.scene.start('BeginningScene')
        }
    }
}