const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Stat = sequelize.define('stats', {
    stat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.CHAR(20),

    }
}, {timestamps: false})

module.exports = Stat