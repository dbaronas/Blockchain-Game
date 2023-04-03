require('dotenv').config()
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC))
const Contract = require('web3-eth-contract')
Contract.setProvider(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC))
const abi = require('../ABI/PoseidonMarket.json').abi
const contract = new Contract(abi, process.env.MARKETPLACE)
contract.defaultAccount = process.env.OWNER

const createNFTListing = async(req, res) => {
    const address = req.body.address
    const tokenId = req.body.tokenId
    const price = req.body.price

    var block = await web3.eth.getBlock("latest")
    await contract.methods.createListing(address, process.env.ERC721, tokenId, 1, price).send({from: contract.defaultAccount, gasLimit: block.gasLimit}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const createItemListing = async(req, res) => {
    const address = req.body.address
    const tokenId = req.body.tokenId
    const quantity = req.body.quantity
    const price = req.body.price

    var block = await web3.eth.getBlock("latest")
    await contract.methods.createListing(address, process.env.ERC1155, tokenId, quantity, price).send({from: contract.defaultAccount, gasLimit: block.gasLimit}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const updateListing = async(req, res) => {
    const address = req.body.address
    const listingId = req.body.listingId
    const price = req.body.price
    const quantity = req.body.quantity

    await contract.methods.updateListing(address, listingId, quantity, price).call({from: contract.defaultAccount}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const cancelListing = async(req, res) => {
    const address = req.body.address
    const listingId = req.body.listingId

    await contract.methods.cancelListing(address, listingId).call({from: contract.defaultAccount}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const buyNFT = async(req, res) => {
    const address = req.body.address
    const listingId = req.body.listingId

    var block = await web3.eth.getBlock("latest")
    await contract.methods.buy(address, listingId, 1).send({from: contract.defaultAccount, gasLimit: block.gasLimit}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const buyItem = async(req, res) => {
    const address = req.body.address
    const listingId = req.body.listingId
    const quantity = req.body.quantity

    var block = await web3.eth.getBlock("latest")
    await contract.methods.buy(address, listingId, quantity).send({from: contract.defaultAccount, gasLimit: block.gasLimit}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const getNFTListings = async(req, res) => {
    await contract.methods.get721Listings().call({from: contract.defaultAccount}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const getItemListings = async(req, res) => {
    await contract.methods.get1155Listings().call({from: contract.defaultAccount}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const getEarnings = async(req, res) => {
    const address = req.body.address

    await contract.methods.getEarnings(address).call({from: contract.defaultAccount}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const withdraw = async(req, res) => {
    const address = req.body.address

    await contract.methods.withdraw(address).send({from: contract.defaultAccount}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

module.exports = {
    createNFTListing,
    createItemListing,
    updateListing,
    cancelListing,
    buyNFT,
    buyItem,
    getNFTListings,
    getItemListings,
    getEarnings,
    withdraw
}