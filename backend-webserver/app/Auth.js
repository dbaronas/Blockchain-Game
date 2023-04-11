const jwt = require('jsonwebtoken')
const db = require('../models/index')

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
                    const user = await db.User.create({
                        wallet_address: address,
                        username: username,
                        creation_date: Date.now(),
                        data: data
                    })

                    const token = jwt.sign(
                        { user_id: address, user: username },
                        process.env.JWT_SECRET,
                        { expiresIn: '6h' }
                    )

                    res.cookie('access-token', token, {HttpOnly: true, maxAge: 21600 * 1000}).send('Registered successfully')
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const login = async (req, res) => {
    try {
        const { address } = req.body

        if (!address) {
            res.status(400).send('All input is required')
        } else {
            const user = await db.User.findOne({ where: { wallet_address: address } })

            if (user) {
                const token = jwt.sign(
                    { user_id: address, user: user.username },
                    process.env.JWT_SECRET,
                    { expiresIn: '6h' }
                )
                res.cookie('access-token', token, {HttpOnly: true, maxAge: 21600 * 1000}).send('Login successful')
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