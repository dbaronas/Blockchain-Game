const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Item = sequelize.define('items', {
    item_id: {
        type: DataTypes.CHAR(20),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.CHAR(30),
        allowNull: false
    },
    type: {
        type: DataTypes.CHAR(20),
        allowNull: false
    },
    contract_type: {
        type: DataTypes.CHAR(20),
        allowNull: false
    },
    owner: {
        type: DataTypes.CHAR(50),
        allowNull: true,
    },
    stackable: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    stats: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    rarity: {
        type: DataTypes.CHAR(20),
        allowNull: true
    }
}, {timestamps: false})

module.exports = Item