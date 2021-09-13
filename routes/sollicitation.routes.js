
const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');

router.put('/create', passport.authenticate('jwt', { session: false }), (request, response) => {
    let sqlValues = [];
    let data = request.body;
    // Envoi id_sol pour aller prendre la suivante (0 si pas d'id)

    let sql = `INSERT INTO sollicitation (id_formation, attributaire, dateMailOF) VALUES (?,?,?)`;

    let currentDate = new Date();
    let time =
        currentDate.getFullYear().toString().padStart(2, '0') + '-' +
        (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
        currentDate.getDate().toString().padStart(2, '0') + ' ' +
        currentDate.getHours().toString().padStart(2, '0') + ":" +
        currentDate.getMinutes().toString().padStart(2, '0') + ":" +
        currentDate.getSeconds().toString().padStart(2, '0');

    sqlValues = [data.id, data.attributaire.id, time];

    pool.getConnection(function (error, conn) {
        if (error) throw err;

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
                sql = `INSERT INTO sollicitation_historique (id_sol, etat, date_etat) VALUES (?,?,?)`;

                const jsonResult = JSON.parse(JSON.stringify(result));

                sqlValues = [jsonResult.insertId, 1, time]

                pool.getConnection(function (error, conn) {
                    if (error) throw err;

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
            }
        });
    });
})

router.put('/update', passport.authenticate('jwt', { session: false }), (request, response) => {
    let sqlValues = [];
    let data = request.body;
    // Envoi id_sol pour aller prendre la suivante (0 si pas d'id)



    sql = 'UPDATE sollicitation SET dateRespOF = ? WHERE id = ?'
    sqlValues = [data.dateTime, data.id_sol];
    console.log(sql, sqlValues)
    pool.getConnection(function (error, conn) {
        if (error) throw err;

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

                let sql = `INSERT INTO sollicitation_historique (id_sol, etat, date_etat, information) VALUES (?,?,?,?)`;
                sqlValues = [data.id_sol, data.etat, data.dateTime, data.reason];

                pool.getConnection(function (error, conn) {
                    if (error) throw err;
            
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
                        }
                    });
                });
                response.status(200).json(result);
                
            }
        });
    });
})

router.get('/find', passport.authenticate('jwt', { session: false }), (request, response) => {

    let data = request.query;
    let sql = `SELECT s.id id_sol, s.id_formation, s.attributaire, s.lieu_execution, sh.information,
    s.id_dateIcop, s.dateValidation, 
    DATE_FORMAT(s.dateMailOF, '%Y-%m-%d') dateMailOF, DATE_FORMAT(s.dateRespOF, '%Y-%m-%d') dateRespOF,
    sh.etat, sh.date_etat
    FROM sollicitation s 
        LEFT JOIN sollicitation_historique sh ON sh.id_sol = s.id 
        WHERE s.id_formation = ?  and date_etat = 
            (SELECT MAX(date_etat) FROM sollicitation_historique h WHERE h.id_sol = s.id) GROUP BY s.id`;

    pool.getConnection(function (error, conn) {
        if (error) throw err;

        conn.query(sql, [data.id_formation], (err, result) => {
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