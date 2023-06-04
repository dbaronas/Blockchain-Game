const api = require('./app/index')
const verifyMessage = require('./middleware/verifyMessage')

module.exports = (app) => {

    //ERC20

    //ERC721
    app.post('/api/v1/721/ownerof', api.erc721.ownerOf)
    app.post('/api/v1/721/mint', verifyMessage, api.erc721.mint)
    app.post('/api/v1/721/getDurability', api.erc721.getTokenDurability)
    app.post('/api/v1/721/updateDurability', api.erc721.updateTokenDurability)
    app.post('/api/v1/721/getMyTokens', api.erc721.getMyTokens)
    app.post('/api/v1/721/tokenURI', api.erc721.tokenURI)
    //ERC1155

    //MARKETPLACE
    app.post('/api/v1/marketplace/createNFTListing', verifyMessage, api.marketplace.createNFTListing)
    app.post('/api/v1/marketplace/createItemListing', api.marketplace.createItemListing)
    app.post('/api/v1/marketplace/updateListing', verifyMessage, api.marketplace.updateListing)
    app.post('/api/v1/marketplace/cancelListing', verifyMessage, api.marketplace.cancelListing)
    app.post('/api/v1/marketplace/buyNFT', verifyMessage, api.marketplace.buyNFT)
    app.post('/api/v1/marketplace/buyItem', api.marketplace.buyItem)
    app.get('/api/v1/marketplace/NFTListings', api.marketplace.getNFTListings)
    app.get('/api/v1/marketplace/ItemListings', api.marketplace.getItemListings)
    app.post('/api/v1/marketplace/earnings', api.marketplace.getEarnings)
    app.post('/api/v1/marketplace/withdraw', verifyMessage, api.marketplace.withdraw)
    app.post('/test', api.marketplace.checkTransactionStatus)

    //DATABASE
    app.get('/api/v1/db/news', api.db.getNews)
    app.post('/api/v1/db/checkUser', api.db.checkUser)
    app.post('/api/v1/db/playerData', api.db.getData)
    app.post('/api/v1/db/register', api.db.register)
    app.post('/api/v1/db/sendPlayerData', api.db.sendData)
    app.post('/api/v1/db/:address/nonce', api.db.getNonce)
    app.post('/api/v1/db/lootPool', api.db.lootPool)
}