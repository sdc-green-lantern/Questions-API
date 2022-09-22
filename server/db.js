const { Client } = require('pg')

const client = new Client({
  host: 'localhost',
  user: 'dan',
  password: '',
  database: 'qa'
})

client.connect()
.then(() => console.log('connected to postgres'))

module.exports = { client }