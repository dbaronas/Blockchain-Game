import rods from "./FishingRods.js"

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
        this.load.image('button', 'assets/button.png')
    }

    create(data) {
        this.randomFishRod = data.randomFishRod
        var scene = data.scene
        console.log(this.randomFishRod)
        var modal = this.add.sprite(0, 0, 'modal')
        var button = this.add.sprite(0, 0, 'button').setInteractive({ pixelPerfect: true }).setScale(0.5).setOrigin(0.5, 0)
        var buttonText = this.add.text(0, 0, 'MINT').setOrigin(0.5, -1).setFontSize(40)
        var text = this.add.text(0, 0, 'YOU GOT A FISH GG!').setOrigin(0.5, 2).setFontSize(20)
        var fishing_rod = this.add.sprite(0, 0, 'rods', rods[this.randomFishRod].frame).setOrigin(0.5, 2).setScale(2)
        this.container = this.add.container(650, 200, [modal, button, buttonText, text, fishing_rod])

        this.container.setScale(0)
        this.tween = this.tweens.add({
            targets: this.container,
            scale: 1,
            ease: 'Back',
            duration: 200
        })

        button.on('pointerdown', () => {
            $.ajax({
                type: "POST",
                url: "http://193.219.91.103:6172/api/v1/mint",
                data: JSON.stringify({ "address": "0x0746A08dB469275d7db9EAFDF6Bca5BA78403b4b", "id" : "fr_2" }),
                contentType: "application/json",
                success: function (result) {
                    console.log(result);
                },
                error: function (result, status) {
                    console.log(result);
                }
            });
            this.scene.stop()
            this.scene.resume(scene.scene.key)
        })
    }
}