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

    let sql = `SELECT a.id, a.adresse, v.libelle commune
        FROM adresse a 
        LEFT JOIN catalogue_attributaire_commune_adresse ac ON ac.id_adresse = a.id
        LEFT JOIN ville v ON v.id = a.commune 
        
        WHERE a.id NOT IN (
            SELECT a.id
                FROM adresse a
                LEFT JOIN catalogue_attributaire_commune_adresse ac ON ac.id_adresse = a.id
                LEFT JOIN catalogue_attributaire_commune ca ON ca.id = ac.id_catalogue_attributaire_commune
                WHERE ca.id_cata_attr=? GROUP BY a.id
        ) AND v.id = ? GROUP BY a.id`;

    const data = request.query;
    
    pool.getConnection(function (error, conn) {
        if (error) throw err;
        conn.query(sql, [data.id_of_cata, data.commune], (err, result) => {
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


router.get('/findOuterCommune', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sqlValues = [];
    let sql = `SELECT * FROM ville WHERE id NOT IN 
        ( SELECT v.id FROM ville v 
            LEFT JOIN catalogue_attributaire_commune catc ON catc.id_commune = v.id 
            WHERE catc.id_cata_attr = ? ) GROUP BY id ORDER BY libelle`;

    const data = request.query;
    sqlValues.push(data.id_cata_attr);

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
                // let io = request.app.get("io");
                // io.emit("updateAdresse", request.body);
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
                // let io = request.app.get("io");
                // io.emit("updateAdresse", request.body);
                response.status(200).json(result);
            }
        });
    });

})

module.exports = router;
