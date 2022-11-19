const Pool = require("pg").Pool;
const dotenv = require('dotenv').config();
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB ,
  password: process.env.PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
}
})
pool.connect().then(()=>{
  console.log("Connect to DB!!!");
}).catch((err)=>{
  console.log(err.message,'...err');
})
// const Pool = require("pg").Pool;
// const dotenv = require('dotenv').config();
// const pool = new Pool({
//   user: process.env.USER,
//   host: "https://enrique-backend-api.herokuapp.com",
//   database: process.env.DB ,
//   password: process.env.PASSWORD,
//   port: 5432,
// })

module.exports = pool