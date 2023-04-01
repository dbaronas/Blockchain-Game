require('dotenv').config()
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC))
const Contract = require('web3-eth-contract')
Contract.setProvider(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC))
const abi = require('../ABI/PoseidonMarket.json').abi
const contract = new Contract(abi, process.env.MARKETPLACE)

const createNFTListing = async(req, res) => {
    const address = req.body.address
    const tokenId = req.body.tokenId
    const price = req.body.price

    var block = await web3.eth.getBlock("latest")
    await contract.methods.createListing(process.env.ERC721, tokenId, 1, price).send({from: address, gasLimit: block.gasLimit}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const createGameItemListing = async(req, res) => {
    const address = req.body.address
    const tokenId = req.body.tokenId
    const quantity = req.body.quantity
    const price = req.body.price

    var block = await web3.eth.getBlock("latest")
    await contract.methods.createListing(process.env.ERC1155, tokenId, quantity, price).send({from: address, gasLimit: block.gasLimit}).then((results) => {
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

    await contract.methods.updateListing(listingId, quantity, price).call({from: address}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const cancelListing = async(req, res) => {
    const address = req.body.address
    const listingId = req.body.listingId

    await contract.methods.cancelListing(listingId).call({from: address}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const buyNFT = async(req, res) => {
    const address = req.body.address
    const listingId = req.body.listingId

    var block = await web3.eth.getBlock("latest")
    await contract.methods.buy(listingId).send({from: address, gasLimit: block.gasLimit}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const buyGameItem = async(req, res) => {
    const address = req.body.address
    const listingId = req.body.listingId
    const quantity = req.body.quantity

    var block = await web3.eth.getBlock("latest")
    await contract.methods.buy(listingId, quantity).send({from: address, gasLimit: block.gasLimit}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const getNFTListings = async(req, res) => {
    const address = req.body.address

    await contract.methods.get721Listings().call({from: address}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const getGameItemListings = async(req, res) => {
    const address = req.body.address

    await contract.methods.get1155Listings().call({from: address}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const getEarnings = async(req, res) => {
    const address = req.body.address

    await contract.methods.getEarnings().call({from: address}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

const withdraw = async(req, res) => {
    const address = req.body.address

    await contract.methods.withdraw().call({from: address}).then((results) => {
        res.json(results)
    }).catch((error) => {
        res.json(error)
    })
}

module.exports = {
    createNFTListing,
    createGameItemListing,
    updateListing,
    cancelListing,
    buyNFT,
    buyGameItem,
    getNFTListings,
    getGameItemListings,
    getEarnings,
    withdraw
}