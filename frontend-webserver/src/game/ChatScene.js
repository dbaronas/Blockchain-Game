export default class ChatScene extends Phaser.Scene {
    constructor() {
        super('chat')
        this.chatMessages = []
    }

    preload(scene) {
        this.load.html('input', 'assets/chat_input.html')
    }

    create(data) {
        var { scene, io } = data
        this.isFocused = false
        this.chatBox = this.add.rectangle(0, 0, 370, 200, 0x964B00)
        this.chatBox.alpha = 0.2
        this.chatInput = this.add.dom(0, 715).createFromCache('input').setOrigin(0, 1)
        this.chat = this.add.text(-185, 70, '', {
            lineSpacing: 5,
            color: '#FFFFFF',
            padding: 10,
            fontStyle: 'bold'
        })
        this.container = this.add.container(185, 580, [this.chatBox, this.chat])
        let chat = this.chatInput.getChildByName('input')
        let send = this.chatInput.getChildByName('send')
        this.chatMessages.push('Welcome to MetaOcean!')
        this.chat.setText(this.chatMessages)

        this.chatInput.addListener('click')

        this.chatButton = this.input.keyboard.addKey('T')

        this.chatButton.on('down', () => {
            if (this.isFocused === false) {
                chat.focus()
                scene.input.keyboard.enabled = false
                scene.input.keyboard.disableGlobalCapture()
            }
        })


        this.input.keyboard.on('keydown-ESC', () => {
            if (this.isFocused === true) {
                chat.blur()
                scene.input.keyboard.enabled = true
                scene.input.keyboard.enableGlobalCapture()
                this.isFocused = false
            }
        })
        this.input.keyboard.on('keydown-ENTER', () => {
            if (chat.value !== '' && this.isFocused === true) {
                send.click()
                chat.blur()
                scene.input.keyboard.enabled = true
                scene.input.keyboard.enableGlobalCapture()
                this.isFocused = false
            }
        })

        this.chatInput.on('click', event => {
            if (event.target.name === 'send') {
                if (chat.value !== '') {
                    io.emit('message', chat.value)
                    chat.value = ''
                }
                scene.input.keyboard.enabled = true
                scene.input.keyboard.enableGlobalCapture()
            } else if (event.target.name === 'input') {
                scene.input.keyboard.enabled = false
                scene.input.keyboard.disableGlobalCapture()
            }
        })

        io.on('messageResponse', (message) => {
            this.chatMessages.push(io.id + ': ' + message)
            if (this.chatMessages.length > 9) {
                this.chatMessages.shift()
                this.chat.setText(this.chatMessages)
            } else {
                this.chat.y = this.chat.y - 20
                this.chat.setText(this.chatMessages)
            }
        })

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