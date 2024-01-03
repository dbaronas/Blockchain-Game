const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Inventory = sequelize.define('player_inventory', {
    wallet_address: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
    }
}, {timestamps: false, freezeTableName: true})

module.exports = Inventory