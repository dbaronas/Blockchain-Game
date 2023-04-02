const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const News = sequelize.define('news', {
    news_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    release_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {timestamps: false})

module.exports = News