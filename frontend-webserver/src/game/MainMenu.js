import { getAccount } from '@wagmi/core'

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('menu')
    }

    preload() {
        this.load.image('menu', 'assets/mainmenu.png')
        this.load.image('button1', 'assets/btn.png')
    }

    create() {
        this.socket = io()
        this.socket.on('player-connected', () => {
            const { address } = getAccount()
            this.socket.emit('player-address', address)
        })
        this.registry.set('socket', this.socket)
        this.add.image(0, 0, 'menu').setOrigin(0)
        this.add.sprite(640, 350, 'button1').setInteractive({ pixelPerfect: true }).on('pointerdown', () => {
            this.socket.emit('player-play')
            this.socket.on('player-join', (data) => {
                    this.scene.stop()
                    this.scene.start(data)
            })
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