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
                var message = ``
                break
            case 'buy':
                var message = ``
                break
            case 'update':
                var message = ``
                break
            case 'cancel':
                var message = ``
                break
            case 'withdraw':
                var message = ``
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