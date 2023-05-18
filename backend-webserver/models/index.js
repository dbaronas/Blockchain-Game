const User = require('./user')
const News = require('./news')
const Island = require('./island')
const Item = require('./item')
const Inventory = require('./player_inventory')
const PlayerIsland = require('./player_island')
const Stat = require('./stat')
const PlayerStats = require('./player_stats')

User.belongsToMany(Item, {through: Inventory, foreignKey: 'wallet_address'})
User.belongsToMany(Island, {through: PlayerIsland, foreignKey: 'wallet_address'})
User.belongsToMany(Stat, {through: PlayerStats, foreignKey: 'wallet_address'})
Item.belongsToMany(User, {through: Inventory, foreignKey: 'item_id'})
Island.belongsToMany(User, {through: PlayerIsland, foreignKey: 'island_id'})
Stat.belongsToMany(User, {through: PlayerStats, foreignKey: 'stat_id'})

module.exports = {
    User,
    News,
    Island,
    Inventory,
    Item,
    PlayerIsland,
    Stat,
    PlayerStats
}