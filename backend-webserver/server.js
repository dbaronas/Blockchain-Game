const express = require('express')
const app = express()
require('dotenv').config()

app.use(function (req, res, next) {
    if (req.ip !== '1') {
      res.status(202)
      return res.json({ERROR: 'Permission denied'})
    }
    next()
})
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.listen(process.env.PORT, () => {
    console.log('Server running...')
})