const api = require('./app/index')

module.exports = (app) => {

    //ERC20

    //ERC721
    app.get('/api/v1/721/ownerof', api.erc721.ownerOf)
    app.post('/api/v1/721/mint', api.erc721.mint)
    app.post('/api/v1/721/getDurability', api.erc721.getTokenDurability)
    app.post('/api/v1/721/updateDurability', api.erc721.updateTokenDurability)
    app.get('/api/v1/721/getMyTokens', api.erc721.getMyTokens)
    //ERC1155

    //MARKETPLACE
    app.post('/api/v1/marketplace/createNFTListing', api.marketplace.createNFTListing)
    app.post('/api/v1/marketplace/createItemListing', api.marketplace.createItemListing)
    app.post('/api/v1/marketplace/updateListing', api.marketplace.updateListing)
    app.post('/api/v1/marketplace/cancelListing', api.marketplace.cancelListing)
    app.post('/api/v1/marketplace/buyNFT', api.marketplace.buyNFT)
    app.post('/api/v1/marketplace/buyItem', api.marketplace.buyItem)
    app.get('/api/v1/marketplace/NFTListings', api.marketplace.getNFTListings)
    app.get('/api/v1/marketplace/ItemListings', api.marketplace.getItemListings)
    app.post('/api/v1/marketplace/earnings', api.marketplace.getEarnings)
    app.post('/api/v1/marketplace/withdraw', api.marketplace.withdraw)

    //DATABASE
    app.get('/api/v1/db/news', api.db.getNews)
    app.post('/api/v1/db/checkUser', api.db.checkUser)
    app.post('/api/v1/db/playerData', api.db.getData)
    app.post('/api/v1/db/register', api.db.register)
    app.post('/api/v1/db/sendPlayerData', api.db.sendData)
}