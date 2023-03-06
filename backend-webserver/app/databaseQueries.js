require('dotenv').config()
const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_IP,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
})

async function main(){
    console.log(await pool.query('SELECT NOW()'))
}

main()
