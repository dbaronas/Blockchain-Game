const User = require('./user')
const News = require('./news')
const Island = require('./island')
const Item = require('./item')
const Inventory = require('./player_inventory')
const PlayerIsland = require('./player_island')

User.belongsToMany(Item, {through: Inventory, foreignKey: 'wallet_address', as: 'inventory'})
User.belongsToMany(Island, {through: PlayerIsland, foreignKey: 'wallet_address', as: 'island'})
Item.belongsToMany(User, {through: Inventory, foreignKey: 'item_id', as: 'items'})
Island.belongsToMany(User, {through: PlayerIsland, foreignKey: 'island_id', as: 'islands'})

module.exports = {
    User,
    News,
    Island,
    Inventory,
    Item,
    PlayerIsland
}