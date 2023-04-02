const jwt = require('jsonwebtoken')
const db = require('../models/index')

const register = async(req, res) => {
    try {
        const { wallet_address, username, data} = req.body

        if(!(wallet_address && username)) {
            res.status(400).send('All input is required')
        } else {
            const oldUser = await db.User.findOne({where: {username: username}})

            if (oldUser) {
                return res.status(409).send('User Already Exist. Please Login')
            } else {
                const user = await db.User.create({
                    wallet_address: wallet_address,
                    username: username,
                    creation_date: Date.now(),
                    data: data
                })
        
                const token = jwt.sign(
                    { user_id: wallet_address },
                    process.env.JWT_SECRET,
                    { expiresIn: '6h' }
                )
                res.status(200).json({user, token})
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const login = async(req, res) => {
    try {
        const { wallet_address } = req.body

        if(!wallet_address) {
            res.status(400).send('All input is required')
        } else {
            const user = await db.User.findOne({where: {wallet_address: wallet_address}})

            if(user) {
                const token = jwt.sign(
                    { user_id: wallet_address },
                    process.env.JWT_SECRET,
                    { expiresIn: '6h' }
                )
                res.status(200).json({user, token})
            } else {
                res.status(400).send('Invalid Credentials')
            }
        }
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    register,
    login
}