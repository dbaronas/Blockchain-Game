export default class Item {
    constructor(scene, name, iconKey, count = 0, positionY = 0) {
        this.name = name
        this.count = count
  
        this.icon = scene.add.sprite(40, 10, iconKey)
        this.countText = scene.add.text(0, 0, `x${count}`, { font: '16px Arial', color: '#ffffff' })
        this.countText.setName(`${name}CountText`)
  
        const container = scene.add.container(710, 510 + positionY, [this.icon, this.countText])
        this.container = container
    }
  
    incrementCount() {
        this.count++
        this.countText.setText(`x${this.count}`)
    }
}