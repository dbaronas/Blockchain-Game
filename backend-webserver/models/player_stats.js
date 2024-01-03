const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const PlayerStats = sequelize.define('player_stats', {
    wallet_address: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    stat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    value: {
        type: DataTypes.INTEGER
    }
}, {timestamps: false, freezeTableName: true})

module.exports = PlayerStats