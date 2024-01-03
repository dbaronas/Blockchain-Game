const erc20 = require('./ERC20')
const erc721 = require('./ERC721')
const db = require('./Database')
//const erc1155 = require('./ERC1155')
const marketplace = require('./Marketplace')

module.exports = {
    erc20,
    erc721,
    db,
    //erc1155,
    marketplace
}