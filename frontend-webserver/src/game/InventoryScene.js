import items from "./Items.js"
import rods from "./FishingRods.js"

export default class InventoryScene extends Phaser.Scene {
    constructor() {
        super('InventoryScene')
        this.rows = 1
        this.uiScale = 2
        this.gridSpacing = 4
        this.margin = 8
        this._tileSize = 32
        this.inventorySlots = []
        this.selectedItemIndex = 0
    }

    init(data) {
        let { scene } = data
        this.scene = scene
        this.inventory = scene.player.inventory
        this.maxColumns = this.inventory.maxColumns
        this.maxRows = this.inventory.maxRows
    }

    get tileSize(){
        return this._tileSize * this.uiScale
    }

    destroyInventorySlot(inventorySlot) {
        if(inventorySlot.item) inventorySlot.item.destroy()
        if(inventorySlot.quantityText) inventorySlot.quantityText.destroy()
        inventorySlot.destroy()
    }

    destroyCoinText(coinText) {
        if(coinText) coinText.destroy()
    }

    refresh() {
        this.inventorySlots.forEach(slot => this.destroyInventorySlot(slot))
        this.inventorySlots = []
        for (let index = 0; index < this.maxColumns * this.rows; index++) {
            let x = this.margin + this.tileSize / 2 + (index % this.maxColumns) * (this.tileSize + this.gridSpacing)
            let y = this.margin + this.tileSize / 2 + Math.floor(index / this.maxColumns) * (this.tileSize + this.gridSpacing)
            let inventorySlot = this.add.sprite(x, y, 'items', 0) 
            inventorySlot.setScale(this.uiScale)
            inventorySlot.depth = -1

            inventorySlot.setInteractive()
            inventorySlot.on('pointerover', pointer => {
                this.hoverIndex = index
            })

            if(index === this.selectedItemIndex) {
                inventorySlot.setTexture('items', 1)
            }

            let item = this.inventory.getItem(index)

            let textureKey = 'items'
            let frame = -1

            if(item) {
                if (item.type === 'fish') {
                    textureKey = 'items'
                    frame = items[item.iem_id].frame
                } else if (item.type === 'fishing-rod'){
                    textureKey = 'rods'
                    frame = rods[item.iem_id].frame
                }
                inventorySlot.item = this.add.sprite(inventorySlot.x, inventorySlot.y - this.tileSize / 12, textureKey, frame).setScale(1.5)
                inventorySlot.quantityText = this.add.text(inventorySlot.x, inventorySlot.y +  this.tileSize / 6, item.quantity, {
                    font: '16px Arial',
                    fill: '#111'
                }).setOrigin(0.5, 0)
                inventorySlot.item.setInteractive()
                this.input.setDraggable(inventorySlot.item)
                if(index === this.selectedItemIndex) {
                    this.scene.events.emit('select-item', { frame, textureKey })
                }
            } else {
                if(index === this.selectedItemIndex) {
                    this.scene.events.emit('select-item', { frame, textureKey })
                }
            }
            this.inventorySlots.push(inventorySlot)
        }
    }

    listenForInventoryUpdate() {
        this.inventory.events.on('inventoryUpdate', () => {
            this.refresh()
        })
    }

    listenForCoinsUpdate() {
        this.inventory.events.on('coinsUpdate', () => {
            this.refreshCoins()
        })
    }

    refreshCoins() {
        this.destroyCoinText(this.coinText)
        this.coinText = this.add.text(1240, this.margin + this.tileSize / 2 + 20, this.inventory.getCoins(), {
            font: '16px Arial',
            fill: '#111'
        }).setOrigin(0.5, 0.5)
    }

    isItemFishingRod() {
        let selectedItem = this.inventory.getItem(this.selectedItemIndex);
        return selectedItem && selectedItem.type === 'fishing-rod';
    }

    create(){
        this.listenForInventoryUpdate()
        this.listenForCoinsUpdate()
        this.coinSlot = this.add.sprite(1240, this.margin + this.tileSize / 2, 'items', 0).setScale(this.uiScale)
        this.coinSlot.depth = -1
        this.coinIcon = this.add.sprite(1240, this.margin + this.tileSize / 2 - 8, 'items', 2).setScale(this.uiScale / 1.5)

        this.input.keyboard.on('keydown-I',()=>{
            this.rows = this.rows === 1 ? this.maxRows : 1
            this.refresh()
        })

        this.input.setTopOnly(false)

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (deltaY > 0) {
                this.selectedItemIndex = Phaser.Math.Wrap(this.selectedItemIndex + 1, 0, this.maxColumns * this.rows)
            } else {
                this.selectedItemIndex = Phaser.Math.Wrap(this.selectedItemIndex - 1, 0, this.maxColumns * this.rows)
            }
            this.refresh()
        })

        this.input.on('dragstart', () => {
            this.startIndex = this.hoverIndex
            this.inventorySlots[this.startIndex].quantityText.destroy()
        })
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX
            gameObject.y = dragY
        })
        this.input.on('dragend', () => {
            this.inventory.moveItem(this.startIndex, this.hoverIndex)
            this.refresh()
        })
        this.refresh()
        this.refreshCoins()
    }
}