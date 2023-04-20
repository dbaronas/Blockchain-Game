const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

//require('./middleware/permissions')
var corsOptions = {
    origin: 'http://193.219.91.103:4362',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('game'))

require('./routes')(app)

app.listen(process.env.PORT, () => {
    console.log('Server running...')
})

