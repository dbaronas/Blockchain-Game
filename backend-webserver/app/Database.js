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
            const oldUser = await db.User.findOne({ where: { wallet_address: address } })

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

    /*const { island_id } = await db.PlayerIsland.findOne( { where: { wallet_address: address }})
    const { name } = await db.Island.findOne( { where: { id: island_id }})*/
    const { name } = await db.User.findOne( { where: { wallet_address: address }, include: db.Island })
    console.log(name)
    const { username, data } = await db.User.findOne({ where: { wallet_address: address } })

    res.send({ username: username, data: data })
}

const sendData = async (req, res) => {
    const { address, data } = req.body

    const user = await db.User.findOne({ where: { wallet_address: address } })

    if (user) {
        await user.update({ data: data })
        res.send("Data changed successfully")
    } else {
        res.send("Error")
    }
}

const getNonce = async (req, res) => {
    const { address } = req.params

    const { nonce } = await db.User.findOne({ where: { wallet_address: address } })

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