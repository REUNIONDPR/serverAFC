const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/getLot', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sql = `SELECT id as value, libelle FROM lot`;

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        conn.query(sql, (err, result) => {
            conn.release();

            if (err) {
                console.log(err.sqlMessage)
                return resp.status(500).json({
                    err: "true",
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            }
            else {
                response.status(200).json(result);
            }

        });
    });

})

router.get('/findName', passport.authenticate('jwt', { session: false }), (request, response) => {
    const data = request.query;
    let sqlValues = []
    
    let sql = `SELECT libelle FROM ${data.t} WHERE id = ?`;
    sqlValues.push(data.v)

    pool.getConnection(function (error, conn) {
        if (error) throw err;
    
        conn.query(sql, [sqlValues], (err, result) => {
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

})

router.get('/findAll', passport.authenticate('jwt', { session: false }), (request, response) => {

    const data = request.query;
    let sql = `SELECT * FROM ${data.table} `;
    let sqlValues = [];

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


module.exports = router;