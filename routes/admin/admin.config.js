const mysql = require('mysql2');
require('dotenv').config();

const pool_admin  = mysql.createPool({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'afc',
  // multipleStatements: true
});

pool_admin.query("SELECT 1 + 1",(err,row)=>{});

module.exports = pool_admin;