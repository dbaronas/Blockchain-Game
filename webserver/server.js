const express = require('express')
const app = express()
const PORT = 3000

app.get('/test', (req, res) => {
    res.send('TEST')
})

app.listen(PORT, () => {
    console.log('Server runing on port 3000...')
})