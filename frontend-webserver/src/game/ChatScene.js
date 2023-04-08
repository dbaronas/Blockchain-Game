export default class ChatScene extends Phaser.Scene {
    constructor() {
        super('chat')
        this.chatMessages = []
    }

    preload(scene) {
        this.load.html('input','assets/chat_input.html')
    }

    create(data) {
        var { scene, io} = data
        this.chatBox = this.add.rectangle(0, 0, 370, 200, 0x964B00)
        this.chatBox.alpha = 0.2
        this.input = this.add.dom(0, 715).createFromCache('input').setOrigin(0, 1)
        this.chat = this.add.text(-185, 70, '', {
            lineSpacing: 5,
            color: '#FFFFFF',
            padding: 10,
            fontStyle: 'bold'
        })
        this.container = this.add.container(185, 580, [this.chatBox, this.chat])
        
        this.chatMessages.push('Welcome to MetaOcean!')
        this.chat.setText(this.chatMessages)

        this.input.addListener('click')

        this.input.on('click', event => {
            if(event.target.name === 'send') {
                let chat = this.input.getChildByName('input')
                if(chat.value !== '') {
                    io.emit('message', chat.value)
                    chat.value = ''
                }
                scene.input.keyboard.manager.enabled = true
            } else if(event.target.name === 'input') {
                scene.input.keyboard.manager.enabled = false
            }
        })

        io.on('messageResponse', (message) => {
            this.chatMessages.push('Vilkas: ' + message)
            if(this.chatMessages.length > 9) {
                this.chatMessages.shift()
                this.chat.setText(this.chatMessages)
            } else {
                this.chat.y = this.chat.y - 20
                this.chat.setText(this.chatMessages)
            }
        })
        
    }

    update() {

    }
}