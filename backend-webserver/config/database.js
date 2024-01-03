require('dotenv').config()
const { Sequelize } = require('sequelize')

module.exports.sequelize = new Sequelize(process.env.DB_URI)