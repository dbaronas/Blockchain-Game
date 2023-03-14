const api = require('./app/index')


module.exports = (app) => {

    app.get('/v1/api/ownerof', api.erc721.ownerOf)
    app.get('/v1/api/mint', api.erc721.mint)
}