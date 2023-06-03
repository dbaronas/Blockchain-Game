export default class Boat extends Phaser.Physics.Arcade.Sprite {
    constructor(data) {
        let {scene, x, y} = data
        super(scene, x, y, 'boat')
        this.scene = scene
        this.x = x
        this.y = y
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        this.body.setCircle(12, 5, 5)
        this.setImmovable(true)
        this.circle = null
        this.createCircle()
    }
  
    static preload(scene) {
        scene.load.image('boat', 'assets/boat.png')
    }
  
    create() {
        this.scene.add.sprite(this.x, this.y, 'boat')
    }

    createCircle() {
        const radius = 50;
        this.circle = this.scene.add.circle(this.x, this.y, radius, 0xffffff, 0);
        this.scene.physics.add.existing(this.circle);
        this.circle.body.setCircle(radius);
        this.circle.body.setOffset(1, 1);
    }
}