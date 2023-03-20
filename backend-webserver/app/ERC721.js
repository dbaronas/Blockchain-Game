require('dotenv').config()
const Web3 = require('web3')
const Contract = require('web3-eth-contract')
Contract.setProvider(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC))
const abi = require('../ABI/PoseidonNFT.json').abi
const contract = new Contract(abi, process.env.ERC721)

const mint = async(req, res) => {
    const address = req.body.address
    const item_id = req.body.id
    const uri = `${process.env.IP}/gameitems/NFTs/metadata/${item_id}.json`
    const data = {
        address: address,
        id: item_id
    }
    //const address = '0x0746A08dB469275d7db9EAFDF6Bca5BA78403b4b'
    res.json({data})
    /*await contract.methods.mint(address, uri).send({from: process.env.OWNER, gas: 216000}).then((result) => {
        res.json(result)
    }).catch((error) => {
        res.json({error: '' + error})
    })*/
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
    ownerOf
}