const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

//require('./middleware/permissions')
var corsOptions = {
    origin: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
    exposedHeaders: ['access-token']
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('game'))
app.use(cookieParser())

require('./routes')(app)

app.listen(process.env.PORT, () => {
    console.log('Server running...')
})

