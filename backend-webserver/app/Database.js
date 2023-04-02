const db = require('../models/index')

const getNews = async(req, res) => {
    const news = await db.News.findAll()
    res.json(news)
}

module.exports = {
    getNews,
}