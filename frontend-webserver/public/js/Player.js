export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(data) {
        let {scene, x, y, texture, frame, collision} = data
        super(scene, x, y, texture, frame)
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        this.body.setCircle(8, 16, 16)
        this.setCollideWorldBounds(true)
    }

    static preload(scene) {
        scene.load.atlas('boy', 'assets/boy.png', 'assets/boy_atlas.json')
        scene.load.animation('boy_animation', 'assets/boy_anim.json')
    }

    get velocity() {
        return this.body.velocity
    }

    update() {
        const speed = 200
        let playerVelocity = new Phaser.Math.Vector2()
        if(this.scene.inputKeys.left.isDown) {
            this.flipX = true
            playerVelocity.x = -1
        } else if(this.scene.inputKeys.right.isDown) {
            this.flipX = false
            playerVelocity.x = 1
        }
        if(this.scene.inputKeys.up.isDown) {
            playerVelocity.y = -1
        } else if(this.scene.inputKeys.down.isDown) {
            playerVelocity.y = 1
        }
        playerVelocity.normalize()
        if(this.scene.inputKeys.shift.isDown) {
            playerVelocity.scale(speed * 1.5)
        } else {
            playerVelocity.scale(speed)
        }
        this.setVelocity(playerVelocity.x, playerVelocity.y)
        if(Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
            this.anims.play('walk', true)
        } else {
            this.anims.play('idle', true)
        }
    }
}