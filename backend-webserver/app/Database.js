const db = require('../models/index')

const getNews = async(req, res) => {
    const news = await db.News.findAll()
    res.json(news)
}

const checkUser = async(req, res) => {
    const { type, data } = req.body

    if(type == 'address') {
        const user = await db.User.findOne({where: {wallet_address: data}})
        if(user) {
            res.json({exists: true})
        } else {
            res.json({exists: false})
        }
    } else if(type == 'username') {
        const user = await db.User.findOne({where: {username: data}})
        if(user) {
            res.json({exists: true})
        } else {
            res.json({exists: false})
        }
    } else {
        res.send('Invalid request')
    }
}

module.exports = {
    getNews,
    checkUser
}