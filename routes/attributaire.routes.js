const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');

router.put('/addAdresse', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sql = 'INSERT INTO catalogue_attributaire_commune_adresse (id_catalogue_attributaire_commune, id_adresse) VALUES (?,?)';
    let data = request.body;

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        const data = request.body;
        conn.query(sql, [data.id_of_cata_commune, data.id_adresse], (err, result) => {
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
                // let io = request.app.get("io");
                // io.emit("updateAdresse", request.body);
                response.status(200).json(result);
            }
        });
    });

})

router.put('/deleteAdresse', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sql = `DELETE a FROM catalogue_attributaire_commune_adresse a 
        LEFT JOIN catalogue_attributaire_commune b ON b.id = a.id_catalogue_attributaire_commune
        WHERE b.id_cata_attr = ? AND a.id_adresse = ?`;
    let sqlValues = [];
    let data = request.body;

//     SELECT * FROM catalogue_attributaire_commune a
// LEFT JOIN catalogue_attributaire_commune_adresse b ON b.id_catalogue_attributaire_commune = a.id WHERE a.id_cata_attr = 27 AND b.id_adresse = 149

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        const data = request.body;
        conn.query(sql, [data.id_cata_attr, data.id_adresse], (err, result) => {
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
                // let io = request.app.get("io");
                // io.emit("updateAdresse", request.body);
                response.status(200).json({});
            }
        });
    });

})

router.get('/findCommune', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sqlValues = [];
    let sql = `SELECT v.id, v.libelle 
        FROM ville v 
        LEFT JOIN catalogue_attributaire_commune cac ON cac.id_commune = v.id 
        WHERE id_cata_attr = ?`;

    const data = request.query;
    sqlValues.push(data.id_of_cata);

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

    const data = request.query;

    let sqlValues = [];
    let sql = `SELECT a.* FROM attributaire a WHERE a.id NOT IN (
                SELECT cat.id_attributaire FROM catalogue_attributaire cat
                WHERE cat.id_cata=? GROUP BY cat.id
            )`;

    pool.getConnection(function (error, conn) {
        if (error) throw err;

        conn.query(sql, [data.id_cata], (err, result) => {
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