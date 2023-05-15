import rods from "./FishingRods.js"
import { signMessage, getAccount } from "@wagmi/core"

export default class CatchModal extends Phaser.Scene {
    constructor() {
        super('modal')
        this.x = 0
        this.y = 0
        this.width = 0
        this.height = 0
    }

    preload() {
        this.load.image('modal', 'assets/modal.png')
        this.load.image('mintbutton', 'assets/btn.png')
    }

    create(data) {
        this.randomFishRod = data.randomFishRod
        var scene = data.scene
        var modal = this.add.sprite(0, 0, 'modal')
        var button = this.add.sprite(0, -290, 'mintbutton').setInteractive({ pixelPerfect: true }).setScale(0.8).setOrigin(0.5, 0)
        var buttonText = this.add.text(0, 0, 'MINT').setOrigin(0.5, -1).setFontSize(40)
        var text = this.add.text(0, 0, 'YOU GOT A FISH GG!').setOrigin(0.5, 2).setFontSize(20)
        var fishing_rod = this.add.sprite(0, 0, 'rods', rods[this.randomFishRod].frame).setOrigin(0.5, 2).setScale(2)
        this.container = this.add.container(650, 200, [modal, button, buttonText, text, fishing_rod])
        this.socket = this.registry.get('socket')

        this.container.setScale(0)
        this.tween = this.tweens.add({
            targets: this.container,
            scale: 1,
            ease: 'Back',
            duration: 200
        })

        button.once('pointerdown', async () => {
            const { address } = getAccount()
            buttonText.setText('Processing...').setFontSize(20).setOrigin(0.5, -2.3)
            try {
                const signature = await signMessage({
                    message: `Mint NFT to connected account\n\nto: ${address}\nnonce: ${'wip'}`,
                    
                })
                this.socket.emit('mint', { id: this.randomFishRod, signature: signature})
                this.scene.stop()
                this.scene.resume(scene.scene.key)
            } catch (error) {
                text.setText(`Transaction failed!`)
                buttonText.setText('Close')
                button.once('pointerdown', () => {
                    this.scene.stop()
                    this.scene.resume(scene.scene.key)
                })
            }
        })
    }
}