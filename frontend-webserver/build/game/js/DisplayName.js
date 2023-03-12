export default class DisplayName extends Phaser.GameObjects.Container {
    constructor(data) {
        let {scene, x, y} = data
        super(scene, x, y)
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        this.displayName = this.scene.add.text(0,0,'undefined',{
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#fff',
            stroke: '#000000',
            strokeThickness: 1,
            shadow: { color: '#000000', fill: true, blur: 1, stroke: true }
        }).setOrigin(0.5, 1.8)
        this.add(this.displayName)
        this.body.setCircle(12, 5, 5)
        this.body.setOffset(-11, -11)
    }

    setDisplayName(name) {
        this.displayName.text = name
    }
}