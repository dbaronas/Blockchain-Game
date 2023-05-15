const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC))
const { User } = require('../models/index')
const crypto = require('crypto')

const verifyMessage = async (signature, address) => {
    let { nonce } = await User.findOne({ where: { wallet_address: address } })
    var message = `Mint NFT to connected account\n\nto: ${address}\nnonce: ${nonce}`
    const recoveredAddress = web3.eth.accounts.recover(message, signature)

    if(recoveredAddress == address) {
        await User.update({ nonce: crypto.randomBytes(64).toString("base64") })
        return true
    } else {
        return false
    }
}

module.exports = verifyMessage