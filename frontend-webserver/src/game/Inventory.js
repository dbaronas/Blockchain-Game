export default class Inventory {
    constructor() {
        this.maxColumns = 10
        this.maxRows = 3
        this.items = {}
        this.coins = 0
        this.events = new Phaser.Events.EventEmitter()
    }

    addItem(item){
        let existingKey = Object.keys(this.items).find(key => this.items[key].iem_id === item.iem_id)
        if(existingKey) {
            this.items[existingKey].quantity = parseInt(this.items[existingKey].quantity) + item.quantity
        } else {
            for (let index = 0; index < this.maxColumns * this.maxRows; index++) {
                let existingItem = this.items[index]
                if(!existingItem) {
                    this.items[index] = item
                    break
                }
            }
        }
        this.events.emit('inventoryUpdate')
    }

    incrementFishAmount(index, amount) {
        if(this.items[index].type !== 'fish') return
        this.items[index].quantity += amount
        this.events.emit('inventoryUpdate')
    }

    decreaseItem(index) {
        if (this.items[index].quantity > 1) {
            this.items[index].quantity--
        } else {
            delete this.items[index]
        }
        this.events.emit('inventoryUpdate')
    }

    addCoins(amount) {
        this.coins.quantity += amount
        this.events.emit('coinsUpdate')
    }

    getCoins() {
        return this.coins.quantity
    }

    getItem(index) {
        return this.items[index]
    }

    moveItem(start, end) {
        if(start === end || this.items[end]) return
        this.items[end] = this.items[start]
        delete this.items[start]
    }
}