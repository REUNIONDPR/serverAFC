
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

    sqlValues = [data.id, data.attributaire, time];

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
                        }
                    });
                });
                response.status(200).json(result);
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

router.put('/save', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sqlValues = [];
    let data = request.body;
    let sql = `UPDATE sollicitation SET 
        lieu_execution = ?, id_dateIcop = ?, dateValidationDT = ?, dateValidationDDO = ?  WHERE id = ?`

    sqlValues = [
        data.sollicitation.lieu_execution,
        data.sollicitation.id_dateIcop,
        data.sollicitation.dateValidationDT,
        data.sollicitation.dateValidationDDO,
        data.sollicitation.id_sol,
    ];

    pool.getConnection(function (error, conn) {
        if (error) throw err;

        conn.query(sql, sqlValues, (err, result) => {
            // conn.release();

            if (err) {
                console.log(err.sqlMessage)
                return response.status(500).json({
                    err: 'true',
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            } else {

                sql = `INSERT INTO sollicitation_historique (id_sol, etat, date_etat, information) VALUES (?,?,?,?)`;
                sqlValues = [data.sollicitation.id_sol, data.etat, data.dateTime, data.reason];

                conn.query(sql, sqlValues, (err) => {
                    conn.release();

                    if (err) {
                        console.log(err.sqlMessage)
                        return response.status(201).json({
                            err: 'true',
                            error: err.message,
                            errno: err.errno,
                            sql: err.sql,
                        });
                    }else response.status(200).json(result);
                });


            }
        });
    });
})

router.get('/findHistoric', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sqlValues = [];
    let data = request.query;
    let sql = `SELECT * FROM sollicitation_historique  WHERE id_sol = ?`

    sqlValues = [data.id_sol];

    pool.getConnection(function (error, conn) {
        if (error) throw err;

        conn.query(sql, sqlValues, (err, result) => {
            // conn.release();

            if (err) {
                console.log(err.sqlMessage)
                return response.status(500).json({
                    err: 'true',
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            } else return response.status(200).json(result);
        });
    });
})

router.get('/findAll', passport.authenticate('jwt', { session: false }), (request, response) => {

    let data = request.query;
    let sql = `SELECT s.id id_sol, s.id_formation, s.attributaire, s.lieu_execution, sh.information,
    s.id_dateIcop, s.dateValidationDT, 
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

router.get('/find', passport.authenticate('jwt', { session: false }), (request, response) => {

    let data = request.query;
    let sql = `SELECT s.id id_sol, s.id_formation, s.attributaire, s.lieu_execution, s.id_dateIcop, s.dateValidationDT, 
        DATE_FORMAT(s.dateMailOF, '%Y-%m-%d') dateMailOF, DATE_FORMAT(s.dateRespOF, '%Y-%m-%d') dateRespOF
        FROM sollicitation s 
            WHERE s.id = ?`;

    pool.getConnection(function (error, conn) {
        if (error) throw err;

        conn.query(sql, [data.id_sol], (err, result) => {
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

router.put('/addIcop', passport.authenticate('jwt', { session: false }), (request, response) => {

    let data = request.body;
    let sql = 'INSERT INTO sollicitation_dateicop(id_sol, dateIcop) VALUES (?,?)';

    pool.getConnection(function (error, conn) {
        if (error) throw err;

        conn.query(sql, [data.id_sol, data.icop], (err, result) => {
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

router.get('/icop', passport.authenticate('jwt', { session: false }), (request, response) => {

    let data = request.query;
    let sql = `SELECT i.id, i.dateIcop FROM sollicitation_dateicop i WHERE i.id_sol = ? ORDER BY i.dateIcop`;

    pool.getConnection(function (error, conn) {
        if (error) throw err;

        conn.query(sql, data.id_sol, (err, result) => {
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

router.get('/lieuExecution', passport.authenticate('jwt', { session: false }), (request, response) => {

    let data = request.query;
    let sql = `SELECT a.id, a.adresse FROM sollicitation s
        LEFT JOIN formation f ON f.id = s.id_formation
        LEFT JOIN catalogue_attributaire ca On ca.id_cata = f.id_cata AND ca.id_attributaire = s.attributaire

        LEFT JOIN catalogue_attributaire_commune cac ON cac.id_cata_attr = ca.id AND cac.id_commune = f.id_commune
        LEFT JOIN catalogue_attributaire_commune_adresse cca ON cca.id_catalogue_attributaire_commune = cac.id
        LEFT JOIN adresse a ON a.id = cca.id_adresse
        WHERE s.id = ?`;

    pool.getConnection(function (error, conn) {
        if (error) throw err;

        conn.query(sql, [data.id_sol], (err, result) => {
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