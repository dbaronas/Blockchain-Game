import PlayerInventory from "./PlayerInventory.js"
import DisplayName from "./DisplayName.js"

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(data) {
        let {scene, x, y, texture, frame, isLocal} = data
        super(scene, x, y, texture, frame, isLocal)
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        if(isLocal) {
            this.scene.cameras.main.setBounds(0, 0, 1280, 720)
            this.scene.cameras.main.startFollow(this)
            this.scene.cameras.main.zoom = 2
            this.inventory = new PlayerInventory(scene, this)
        }
        this.username = new DisplayName({scene: this.scene, x: this.x, y: this.y})
        this.depth = 1
        this.username.depth = 1
        this.body.setCircle(12, 5, 5)
        this.animation = 'idle'
    }

    static preload(scene) {
        scene.load.atlas('bateman', 'assets/bateman/bateman.png', 'assets/bateman/bateman_atlas.json')
        scene.load.animation('bateman_animation', 'assets/bateman/bateman_anim.json')
    }

    get velocity() {
        return this.body.velocity
    }

    setUsername(username) {
        this.username.setDisplayName(username)
    }

    update() {
        const speed = 200
        let playerVelocity = new Phaser.Math.Vector2()
        let usernameVelocity = new Phaser.Math.Vector2()
        if(this.scene.inputKeys.left.isDown) {
            playerVelocity.x = -1
            usernameVelocity.x = -1
            this.anims.play('left', true)
            this.animation = 'left'
        } else if(this.scene.inputKeys.right.isDown) {
            playerVelocity.x = 1
            usernameVelocity.x = 1
            this.anims.play('right', true)
            this.animation = 'right'
        } else {
            this.anims.play('idle', true)
            this.animation = 'idle'
        }
        if(this.scene.inputKeys.up.isDown) {
            playerVelocity.y = -1
            usernameVelocity.y = -1
        } else if(this.scene.inputKeys.down.isDown) {
            playerVelocity.y = 1
            usernameVelocity.y = 1
        }
        playerVelocity.normalize()
        usernameVelocity.normalize()
        if(this.scene.inputKeys.shift.isDown) {
            playerVelocity.scale(speed * 1.5)
            usernameVelocity.scale(speed * 1.5)
        } else {
            playerVelocity.scale(speed)
            usernameVelocity.scale(speed)
        }
        this.setVelocity(playerVelocity.x, playerVelocity.y)
        this.username.body.setVelocity(usernameVelocity.x, usernameVelocity.y)
    }
}