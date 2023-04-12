export default class ChatScene extends Phaser.Scene {
    constructor() {
        super('chat')
        this.chatMessages = []
    }

    init(data) {
        let { scene, io } = data
        this.scene = scene
        this.io = io
    }

    preload() {
        this.load.html('input', 'assets/chat_input.html')
    }

    create() {
        this.isFocused = false
        this.chatBox = this.add.rectangle(3, 485, 370, 200, 0x964B00).setOrigin(0)
        this.chatBox.alpha = 0.2
        var graphics = this.make.graphics()
        graphics.fillRect(3, 485, 370, 200)
        var mask = new Phaser.Display.Masks.GeometryMask(this, graphics)
        this.chatInput = this.add.dom(3, 690).createFromCache('input').setOrigin(0)
        this.chatContent = this.add.text(3, 690, '', {
            fontFamily: 'VT323',
            color: '#000000',
            padding: 10,
            fontStyle: 'normal',
            wordWrap: {width: 360}
        }).setOrigin(0, 1).setMask(mask)
        let chat = this.chatInput.getChildByName('input')
        let send = this.chatInput.getChildByName('send')
        this.chatMessages.push('Welcome to MetaOcean!')
        this.chatContent.setText(this.chatMessages)

        this.chatInput.addListener('click')

        this.zone = this.add.zone(3, 480, 370, 200).setOrigin(0).setInteractive()
        this.zone.once('pointerover', () => {
            this.zone.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                if(deltaX < 0) {
                    this.chatContent.y = this.chatContent.y + 15
                } else {
                    this.chatContent.y = this.chatContent.y - 15
                }
                if(this.chatContent.height <= 215) {
                    this.chatContent.y = Phaser.Math.Clamp(this.chatContent.y, 690, 690)
                } else {
                    this.chatContent.y = Phaser.Math.Clamp(this.chatContent.y, 690, 690 + this.chatContent.height - 215)
                }
            })
        })


        this.chatButton = this.input.keyboard.addKey('T')

        this.chatButton.on('down', () => {
            if (this.isFocused === false) {
                chat.focus()
                this.scene.input.keyboard.enabled = false
                this.scene.input.keyboard.disableGlobalCapture()
            }
        })


        this.input.keyboard.on('keydown-ESC', () => {
            if (this.isFocused === true) {
                chat.blur()
                this.scene.input.keyboard.enabled = true
                this.scene.input.keyboard.enableGlobalCapture()
                this.isFocused = false
            }
        })
        this.input.keyboard.on('keydown-ENTER', () => {
            if (chat.value !== '' && this.isFocused === true) {
                send.click()
                chat.blur()
                this.scene.input.keyboard.enabled = true
                this.scene.input.keyboard.enableGlobalCapture()
                this.isFocused = false
            }
        })

        this.chatInput.on('click', event => {
            if (event.target.name === 'send') {
                if (chat.value !== '') {
                    this.isFocused = false
                    this.io.emit('message', chat.value)
                    chat.value = ''
                }
                this.scene.input.keyboard.enabled = true
                this.scene.input.keyboard.enableGlobalCapture()
            } else if (event.target.name === 'input') {
                this.isFocused = true
                this.scene.input.keyboard.enabled = false
                this.scene.input.keyboard.disableGlobalCapture()
            }
        })

        this.io.on('messageResponse', (message) => {
            this.chatMessages.push(message)
            if (this.chatMessages.length > 100) {
                this.chatMessages.shift()
                this.chatContent.setText(this.chatMessages)
            } else {
                this.chatContent.setText(this.chatMessages)
            }
        })

    }

    setScene(scene) {
        this.scene = scene
    }

    update() {

        if (this.isFocused === false) {
            if (Phaser.Input.Keyboard.JustDown(this.chatButton)) {
                this.chatInput.getChildByName('input').value = this.chatInput.getChildByName('input').value.substring(0, this.chatInput.getChildByName('input').value.length - 1)
                this.isFocused = true
            }
        }
    }
}