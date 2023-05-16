import DisplayName from "./DisplayName.js"
import Inventory from "./Inventory.js"

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(data) {
        let {scene, x, y, texture, frame, isLocal} = data
        super(scene, x, y, texture, frame, isLocal)
        if (!scene.physics.world) {
            scene.physics.world.setBounds(0, 0, 1280, 720)
        }
        if (!scene.children.exists(this)) {
            scene.add.existing(this)
        }
        if (scene.physics.world && !this.body) {
            scene.physics.add.existing(this)
        }
        if(isLocal) {
            this.scene.cameras.main.setBounds(0, 0, 1280, 720)
            this.scene.cameras.main.startFollow(this)
            this.scene.cameras.main.zoom = 2
        }

        this.inventory = new Inventory()
        this.selectedItem = this.scene.physics.add.sprite(this.x, this.y, 'items', 0)
        this.selectedItem.visible = false
        this.selectedItem.setCircle(24, -31.6, -15.6)
        this.selectedItem.setOrigin(-0.3, 0.2)
        this.selectedItem.setScale(0.5)
        this.username = new DisplayName({scene: this.scene, x: this.x, y: this.y})
        this.username.depth = 1
        this.depth = 1
        this.selectedItem.depth = 2
        this.body.setCircle(12, 5, 5)
        this.animation = 'idle'

        this.levelingGui = this.scene.add.container(this.x, this.y - 40)
        this.scene.physics.add.existing(this.levelingGui)
        this.levelingGui.body.setCircle(12, 5, 5)
        this.levelingGui.body.setOffset(-11, 29)

        this.expBar = this.scene.add.graphics()
        this.levelingGui.add(this.expBar)
        this.expBar.setPosition(-30, 5)

        const barWidth = 60
        const emptyBarColor = 0x000000
        this.expBar.fillStyle(emptyBarColor, 1)
        this.expBar.fillRect(0, 0, barWidth, 8)

        var self = this

        this.scene.socket.on('statsLoaded', function () {
            const nextLevelExp = self.getNextLevelExp()
            const expPercent = self.stats.exp / nextLevelExp
            const barColor = 0x00ff00
            self.expBar.fillStyle(barColor, 1)
            self.expBar.fillRect(0, 0, barWidth * expPercent, 8)
            self.expText = self.scene.add.text(0, 9, `${self.stats.exp}/${self.getNextLevelExp()} Exp`, { fontSize: '8px', fill: '#fff' }).setResolution(5).setOrigin(0.5)
            self.levelText = self.scene.add.text(-36, 5, `${self.stats.level}`, { fontSize: '8px', fill: '#fff' }).setResolution(5)
            self.levelingGui.add([self.expText, self.levelText, self.expBar])
        })
    }

    static preload(scene) {
        scene.load.atlas('fisherman', 'assets/fisherman/fisherman.png', 'assets/fisherman/fisherman_atlas.json')
        scene.load.animation('fisherman_animation', 'assets/fisherman/fisherman_anim.json')
        scene.load.spritesheet('items', 'assets/items.png', {frameWidth: 32, frameHeight: 32})
        scene.load.spritesheet('rods', 'assets/fishing_rods.png', {frameWidth: 32, frameHeight: 32})
    }

    get velocity() {
        return this.body.velocity
    }

    setUsername(username) {
        this.username.setDisplayName(username)
    }

    addExp(exp) {
        console.log(this.stats)
        this.stats.exp += exp
        let nextLevelExp = this.getNextLevelExp()
        
        while (this.stats.exp >= nextLevelExp) {
            this.stats.exp -= nextLevelExp
            this.stats.level++
            nextLevelExp = this.getNextLevelExp()
        }
      
        this.expText.setText(`${this.stats.exp}/${nextLevelExp} Exp`)
      
        const expPercent = this.stats.exp / nextLevelExp
        const emptyBarColor = 0x000000
        const barColor = 0x00ff00
        const barWidth = 60
        this.expBar.clear()
        this.expBar.fillStyle(emptyBarColor, 1)
        this.expBar.fillRect(0, 0, barWidth, 8)
        this.expBar.fillStyle(barColor, 1)
        this.expBar.fillRect(0, 0, barWidth * expPercent, 8)
        this.levelText.setText(`${this.stats.level}`)
    }
    
    getNextLevelExp() {
        return Math.floor(100 * Math.pow(this.stats.level, 1.2))
    }

    update() {
        const speed = 200
        let playerVelocity = new Phaser.Math.Vector2()
        let usernameVelocity = new Phaser.Math.Vector2()
        let selectedItemVelocity = new Phaser.Math.Vector2()
        if(this.scene) {
            if (this.scene.inputKeys.left.isDown && this.scene.inputKeys.up.isDown) {
                playerVelocity.x = -1;
                playerVelocity.y = -1;
                usernameVelocity.x = -1;
                usernameVelocity.y = -1;
                selectedItemVelocity.x = -1;
                selectedItemVelocity.y = -1;
                this.anims.play('left', true);
                this.animation = 'left';
            } else if (this.scene.inputKeys.right.isDown && this.scene.inputKeys.up.isDown) {
                playerVelocity.x = 1;
                playerVelocity.y = -1;
                usernameVelocity.x = 1;
                usernameVelocity.y = -1;
                selectedItemVelocity.x = 1;
                selectedItemVelocity.y = -1;
                this.anims.play('right', true);
                this.animation = 'right';
            } else if (this.scene.inputKeys.left.isDown && this.scene.inputKeys.down.isDown) {
                playerVelocity.x = -1;
                playerVelocity.y = 1;
                usernameVelocity.x = -1;
                usernameVelocity.y = 1;
                selectedItemVelocity.x = -1;
                selectedItemVelocity.y = 1;
                this.anims.play('left', true);
                this.animation = 'left';
            } else if (this.scene.inputKeys.right.isDown && this.scene.inputKeys.down.isDown) {
                playerVelocity.x = 1;
                playerVelocity.y = 1;
                usernameVelocity.x = 1;
                usernameVelocity.y = 1;
                selectedItemVelocity.x = 1;
                selectedItemVelocity.y = 1;
                this.anims.play('right', true);
                this.animation = 'right';
            } else if (this.scene.inputKeys.left.isDown) {
                playerVelocity.x = -1;
                usernameVelocity.x = -1;
                selectedItemVelocity.x = -1;
                this.anims.play('left', true);
                this.animation = 'left';
            } else if (this.scene.inputKeys.right.isDown) {
                playerVelocity.x = 1;
                usernameVelocity.x = 1;
                selectedItemVelocity.x = 1;
                this.anims.play('right', true);
                this.animation = 'right';
            } else if (this.scene.inputKeys.up.isDown) {
                playerVelocity.y = -1;
                usernameVelocity.y = -1;
                selectedItemVelocity.y = -1;
                this.anims.play('up', true);
                this.animation = 'up';
            } else if (this.scene.inputKeys.down.isDown) {
                playerVelocity.y = 1;
                usernameVelocity.y = 1;
                selectedItemVelocity.y = 1;
                this.anims.play('down', true);
                this.animation = 'down';
            } else {
                this.anims.play('idle', true)
                this.animation = 'idle'
            }
            playerVelocity.normalize()
            usernameVelocity.normalize()
            selectedItemVelocity.normalize()
            if(this.scene.inputKeys.shift.isDown) {
                playerVelocity.scale(speed * 1.5)
                usernameVelocity.scale(speed * 1.5)
                selectedItemVelocity.scale(speed * 1.5)
            } else {
                playerVelocity.scale(speed)
                usernameVelocity.scale(speed)
                selectedItemVelocity.scale(speed)
            }
            this.setVelocity(playerVelocity.x, playerVelocity.y)
            this.username.body.setVelocity(usernameVelocity.x, usernameVelocity.y)
            this.levelingGui.body.setVelocity(playerVelocity.x, playerVelocity.y)
            if(this.selectedItem.body) {
                this.selectedItem.body.setVelocity(selectedItemVelocity.x, selectedItemVelocity.y)
            }
        }
    }
}