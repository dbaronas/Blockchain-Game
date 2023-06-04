const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC))
const { User } = require('../models/index')
const crypto = require('crypto')

const verifyMessage = async (req, res, next) => {
    try {
        const { signature, address, action } = req.body
        if(!signature || !address) {
            return res.send('No signature or address provided')
        }
        let user = await User.findOne({ where: { wallet_address: address } })
        switch(action) {
            case 'mint':
                var message = `Mint NFT to connected account\n\nto: ${address}\nnonce: ${user.nonce}`
                break
            case 'sell':
                var message = `Sell NFT with connected account: ${address}\nnonce: ${user.nonce}`
                break
            case 'buy':
                var message = `Buy NFT to connected account: ${address}\nnonce: ${user.nonce}`
                break
            case 'update':
                var message = `Update NFT listing price of connected account: ${address}\nnonce: ${user.nonce}`
                break
            case 'cancel':
                var message = `Cancel NFT listing of connected account: ${address}\nnonce: ${user.nonce}`
                break
            case 'withdraw':
                var message = `Withdraw earnings to connected account: ${address}\nnonce: ${user.nonce}`
                break
                    
        }
        const recoveredAddress = await web3.eth.accounts.recover(message, signature)
    
        if(recoveredAddress == address) {
            await user.update({ nonce: crypto.randomBytes(64).toString("base64") })
            next()
        } else {
            return res.send('Unauthorized')
        }
    } catch (error) {
        return res.send('Invalid signature')
    }
}

module.exports = verifyMessage