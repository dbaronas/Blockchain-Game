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
            align: 'left',
            padding: 10,
            fontStyle: 'normal',
            //wordWrap: {width: 355, useAdvancedWrap: true}
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
                this.scene.scene.pause('InventoryScene')
            }
        })


        this.input.keyboard.on('keydown-ESC', () => {
            if (this.isFocused === true) {
                chat.blur()
                this.scene.input.keyboard.enabled = true
                this.scene.input.keyboard.enableGlobalCapture()
                this.isFocused = false
                this.scene.scene.resume('InventoryScene')
            }
        })
        this.input.keyboard.on('keydown-ENTER', () => {
            if (chat.value !== '' && this.isFocused === true) {
                send.click()
                chat.blur()
                this.scene.input.keyboard.enabled = true
                this.scene.input.keyboard.enableGlobalCapture()
                this.isFocused = false
                this.scene.scene.resume('InventoryScene')
            }
        })

        this.chatInput.on('click', event => {
            if (event.target.name === 'send') {
                if (chat.value !== '') {
                    this.isFocused = false
                    this.io.emit('message', chat.value)
                    chat.value = ''
                    chat.blur()
                    this.scene.input.keyboard.enabled = true
                    this.scene.input.keyboard.enableGlobalCapture()
                    this.isFocused = false
                    this.scene.scene.resume('InventoryScene')
                }
                chat.blur()
                this.scene.input.keyboard.enabled = true
                this.scene.input.keyboard.enableGlobalCapture()
                this.isFocused = false
                this.scene.scene.resume('InventoryScene')
            } else if (event.target.name === 'input') {
                this.isFocused = true
                this.scene.input.keyboard.enabled = false
                this.scene.input.keyboard.disableGlobalCapture()
                this.scene.scene.pause('InventoryScene')
            }
        })

        this.setEmit()

    }

    setScene(scene) {
        this.scene = scene
    }

    setEmit() {
        this.io.on('messageResponse', (message) => {
            let parsed = this.wordWrap(message, 55)
            console.log(parsed)
            this.chatMessages.push(parsed)
            if (this.chatMessages.length > 100) {
                this.chatMessages.shift()
                this.chatContent.setText(this.chatMessages)
            } else {
                this.chatContent.setText(this.chatMessages)
            }
        })
    }

    wordWrap(str, maxWidth) {
        var newLineStr = "\n"; 
        let done = false; 
        let res = '';
        while (str.length > maxWidth) {                 
            let found = false;
            // Inserts new line at first whitespace of the line
            for (let i = maxWidth - 1; i >= 0; i--) {
                if (this.testWhite(str.charAt(i))) {
                    res = res + [str.slice(0, i), newLineStr].join('');
                    str = str.slice(i + 1);
                    found = true;
                    break;
                }
            }
            // Inserts new line at maxWidth position, the word is too long to wrap
            if (!found) {
                res += [str.slice(0, maxWidth), newLineStr].join('');
                str = str.slice(maxWidth);
            }
    
        }
    
        return res + str;
    }

    testWhite(x) {
        var white = new RegExp(/^\s$/);
        return white.test(x.charAt(0));
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