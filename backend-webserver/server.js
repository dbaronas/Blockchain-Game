const express = require('express')
const app = express()
require('dotenv').config()
require('./routes')(app)

/*app.use(function (req, res, next) {
    if (req.ip !== '1') {
    res.status(202)
    return res.json({ERROR: 'Permission denied'})
    }
    next()
})*/
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('game'))

app.listen(process.env.PORT, () => {
    console.log('Server running...')
})