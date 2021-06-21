// const mysql = require('mysql');

// // Setup database connection
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST, // db server address
//   user: process.env.DB_USER, // db user's name
//   password: process.env.DB_PASS, // db user's password
//   database: process.env.DB_NAME, // db name
// });

// module.exports = connection;

module.exports = {
  HOST: process.env.DB_HOST, // db server address
  USER: process.env.DB_USER, // db user's name
  PASSWORD: process.env.DB_PASS, // db user's password
  DATABASE: process.env.DB_NAME, // db name
  dialect: "mysql",
  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};