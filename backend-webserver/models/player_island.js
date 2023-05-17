const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const PlayerIsland = sequelize.define('player_island', {
    wallet_address: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'wallet_address'
        }
    },
    island_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'islands',
            key: 'id'
        }
    },
}, {timestamps: false, freezeTableName: true})

module.exports = PlayerIsland