const express = require('express')
const app = express()
require('dotenv').config()
const test = require('./app/databaseQueries.js')

/*app.use(function (req, res, next) {
    if (req.ip !== '1') {
      res.status(202)
      return res.json({ERROR: 'Permission denied'})
    }
    next()
})*/
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', test.getTime)

app.listen(process.env.PORT, () => {
    console.log('Server running...')
})