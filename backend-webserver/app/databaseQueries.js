require('dotenv').config()
const util = require('util');
const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_IP,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
})


const getTime = (req, res) => {
    pool.query('SELECT NOW()', (err, result) => {
        res.json(result.rows)
    })
}

const getNews = (req, res) => {
    pool.query('SELECT * FROM News', (err, result) => {
        if(err) {
            console.log(err);
            // res.send(err);
        }
        else {
            res.json(result.rows)
        }
    })
}

module.exports = {
    getTime,
    getNews
}
