const mysql = require('mysql2');
require('dotenv').config();

const pool  = mysql.createPool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME,
  // multipleStatements: true
});

pool.query("SELECT 1 + 1",(err,row)=>{});

module.exports = pool;