import items from "./Items.js"

export default class ShopScene extends Phaser.Scene {
    constructor() {
        super('ShopScene')
    }

    preload() {
        this.load.image('modal', 'assets/modal.png')
    }

    init(data) {
        this.playerInventory = data.inventory
        this.parentScene = data.scene
    }

    create() {

        this.socket = this.registry.get('socket')
        var modal = this.add.image(120, 0, 'modal').setScale(2).setOrigin(0, 0)

        var itemsFinal
        const closeButton = this.add.text(1000, 150, 'X', { fill: '#000' }).setScale(2).setInteractive().on('pointerdown', () => {
        if(Array.isArray(this.playerInventory.items)) {
            itemsFinal = this.playerInventory.items.filter(item => item.item_id !== '')
        }
        if(this.parentScene.roomName != 'TutorialScene') {
            this.socket.emit('player-inventory', { items: itemsFinal, coins: this.playerInventory.coins })
        }
        this.scene.stop('ShopScene')
        this.scene.resume(this.parentScene)
        })

        this.input.keyboard.on('keydown-E', () => {
        if(Array.isArray(this.playerInventory.items)) {
            itemsFinal = this.playerInventory.items.filter(item => item.item_id !== '')
        }
        if(this.parentScene.roomName != 'TutorialScene') {
            this.socket.emit('player-inventory', { items: itemsFinal, coins: this.playerInventory.coins })
        }
        this.scene.stop('ShopScene')
        this.scene.resume(this.parentScene)
        })

        let x = 330
        let y = 190
        const itemWidth = 64
        const itemHeight = 64
        const paddingX = 30
        const paddingY = 30

        let remainingItems = []
        let fishesToSell = []
        let indexOffset = 0

        if (this.parentScene.roomName === 'BeginningScene' || this.parentScene.roomName === 'TutorialScene') {
            fishesToSell = ['salmon', 'bass', 'pike', 'pufferfish']
        } else if (this.parentScene.roomName === 'BeginningScene2') {
            fishesToSell = ['toxic_pike', 'toxic_pufferfish', 'toxic_salmon', 'toxic_bass']
        }

        for (let index in this.playerInventory.items) {
            let item = this.playerInventory.items[index]
            let itemName = item.item_id
            let itemQuantity = item.quantity
            let itemType = item.type

            if (itemType === 'fish' && fishesToSell.includes(itemName)) {
                let frame = items[itemName].frame
                let itemSlot = this.add.sprite(x, y, 'items', 0).setScale(3)
                let quantityText = this.add.text(x, y + 15, itemName + ":\n" + itemQuantity, { fill: '#000' }).setOrigin(0.5, 0).setScale(0.9)
                let fishIcon = this.add.sprite(x, y - 10, 'items', frame).setScale(2)

                let sellButton = this.add.text(x + 70, y, 'Sell', { fill: '#000' }).setInteractive()
                sellButton.on('pointerdown', () => {
                    if (itemQuantity > 0) {
                        let itemIndex = Object.keys(this.playerInventory.items).find(key => this.playerInventory.items[key].item_id === itemName)
                        this.playerInventory.decreaseItem(itemIndex)
                        this.playerInventory.addCoins(items[itemName].price)
                        itemQuantity--
                        quantityText.setText(itemName + ":\n" + itemQuantity)
                        this.scene.get('InventoryScene').refreshCoins()

                        if (itemQuantity === 0) {
                            remainingItems.forEach((remainingItem) => {
                                if (remainingItem.index > index - indexOffset) {
                                    remainingItem.icon.y -= itemHeight + paddingY
                                    remainingItem.text.y -= itemHeight + paddingY
                                    remainingItem.button.y -= itemHeight + paddingY
                                    remainingItem.slot.y -= itemHeight + paddingY
                                    remainingItem.index--
                                }
                            })

                            fishIcon.destroy()
                            quantityText.destroy()
                            itemSlot.destroy()
                            sellButton.destroy()
                        }
                    }
                })

                remainingItems.push({
                    icon: fishIcon,
                    text: quantityText,
                    button: sellButton,
                    slot: itemSlot,
                    index: index
                })

                y += itemHeight + paddingY

                if (y + itemHeight > 540) {
                    x += itemWidth + paddingX
                    y = 190
                }
            } else {
                indexOffset++
            }
        }
    }
}