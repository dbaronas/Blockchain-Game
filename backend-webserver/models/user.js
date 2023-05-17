const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const User = sequelize.define('users', {
    wallet_address: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    creation_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    data: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    nonce: {
        type: DataTypes.CHAR(100),
        allowNull: true
    }
}, {timestamps: false})

module.exports = User