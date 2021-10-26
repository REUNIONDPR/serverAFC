const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/findAll', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sql = `SELECT * FROM lot`;

    pool.getConnection(function (error, conn) {
        if (error) throw err;
    
        conn.query(sql, [], (err, result) => {
            conn.release();
    
            if (err) {
                console.log(err.sqlMessage)
                return response.status(500).json({
                    err: 'true',
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            }else{
                response.status(200).json(result);
            }
        });
    });

});

router.get('/findBassin', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sql = `SELECT * FROM lot_bassin WHERE id_lot = ?`;
    const data = request.query;
    
    pool.getConnection(function (error, conn) {
        if (error) throw err;
    
        conn.query(sql, [data.id_lot], (err, result) => {
            conn.release();
    
            if (err) {
                console.log(err.sqlMessage)
                return response.status(500).json({
                    err: 'true',
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            }else{
                response.status(200).json(result);
            }
        });
    });

});

module.exports = router;    