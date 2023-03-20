const api = require('./app/index')


module.exports = (app) => {
    app.get('/api/v1/ownerof', api.erc721.ownerOf)
    app.post('/api/v1/mint', api.erc721.mint)
}