import NPC from "./NPC.js"
import Player from "./Player.js"

export default class TutorialScene extends Phaser.Scene {
    constructor()   {
        super('TutorialScene')
    }

    preload() {
        Player.preload(this)
        this.load.image('tiles', 'assets/MasterSimple.png')
        this.load.tilemapTiledJSON('map', 'assets/map.json')
    }
    create() {
        const map = this.make.tilemap({key: 'map'})
        const tileset = map.addTilesetImage('MasterSimple', 'tiles', 16, 16, 0, 0)
        const layer = map.createLayer('Tile Layer 1', tileset, 0, 0)
        this.player = new Player({scene:this, x:100, y:150, texture:'boy', frame:'96'})
        let testPlayer = new NPC({scene:this, x:100, y:100, texture:'boy', frame:'96'})
        testPlayer.setImmovable(true).setSize(1, 1, true)
        testPlayer.body.setCircle(6, 1, 1)
        this.player.body.setCircle(6, 1, 1)
        testPlayer.update()
        this.physics.add.collider(this.player, testPlayer)
        this.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
        })
    }

    update() {
        this.player.update()
    }
}