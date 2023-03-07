require('dotenv').config()
const Web3 = require('web3')
const Contract = require('web3-eth-contract')
Contract.setProvider(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC))
const abi = require('../ABI/PoseidonToken.json').abi
const contract = new Contract(abi, process.env.ERC20)

async function main() {
    console.log(await contract.methods.name().call())
}

main()

module.exports = {
    
}

