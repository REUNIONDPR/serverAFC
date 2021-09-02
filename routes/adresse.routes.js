const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/find', passport.authenticate('jwt', { session: false }), (request, response) => {
    
    let sqlValues = [];
    let sql = `SELECT a.id, a.adresse, v.libelle
        FROM adresse a 
        LEFT JOIN adresse_catalogue ac ON ac.id_adresse = a.id
        LEFT JOIN ville v ON v.id = a.commune `;

    const data = request.query;
    
    Object.entries(data).filter(([k, v]) => k !== 'table').map(([k, v], i) => {
        i === 0 ? sql += ' WHERE ' : sql += ' AND ';
        sql += k + '=?';
        sqlValues.push(v);
    })

    sql += ' GROUP BY a.id';

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        conn.query(sql, sqlValues, (err, result) => {
            conn.release();

            if (err) {
                console.log(err.sqlMessage)
                return response.status(500).json({
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

router.get('/findOuter', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sqlValues = [];
    let sql = `SELECT a.id, a.adresse, v.libelle commune
        FROM adresse a 
        LEFT JOIN catalogue_attributaire_adresse ac ON ac.id_adresse = a.id
        LEFT JOIN ville v ON v.id = a.commune WHERE a.id NOT IN (
            SELECT a.id
                FROM adresse a
                LEFT JOIN catalogue_attributaire_adresse ac ON ac.id_adresse = a.id 
                WHERE ac.id_catalogue_attributaire=? GROUP BY a.id
        )`;

    const data = request.query;
    sqlValues.push(data.id_catalogue_attributaire);

    Object.entries(data).filter(([k, v]) => k !== 'id_catalogue_attributaire').map(([k, v], i) => {
        sql += ' AND ' + k + '=?';
        sqlValues.push(v);
    })

    sql += ' GROUP BY a.id';

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        conn.query(sql, sqlValues, (err, result) => {
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

router.put('/create', passport.authenticate('jwt', {session:false}), (request, response) => {
    
    let sql = 'INSERT INTO adresse ';
    let sqlValues = [];
    let data = request.body;
    
    let field = '('+Object.keys(data).filter((v) => v !== 'id').map((v) => '?').join(',')+')';
    sql += '('+Object.keys(data).filter((v) => v !== 'id').join(',')+')';
    sql += ' VALUES ';
    sql += field;

    sqlValues = Object.entries(data).filter(([k,v]) => k !== 'id').map(([k, v]) => v);
    
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

router.put('/delete', passport.authenticate('jwt', {session:false}), (request, response) => {
    
    let sql = 'DELETE FROM adresse_catalogue ';
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
                response.status(200).json(result);
            }
        });
    });

})

module.exports = router;
