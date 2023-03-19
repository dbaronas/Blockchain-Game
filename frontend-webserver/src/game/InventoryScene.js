import items from "./Items.js"

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

    refresh() {
        this.inventorySlots.forEach(slot => this.destroyInventorySlot(slot))
        this.inventorySlots = []
        for (let index = 0; index < this.maxColumns * this.rows; index++) {
            let x = this.margin + this.tileSize / 2 + (index % this.maxColumns) * (this.tileSize + this.gridSpacing)
            let y = this.margin + this.tileSize / 2 + Math.floor(index / this.maxColumns) * (this.tileSize + this.gridSpacing)
            let inventorySlot = this.add.sprite(x, y, 'items', 4) 
            inventorySlot.setScale(this.uiScale)
            inventorySlot.depth = -1

            inventorySlot.setInteractive()
            inventorySlot.on('pointerover', pointer => {
                this.hoverIndex = index
            })

            if(index === this.selectedItemIndex) {
                inventorySlot.setTexture('items', 5)
            }

            let item = this.inventory.getItem(index)

            if(item) {
                inventorySlot.item = this.add.sprite(inventorySlot.x, inventorySlot.y - this.tileSize / 12, 'items', items[item.name].frame).setScale(1.5)
                inventorySlot.quantityText = this.add.text(inventorySlot.x, inventorySlot.y +  this.tileSize / 6, item.quantity, {
                    font: '16px Arial',
                    fill: '#111'
                }).setOrigin(0.5, 0)
                inventorySlot.item.setInteractive()
                this.input.setDraggable(inventorySlot.item)
                if(index === this.selectedItemIndex) {
                    this.events.emit('select-item', items[item.name].frame)
                }
            } else {
                if(index === this.selectedItemIndex) {
                  this.events.emit('select-item', -1)
                }
            }
            this.inventorySlots.push(inventorySlot)
        }
    }

    create(){
        this.input.keyboard.on('keydown-I',()=>{
            this.rows = this.rows === 1 ? this.maxRows : 1
            this.refresh()
        })

        this.input.setTopOnly(false)

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (deltaY > 0) {
                this.selectedItemIndex = Phaser.Math.Wrap(this.selectedItemIndex - 1, 0, this.maxColumns * this.rows)
            } else {
                this.selectedItemIndex = Phaser.Math.Wrap(this.selectedItemIndex + 1, 0, this.maxColumns * this.rows)
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
    }
}