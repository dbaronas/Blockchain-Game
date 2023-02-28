export default class NPC extends Phaser.Physics.Arcade.Sprite {
    constructor(data) {
        let {scene, x, y, texture, frame} = data
        super(scene, x, y, texture, frame)
        this.scene = scene
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)

    }

    static preload(scene) {
        scene.load.atlas('boy', 'assets/boy.png', 'assets/boy_atlas.json')
        scene.load.animation('boy_animation', 'assets/boy_anim.json')
    }

    update() {
        this.anims.play('idle', true)
    }
}