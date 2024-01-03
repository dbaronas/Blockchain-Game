import rods from "./FishingRods.js"
import nfts from "./NFTs.js"
import { signMessage, getAccount } from "@wagmi/core"

export default class CatchModal extends Phaser.Scene {
    constructor() {
        super('modal')
        this.x = 0
        this.y = 0
        this.width = 0
        this.height = 0
    }

    preload() {
        this.load.image('modal', 'assets/modal.png')
        this.load.image('mintbutton', 'assets/btn.png')
    }

    create(data) {
        this.randomNFT = data.randomNFT
        var scene = data.scene
        var type = data.type
        var modal = this.add.sprite(0, 0, 'modal').setScale(1.5)
        var button = this.add.sprite(0, -240, 'mintbutton').setInteractive({ pixelPerfect: true }).setScale(0.8).setOrigin(0.5, 0)
        var buttonText = this.add.text(0, 50, 'MINT').setOrigin(0.5, -1).setFontSize(40)
        var text = this.add.text(0, 70, 'YOU GOT A FISH GG!').setOrigin(0.5, 2).setFontSize(20)

        this.socket = this.registry.get('socket')

        if(type === 'fishing_rod') {
            this.nft_img = this.add.sprite(0, 0, 'rods', rods[this.randomNFT.item_id].frame).setOrigin(0.5, 1.5).setScale(3)
        } else if (type === 'trophy') {
            this.nft_img = this.add.sprite(0, 0, 'nfts', nfts[this.randomNFT.item_id].frame).setOrigin(0.5, 1).setScale(0.65)
        }

        this.container = this.add.container(650, 250, [modal, button, buttonText, text, this.nft_img])

        this.container.setScale(0)
        this.tween = this.tweens.add({
            targets: this.container,
            scale: 1,
            ease: 'Back',
            duration: 200
        })

        button.once('pointerdown', async () => {
            let { address } = getAccount()
            let nonce = await new Promise((resolve, reject) => {
                this.socket.emit('get-nonce')
                this.socket.on('nonce', (data) => {
                    resolve(data)
                })
            })
            buttonText.setText('Processing...').setFontSize(20).setOrigin(0.5, -2.3)
            try {
                const signature = await signMessage({
                    message: `Mint NFT to connected account\n\nto: ${address}\nnonce: ${nonce}`,
                })
                this.socket.emit('mint', { id: this.randomNFT.item_id, signature: signature})
                if(this.randomNFT.type === 'fishing_rod') {
                    scene.scene.player.inventory.addItem({item_id: this.randomNFT.item_id, name: this.randomNFT.name, type: this.randomNFT.type, contract_type: this.randomNFT.contract_type, stackable: this.randomNFT.stackable, stats: this.randomNFT.stats, rarity: this.randomNFT.rarity, quantity: 1})
                } else if (this.randomNFT.type === 'trophy') {
                    scene.scene.player.nftsList.push({item_id: this.randomNFT.item_id, name: this.randomNFT.name, type: this.randomNFT.type, contract_type: this.randomNFT.contract_type, stackable: this.randomNFT.stackable, stats: this.randomNFT.stats, rarity: this.randomNFT.rarity, quantity: 1})
                    scene.scene.player.stats.find(stat => stat.name === 'fishing_speed').value += this.randomNFT.stats.stats.fishing_speed
                    this.socket.emit('player-nfts', { items: self.player.nftsList })
                }
                this.scene.stop()
                this.scene.resume(scene.key)
            } catch (error) {
                text.setText(`Transaction failed!`)
                buttonText.setText('Close')
                button.once('pointerdown', () => {
                    this.scene.stop()
                    this.scene.resume(scene.key)
                })
            }
        })
    }
}