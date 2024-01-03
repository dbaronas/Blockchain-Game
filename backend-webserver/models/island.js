const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Island = sequelize.define('islands', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.CHAR(20),

    }
}, {timestamps: false})

module.exports = Island