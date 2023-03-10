import Item from "./Item.js"

export default class PlayerInventory {
    constructor(scene) {
        this.scene = scene
        this.items = {
            salmon: new Item(scene, 'salmon', 'salmon', 0, -80),
            pufferfish: new Item(scene, 'pufferfish', 'pufferfish', 0, -40),
            pike: new Item(scene, 'pike', 'pike', 0, 0),
            bass: new Item(scene, 'bass', 'bass', 0, 40)
        }
        // reikia padaryti kad butu nusettinti itemai tik kai juos gauna zaidejas ir kad itemus imtu is probability listo kai
        //zvejoja (ten ir image tikriausiai paloadint, kad nereiktu loading visu iskart)
        // t.y atsiustu koki item idet is scene

        this.inventory = scene.add.container(10, 10)
        const bg = scene.add.rectangle(740, 500, 80, 160, 0x000000, 0.8)

        this.inventory.add([bg])
        Object.values(this.items).forEach(item => {
            this.inventory.add(item.container)
        })
        this.inventory.setScrollFactor(0);
    }
    
    addFish(fishType) {
        this.items[fishType].incrementCount()
    }
}