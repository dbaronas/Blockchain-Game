const User = require('./user')
const News = require('./news')
const Island = require('./island')
const Item = require('./item')
const Inventory = require('./player_inventory')
const PlayerIsland = require('./player_island')

User.belongsToMany(Item, {through: Inventory, foreignKey: 'wallet_address'})
User.belongsToMany(Island, {through: PlayerIsland, foreignKey: 'wallet_address'})
Item.belongsToMany(User, {through: Inventory, foreignKey: 'id'})
Island.belongsToMany(User, {through: PlayerIsland, foreignKey: 'id'})

module.exports = {
    User,
    News,
    Island,
    Inventory,
    Item,
    PlayerIsland
}