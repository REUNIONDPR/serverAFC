const express = require('express');
const passport = require('passport');
const router = express.Router();
const mysql = require('mysql2');

const pool  = mysql.createPool({
  host     : "AFC",
  user     : "AFC",
  password : "10.192.132.164",
  database : "afc_prod",
  // multipleStatements: true
});
pool.query("SELECT 1 + 1",(err,row)=>{});

router.get('/lotattr', passport.authenticate('jwt', { session: false }), (request, response) => {
    let sql = `SELECT * FROM t_lot`;
    let sqlValues = [];


    pool.getConnection(function (error, conn) {
        if (error) throw error;

        conn.query(sql, sqlValues, (err, result) => {
            conn.release();

            if (err) {
                console.log(err.sqlMessage)
                return response.status(500).json({
                    err: 'true',
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            } else {
                response.status(200).json(result);
            }
        });
    });
})
module.exports = router;