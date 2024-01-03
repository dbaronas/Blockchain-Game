export default class NPC extends Phaser.Physics.Arcade.Sprite {
    constructor(data) {
        let {scene, x, y, texture, frame} = data
        super(scene, x, y, texture, frame)
        this.scene = scene
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        this.body.setCircle(12, 5, 5)
        this.setImmovable(true)
        this.circle = null
        this.isInteractive = true
    }
  
    static preload(scene) {
        scene.load.atlas('fisherman', 'assets/fisherman/fisherman.png', 'assets/fisherman/fisherman_atlas.json')
        scene.load.animation('fisherman_anim', 'assets/fisherman/fisherman_anim.json')
    }
  
    createCircle() {
        const radius = 50;
        this.circle = this.scene.add.circle(this.x, this.y, radius, 0xffffff, 0);
        this.scene.physics.add.existing(this.circle);
        this.circle.body.setCircle(radius);
        this.circle.body.setOffset(1, 1);
    }
  
    update() {
      this.anims.play('idle', true)
    }
  
    handleCollision(player, scene) {
        if (!this.circle) {
            this.createCircle()
        }
        if (this.isInteractive === true) {
            this.scene.physics.add.overlap(player, this.circle, () => {
                if (Phaser.Input.Keyboard.JustDown(this.scene.input.keyboard.addKey('E'))) {
                    this.scene.scene.pause(scene)
                    this.scene.scene.launch('ShopScene', { inventory: player.inventory, scene: scene })
                }
            })
        }
    }
}