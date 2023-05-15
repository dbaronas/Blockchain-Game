require('dotenv').config()
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC))
const Contract = require('web3-eth-contract')
Contract.setProvider(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC))
const abi = require('../ABI/PoseidonNFT.json').abi
const contract = new Contract(abi, process.env.ERC721)
contract.defaultAccount = process.env.OWNER
const verify = require('../middleware/verifyMessage')

const mint = async(req, res) => {
    const address = req.body.address
    const item_id = req.body.id
    const tokenName = req.body.name
    const durability = req.body.durability
    const signature = req.body.signature
    const uri = `${process.env.IP}/gameitems/NFTs/metadata/${item_id}.json`

    if(verify(signature, address, 'temp')) {
        var block = await web3.eth.getBlock("latest")
        await contract.methods.mint(address, uri, tokenName, durability).send({from: contract.defaultAccount, gasLimit: block.gasLimit}).then((result) => {
            res.json(result)
        }).catch((error) => {
            res.json({error: '' + error})
        })
    } else {
        res.json('Unauthorized!')
    }
}

const getMyTokens = async(req, res) => {
    const address = req.query.address

    await contract.methods.getMyTokens().call({from: address}).then((result) => {
        res.json(result)
    }).catch((error) => {
        res.json({error: '' + error})
    })
}

const getTokenDurability = async(req, res) => {
    const tokenId = req.body.id
    const address = req.body.address

    await contract.methods.getDurability(tokenId).call({from: address}).then((result) => {
        res.json(result)
    }).catch((error) => {
        res.json({error: '' + error})
    })
}

const updateTokenDurability = async(req, res) => {
    const tokenId = req.body.id
    const durability = req.body.durability
    const address = req.body.address

    var block = await web3.eth.getBlock("latest");
    await contract.methods.updateDurability(tokenId, durability).send({from: address, gasLimit: block.gasLimit}).then((result) => {
        res.json(result)
    }).catch((error) => {
        res.json({error: '' + error})
    })
}

const ownerOf = async(req, res) => {
    const tokenId = req.query.id
    await contract.methods.ownerOf(tokenId).call().then((result) => {
        res.json({owner: result})
    }).catch((error) => {
        res.json({error: '' + error})
    })
}

module.exports = {
    mint,
    getMyTokens,
    getTokenDurability,
    updateTokenDurability,
    ownerOf
}