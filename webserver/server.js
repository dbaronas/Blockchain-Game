const express = require('express')
const dotenv = require('dotenv')
const app = express()
dotenv.config()

app.get('/start', (req, res) => {
    res.send('TEST')
})

app.listen(process.env.PORT)