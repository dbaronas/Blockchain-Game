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

    userInventory.forEach(element => {
        delete element.owner
        delete element['users.player_inventory.wallet_address']
        delete element['users.player_inventory.item_id']
        element.quantity = element['users.player_inventory.quantity']
        delete element['users.player_inventory.quantity']
    })
    let playerData = {
        username: userIsland.username,
        data: {
            island: userIsland['islands.name'],
            inventory: userInventory
        }
    }
    const { username, data } = await db.User.findOne({ where: { wallet_address: address } })

    res.send({ username: username, data: data })
}

const sendData = async (req, res) => {
    const { address, data } = req.body

    const user = await db.User.findByPk(address)

    if (user) {
        await user.update({ data: data })
        res.send("Data changed successfully")
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