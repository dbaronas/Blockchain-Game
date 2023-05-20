const db = require('../models/index')
const crypto = require('crypto')

const getNews = async(req, res) => {
    const news = await db.News.findAll()
    res.json(news)
}

const register = async (req, res) => {
    try {
        const { address, username, data } = req.body

        if (!(address && username)) {
            res.status(400).send('All input is required')
        } else {
            const oldUser = await db.User.findByPk(address)

            if (oldUser) {
                res.status(409).send('User Already Exist. Please Login')
            } else {
                const existingUsername = await db.User.findOne({ where: { username: username } })
                if (existingUsername) {
                    res.status(409).send(username + ' is not available')
                } else {
                    await db.User.create({
                        wallet_address: address,
                        username: username,
                        creation_date: Date.now(),
                        data: data,
                        nonce: crypto.randomBytes(64).toString("base64")
                    })
                    const { id } = await db.Island.findOne({ where: { name: data.island}})
                    await db.PlayerIsland.create({
                        wallet_address: address,
                        island_id: id
                    })
                    data.inventory2.forEach(async element => {
                        await db.Inventory.create({
                            wallet_address: address,
                            item_id: element.item_id,
                            quantity: element.quantity
                        })
                    })
                    data.stats.forEach(async element => {
                        await db.PlayerStats.create({
                            wallet_address: address,
                            stat_id: element.stat_id,
                            value: element.value
                        })
                    })
                    res.send('Registered successfully')
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}


const checkUser = async (req, res) => {
    const { type, data } = req.body

    if(type == 'wallet_address' || type == 'username') {
        const user = await db.User.findOne({where: {[type]: data}})
        if(user) {
            res.json({exists: true})
        } else {
            res.json({exists: false})
        }
    } else {
        res.send('Invalid request')
    }
}

const getData = async (req, res) => {
    const { address } = req.body

    const userIsland = await db.User.findByPk(address, {
        include: {
            model: db.Island,
            attributes: ['name']
        },
        attributes: ['username'],
        raw: true
    })
    const userInventory = await db.Item.findAll({
        include: {
            model: db.User,
            where: { wallet_address: address },
            attributes: []
        },
        raw: true
    })
    const userStats = await db.Stat.findAll({
        include: {
            model: db.User,
            where: { wallet_address: address },
            attributes: []
        },
        raw: true
    })

    userInventory.forEach(element => {
        delete element.owner
        delete element['users.player_inventory.wallet_address']
        delete element['users.player_inventory.item_id']
        element.quantity = element['users.player_inventory.quantity']
        delete element['users.player_inventory.quantity']
    })
    userStats.forEach(element => {
        delete element['users.player_stats.wallet_address']
        delete element['users.player_stats.stat_id']
        element.value = element['users.player_stats.value']
        delete element['users.player_stats.value']
    })

    let data = {
            island: userIsland['islands.name'],
            inventory: userInventory,
            stats: userStats
        }
    res.send({ username: userIsland.username, data: data })
}

const sendData = async (req, res) => {
    const { address, data } = req.body

    const user = await db.User.findByPk(address)

    if(user) {
        const { id } = await db.Island.findOne({ where: { name: data.island}})
        await db.PlayerIsland.update( { island_id: id }, { where: { wallet_address: address }})
    
        await db.Inventory.destroy({
            where: { wallet_address: address }
        })
        data.inventory.forEach(async element => {
            await db.Inventory.create({
                wallet_address: address,
                item_id: element.item_id,
                quantity: element.quantity
            })
        })
        await db.PlayerStats.destroy({
            where: { wallet_address: address }
        })
        data.stats.forEach(async element => {
            await db.PlayerStats.create({
                wallet_address: address,
                stat_id: element.stat_id,
                value: element.value
            })
        })
    } else {
        res.send("Error")
    }
}

const getNonce = async (req, res) => {
    const { address } = req.params

    const { nonce } = await db.User.findByPk(address)

    res.send(nonce)
}

module.exports = {
    getNews,
    checkUser,
    getData,
    register,
    sendData,
    getNonce
}