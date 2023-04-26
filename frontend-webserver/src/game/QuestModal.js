export default class CatchModal extends Phaser.Scene {
    constructor() {
        super('quest-modal')
        this.x = 0
        this.y = 0
        this.width = 200
        this.height = 200
    }

    preload() {
        this.load.image('modal', 'assets/modal.png')
        this.load.image('button', 'assets/btn.png')
        this.load.spritesheet('1', 'assets/quest1.png', { frameWidth: 426, frameHeight: 240, endFrame: 136 })
        this.load.spritesheet('2', 'assets/quest2.png', { frameWidth: 426, frameHeight: 240, endFrame: 65 })
        this.load.spritesheet('3', 'assets/quest3.png', { frameWidth: 426, frameHeight: 240, endFrame: 92 })
        this.load.spritesheet('4', 'assets/quest4.png', { frameWidth: 426, frameHeight: 240, endFrame: 75 })
        this.load.spritesheet('5', 'assets/quest5.png', { frameWidth: 426, frameHeight: 240, endFrame: 168 })
        this.load.spritesheet('6', 'assets/quest6.png', { frameWidth: 426, frameHeight: 240, endFrame: 135 })
    }

    create(data) {
        var scene = data.scene
        var quest = data.quest

        const config1 = {
            key: "1",
            frames: this.anims.generateFrameNumbers('1', { start: 0, end: 136, first: 136 }),
            frameRate: 20,
            repeat: -1
        }
        const config2 = {
            key: "2",
            frames: this.anims.generateFrameNumbers('2', { start: 0, end: 65, first: 65 }),
            frameRate: 20,
            repeat: -1
        }
        const config3 = {
            key: "3",
            frames: this.anims.generateFrameNumbers('3', { start: 0, end: 92, first: 92 }),
            frameRate: 20,
            repeat: -1
        }
        const config4 = {
            key: "4",
            frames: this.anims.generateFrameNumbers('4', { start: 0, end: 75, first: 75 }),
            frameRate: 20,
            repeat: -1
        }
        const config5 = {
            key: "5",
            frames: this.anims.generateFrameNumbers('5', { start: 0, end: 168, first: 168 }),
            frameRate: 20,
            repeat: -1
        }
        const config6 = {
            key: "6",
            frames: this.anims.generateFrameNumbers('6', { start: 0, end: 135, first: 135 }),
            frameRate: 20,
            repeat: -1
        }

        this.anims.create(config1)
        this.anims.create(config2)
        this.anims.create(config3)
        this.anims.create(config4)
        this.anims.create(config5)
        this.anims.create(config6)

        switch(quest) {
            case 1:
                var questText = "Walk around with keys A, W, D, S"
                break
            case 2:
                var questText = "Go to the "
                break
            case 3:
                var questText = "Mission 3"
                break
            case 4:
                var questText = "Mission 4"
                break
            case 5:
                var questText = "Mission 5"
                break
            case 6:
                var questText = "Mission 6"
                break
        }
        var modal = this.add.image(0, 0, 'modal').setScale(2)
        var questAnim = this.add.sprite(0, -20, quest).play(quest.toString())
        var button = this.add.image(0, -190, 'button').setInteractive({ pixelPerfect: true }).setScale(0.8).setOrigin(0.5, 0)
        var buttonText = this.add.text(0, 95, 'Okay').setOrigin(0.5, -1).setFontSize(40)
        var text = this.add.text(0, -145, questText).setOrigin(0.5, 2).setFontSize(20)
        this.container = this.add.container(650, 400, [modal, questAnim, button, buttonText, text])
        button.on('pointerdown', () => {
            this.scene.stop()
            this.scene.resume(scene.scene.key)
        })
    }
}