const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');

router.put('/addAdresse', passport.authenticate('jwt', {session:false}), (request, response) => {
    
    let sql = 'INSERT INTO catalogue_attributaire_adresse ';
    let sqlValues = [];
    let data = request.body;
    
    let field = '('+Object.keys(data).filter((v) => v !== 'id').map((v) => '?').join(',')+')';
    sql += '('+Object.keys(data).filter((v) => v !== 'id').join(',')+')';
    sql += ' VALUES ';
    sql += field;

    sqlValues = Object.entries(data).filter(([k,v]) => k !== 'id').map(([k, v]) => v);
    console.log(sql, sqlValues)
    pool.getConnection(function (error, conn) {
        if (error) throw err;
        const data = request.body;
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
            }else{
                let io = request.app.get("io");
                io.emit("updateAdresse", request.body);
                response.status(200).json(result);
            }
        });
    });

})

router.put('/deleteAdresse', passport.authenticate('jwt', {session:false}), (request, response) => {
    
    let sql = 'DELETE FROM catalogue_attributaire_adresse ';
    let sqlValues = [];
    let data = request.body;

    Object.entries(data).map(([k, v], i) => {
        i === 0 ? sql += ' WHERE ' : sql += ' AND ';
        sql += k + '=?';
        sqlValues.push(v);
    })

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        const data = request.body;
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
            }else{
                let io = request.app.get("io");
                io.emit("updateAdresse", request.body);
                response.status(200).json({});
            }
        });
    });

})

module.exports = router;