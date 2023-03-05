const express = require('express')
const app = express()
const PORT = 3000

app.use('/NFTs', express.static('NFTs'))

app.listen(PORT)