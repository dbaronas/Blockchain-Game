const express = require('express')
const PORT = 3000
const app = express()

app.get('/start', (req, res) => {
    res.send('TEST')
})

app.listen(PORT)