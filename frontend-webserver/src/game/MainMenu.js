import { getAccount, signMessage } from '@wagmi/core'

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('menu')
    }

    preload() {
        this.load.image('menu', 'assets/mainmenu.png')
        this.load.image('button1', 'assets/btn.png')
    }

    create() {
        this.registry.set('socket', io())
        this.add.image(0, 0, 'menu').setOrigin(0)
        this.add.sprite(640, 350, 'button1').setInteractive({ pixelPerfect: true }).on('pointerdown', () => {
            this.scene.stop()
            this.scene.start('TutorialScene')
        })
        this.add.text(612, 400, 'Play', {
            fontFamily: 'VT323',
            fontSize: 40,
            color: '#000000'
        })
        this.add.sprite(640, 450, 'button1').setInteractive({ pixelPerfect: true })
        this.add.sprite(640, 550, 'button1').setInteractive({ pixelPerfect: true })
    }
}