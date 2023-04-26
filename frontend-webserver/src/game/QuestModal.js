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
        this.load.spritesheet('7', 'assets/quest7.png', { frameWidth: 426, frameHeight: 235, endFrame: 0 })
        this.load.audio('audio', 'assets/pork.mp3')
    }

    create(data) {
        var scene = data.scene
        var quest = data.quest

        let audioPork = this.sound.add('audio', { loop: false })

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
        const config7 = {
            key: "7",
            frames: this.anims.generateFrameNumbers('7', { start: 0, end: 1, first: 1 }),
            frameRate: 20,
            repeat: -1
        }

        this.anims.create(config1)
        this.anims.create(config2)
        this.anims.create(config3)
        this.anims.create(config4)
        this.anims.create(config5)
        this.anims.create(config6)
        this.anims.create(config7)

        switch(quest) {
            case 1:
                var questText = "Welcome adventurer to the MetaOcean world!\nLet's start with a simple task. Press W, A, S, D keys to walk around."
                break
            case 2:
                var questText = "In our world we have fishing zones near the water.\nYou can fish out many various things!\nYour next goal is to find a fishing zone."
                break
            case 3:
                var questText = "You can start fishing by pressing E key on your keyboard.\nRemember, you must be in a fishing zone and have a fishing rod equipped.\nTry fishing yourself."
                break
            case 4:
                var questText = "Nice catch! As you can see your fish is in your inventory.\nYou can change equipped item by using scroll wheel on the mouse.\nTo open and close your inventory press I key on your keyboard!"
                break
            case 5:
                var questText = "Great job! Now let's sell you fish to the NPC.\nFind the NPC, press E to interact with him and sell your fish.\nYou can earn in-game coins by selling various fishes.\nIn-game coins will be used to repair your fishing rods, buy bait."
                break
            case 6:
                var questText = "Our game has chat feature!\nPress T to start typing, ENTER to send the message\nand ESC to cancel writing."
                break
            case 7:
                var questText = "Now you know everything!\nGood luck with your future adventures!"
                break
        }
        var modal = this.add.image(0, 0, 'modal').setScale(2)
        var questAnim = this.add.sprite(0, -20, quest).play(quest.toString())
        if (quest === 7) {
            questAnim.setInteractive()
            questAnim.on('pointerdown', () => {
                audioPork.play()
            })
        }
        var button = this.add.image(0, -190, 'button').setInteractive({ pixelPerfect: true }).setScale(0.8).setOrigin(0.5, 0)
        var buttonText = this.add.text(0, 95, 'Okay').setOrigin(0.5, -1).setFontSize(40)
        var text = this.add.text(0, -160, questText).setOrigin(0.5, 1).setFontSize(20).setAlign("center")
        this.container = this.add.container(650, 400, [modal, questAnim, button, buttonText, text])
        button.on('pointerdown', () => {
            this.scene.stop()
            this.scene.resume(scene.scene.key)
        })
    }
}