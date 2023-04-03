const db = require('../models/index')

const getNews = async(req, res) => {
    const news = await db.News.findAll()
    res.json(news)
}

const checkUser = async(req, res) => {
    const address = req.body.address
    const user = await db.User.findOne({where: {wallet_adress: address}})
    if(user) {
        res.json({exists: true})
    } else {
        res.json({exists: false})
    }
}

module.exports = {
    getNews,
    checkUser
}