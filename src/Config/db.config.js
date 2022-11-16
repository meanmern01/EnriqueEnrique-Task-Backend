const Pool = require("pg").Pool;
const dotenv = require('dotenv').config();
const pool = new Pool({
  user: process.env.USER,
  host: "localhost",
  database: process.env.DB ,
  password: process.env.PASSWORD,
  port: 5432,
})

module.exports = pool