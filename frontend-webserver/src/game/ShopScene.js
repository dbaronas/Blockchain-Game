import { BeginningSceneFishes, BeginningScene2Fishes, items } from "./Items.js"

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

        const closeButton = this.add.text(1000, 150, 'X', { fill: '#000' }).setScale(2).setInteractive().on('pointerdown', () => {
        const items = this.playerInventory.items.filter(item => item.name !== '')
        this.socket.emit('player-inventory', { items: items, coins: this.playerInventory.coins })
        console.log(this.playerInventory.items)
        this.scene.stop('ShopScene')
        this.scene.resume(this.parentScene)
        })

        this.input.keyboard.on('keydown-E', () => {
        const items = this.playerInventory.items.filter(item => item.name !== '')
        this.socket.emit('player-inventory', { items: items, coins: this.playerInventory.coins })
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

        if (this.parentScene.roomName === 'BeginningScene') {
            fishesToSell = BeginningSceneFishes
        } else if (this.parentScene.roomName === 'BeginningScene2') {
            fishesToSell = BeginningScene2Fishes
        } else {
            fishesToSell = BeginningSceneFishes
        }

        for (let index in this.playerInventory.items) {
            let item = this.playerInventory.items[index]
            let itemName = item.name
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
                        let itemIndex = Object.keys(this.playerInventory.items).find(key => this.playerInventory.items[key].name === itemName)
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