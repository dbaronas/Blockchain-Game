require('dotenv').config()
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC))
const Contract = require('web3-eth-contract')
Contract.setProvider(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC))
const abi = require('../ABI/PoseidonToken.json').abi
const contract = new Contract(abi, process.env.ERC20)

const psdBalance = async (req, res) => {
    const { address } = req.body

    if(!address) {
        return res.send('Error')
    }
    await contract.methods.balanceOf(address).call().then((results) => {
        res.json(results)
    }).catch((err) => {
        res.json(err)
    })
}

module.exports = {
    psdBalance
}

