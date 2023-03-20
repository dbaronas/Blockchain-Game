export default class CatchModal extends Phaser.Scene {
    constructor() {
        super('modal')
        this.x = 0
        this.y = 0
        this.width = 0
        this.heigth = 0
    }

    static preload(scene) {
        scene.load.image('modal', 'assets/modal.png')
        scene.load.image('button', 'assets/button.png')
        
    }

    create() {
        var modal = this.add.image(0, 0, 'modal')
        var button = this.add.image(0, 0, 'button').setInteractive().setScale(0.5).setOrigin(0.5, 0)
        var buttonText = this.add.text(0, 0, 'MINT').setOrigin(0.5, -0.8).setFontSize(40)
        var text = this.add.text(0, 0, 'YOU GOT A FISH GG!').setOrigin(0.5, 2).setFontSize(20)

        this.container = this.add.container(650, 200, [modal, button, buttonText, text])
        this.container.setScale(0)
        this.tween = this.tweens.add({
            targets: this.container,
            scale: 1,
            ease: 'Back',
            duration: 200
        })
        
        button.on('pointerdown', () => {
            this.scene.stop()
        })
        
    }
}