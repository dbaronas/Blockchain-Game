const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC))

const verifyMessage = (signature, address, nonce) => {
    var message = `Mint NFT to connected account\n\nto: ${address}\nnonce: ${'wip'}`
    const recoveredAddress = web3.eth.accounts.recover(message, signature)

    console.log(recoveredAddress)

    if(recoveredAddress == address) {
        return true
    } else {
        return false
    }
}

module.exports = verifyMessage