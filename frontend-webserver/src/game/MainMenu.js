export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('menu')
    }

    preload() {
        this.load.image('menu', 'assets/mainmenu.png')
        this.load.image('button', 'assets/btn.png')
    }

    create() {
        this.add.image(0, 0, 'menu').setOrigin(0)
        var button1 = this.add.image(640, 350, 'button').setInteractive()
        var text1 = this.add.text(612, 400, 'Play', {
            fontFamily: 'VT323',
            fontSize: 40,
            color: '#000000'
        })
        var button2 = this.add.image(640, 450, 'button')
        var button3 = this.add.image(640, 550, 'button')

        button1.on('pointerdown', () => {
            this.scene.stop()
            this.scene.start('BeginningScene')
        })
    }
}