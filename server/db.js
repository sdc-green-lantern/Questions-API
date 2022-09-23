const { Pool } = require('pg')
require("dotenv").config();

// const client = new Client({
//   host: 'localhost',
//   user: 'dan',
//   password: '',
//   database: 'qa',
//   port: 5432
// })

const client = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDB,
  password: process.env.PGPASS,
  port: process.env.PGPORT
})

client.connect()
.then(() => console.log('connected to postgres'))
.catch((err) => console.log('ERROR : ', err))

module.exports = { client }