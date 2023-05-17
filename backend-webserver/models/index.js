const User = require('./user')
const News = require('./news')
const Island = require('./island')
const Item = require('./item')
const Inventory = require('./player_inventory')
const PlayerIsland = require('./player_island')

User.belongsToMany(Item, {through: Inventory})
User.belongsToMany(Island, {through: PlayerIsland})
Item.belongsToMany(User, {through: Inventory})
Island.belongsToMany(User, {through: PlayerIsland})

module.exports = {
    User,
    News,
    Island,
    Inventory,
    Item,
    PlayerIsland
}