const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/count', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sql = `SELECT count(id) as count FROM sollicitation_formation`;
    let sqlValues = [];

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        
        let data = request.query;
        if(data.s > 0){
            sql += ' WHERE statut = ?';
            sqlValues.push(data.s)
        }
        
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
                response.status(200).json(result);
            }
        });
    });
})

router.get('/findAll', passport.authenticate('jwt', { session: false }), (request, response) => {
    let sql = `SELECT f.id, id_lot as lot, 
        f.user, f.statut as display_s_formation, f.dispositif as display_dispositif, 
        nb_place, dateEntree, dateIcop, nConv, dateFin 
        FROM sollicitation_formation f`;
    let sqlValues = [];

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        
        let data = request.query;
        if(data.s > 0){
            sql += ' WHERE statut = ?';
            sqlValues.push(data.s)
        }
        
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
                response.status(200).json(result);
            }
        });
    });
})

module.exports = router;