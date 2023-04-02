const api = require('./app/index')
const auth = require('./middleware/auth')


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
    app.post('/api/v1/marketplace/createGameItemListing', api.marketplace.createGameItemListing)
    app.post('/api/v1/marketplace/updateListing', api.marketplace.updateListing)
    app.post('/api/v1/marketplace/cancelListing', api.marketplace.cancelListing)
    app.post('/api/v1/marketplace/buyNFT', api.marketplace.buyNFT)
    app.post('/api/v1/marketplace/buyGameItem', api.marketplace.buyGameItem)
    app.post('/api/v1/marketplace/getNFTListings', api.marketplace.getNFTListings)
    app.post('/api/v1/marketplace/getGameItemListings', api.marketplace.getGameItemListings)
    app.post('/api/v1/marketplace/getEarnings', api.marketplace.getEarnings)
    app.post('/api/v1/marketplace/withdraw', api.marketplace.withdraw)

    //DATABASE
    app.get('/api/v1/db/news', api.db.getNews)

    //AUTH
    app.post('/api/v1/auth/login', api.auth.login)
    app.post('/api/v1/auth/register', api.auth.register)
    app.post('/api/v1/auth/checkUser', api.auth.checkUser)
}