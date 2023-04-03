const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

//require('./middleware/permissions')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('game'))

require('./routes')(app)

app.listen(process.env.PORT, () => {
    console.log('Server running...')
})

