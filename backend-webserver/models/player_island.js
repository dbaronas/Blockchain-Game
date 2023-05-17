const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const PlayerIsland = sequelize.define('player_island', {
    wallet_address: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
}, {timestamps: false, freezeTableName: true})

module.exports = PlayerIsland