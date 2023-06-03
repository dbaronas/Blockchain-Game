import nfts from "./NFTs.js"

export default class NFTsDisplay extends Phaser.Scene {
    constructor() {
        super('NFTsDisplay')
        this.x = 0
        this.y = 0
        this.width = 0
        this.height = 0
    }

    init(data) {
        this.parentScene = data.scene
        this.playerNFTs = data.nfts
    }

    preload() {
        this.load.image('modal', 'assets/modal.png')
        this.load.image('mintbutton', 'assets/btn.png')
    }

    create() {
        var modal = this.add.sprite(0, 0, 'modal').setScale(1.8)
        var closeButton = this.add.text(340, -190, 'X', { fill: '#000' }).setScale(1.5).setInteractive().on('pointerdown', () => {
            this.scene.resume('InventoryScene')
            this.scene.resume(this.parentScene.roomName)
            this.scene.stop()
        })
        this.input.keyboard.on('keydown-E', () => {
            this.scene.resume('InventoryScene')
            this.scene.resume(this.parentScene.roomName)
            this.scene.stop()
        })
        this.container = this.add.container(650, 300, [modal, closeButton])

        const nftMargin = 150
        const nftWidth = 64
        const nftHeight = 64
        const statTextOffset = 16
        
        this.playerNFTs.forEach((nft, index) => {
            const xPos = -this.playerNFTs.length * (nftWidth + nftMargin) / 2 + index * (nftWidth + nftMargin) + 100
            const yPos = -20
      
            const nftSprite = this.add.sprite(xPos, yPos, 'nfts', nfts[nft.item_id].frame).setOrigin(0.5, 0.5).setScale(0.7)
            this.container.add(nftSprite)
      
            const fishingSpeedText = this.add.text(xPos, yPos - 100 + statTextOffset, `Fishing Speed: ${nft.stats.stats.fishing_speed}`, {
                fontFamily: 'VT323',
                fontSize: '18px',
                color: '#fff',
                stroke: '#000000',
                strokeThickness: 1,
                shadow: { color: '#000000', fill: true, blur: 1, stroke: true }
            }).setOrigin(0.5, 0)
            this.container.add(fishingSpeedText)
      
            const catchLuckText = this.add.text(xPos, yPos - 100 + statTextOffset * 2, `Catch Luck: ${nft.stats.stats.catch_luck}`, {
                fontFamily: 'VT323',
                fontSize: '18px',
                color: '#fff',
                stroke: '#000000',
                strokeThickness: 1,
                shadow: { color: '#000000', fill: true, blur: 1, stroke: true }
            }).setOrigin(0.5, 0)
            this.container.add(catchLuckText)
        })
    }
}