export default class SelectedItem extends Phaser.Physics.Arcade.Sprite {
    constructor(data) {
        let {scene, x, y, texture, frame} = data
        super(scene, x, y, texture, frame)
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        this.scene.physics.add.sprite(this.x, this.y, this.texture, this.frame)
        this.visible = false
        this.body.setCircle(24, -31.6, -15.6)
        this.body.setOrigin(-0.3, 0.2)
        this.body.setScale(0.5)
    }

    setTexture(frame) {
        this.setTexture('items', frame)
    }

    setVisibility(bool) {
        this.setVisible = bool
    }
}