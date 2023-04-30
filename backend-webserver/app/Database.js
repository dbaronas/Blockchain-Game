const db = require('../models/index')

const getNews = async(req, res) => {
    const news = await db.News.findAll()
    res.json(news)
}

const checkUser = async (req, res) => {
    const { type, data } = req.body

    if(type == 'wallet_address' || type == 'username') {
        const user = await db.User.findOne({where: {[type]: data}})
        if(user) {
            res.json({exists: true})
        } else {
            res.json({exists: false})
        }
    } else {
        res.send('Invalid request')
    }
}

const getUsername = async (req, res) => {
    const { address } = req.body

    const user = await db.User.findOne({ where: { wallet_address: address } })

    console.log(user.username)

    res.send(user.username)
}

module.exports = {
    getNews,
    checkUser,
    getUsername
}