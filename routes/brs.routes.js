const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');
const xls = require('../excel/createBRS');
const excel = require('exceljs');
const fs = require('fs');

router.put('/create', passport.authenticate('jwt', { session: false }), (request, response) => {

    // Créer BRS BDD
    // Créer ligne histo
    // MaJ brs_compteur

    let data = request.body;

    let sql = 'INSERT INTO brs (n_brs, filename, id_lot, id_attributaire) VALUES (?,?,?,?)';
    let sqlValues = [data.n_brs, data.filename, data.id_lot, data.id_attributaire];

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

                const jsonResult = JSON.parse(JSON.stringify(result));

                sql = `INSERT INTO brs_historique (id_brs, id_etat, date_etat) VALUES (?,?,?)`;
                sqlValues = [jsonResult.insertId, 1, data.dateTime]

                conn.query(sql, sqlValues, (err, result_histo) => {
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

                        if (data.replace_brs === 0) {
                            // Met à jour le compteur de BRS
                            let sqlCompteur = '';
                            sqlCompteur = data.nb_brs === 1
                                ? `INSERT INTO brs_compteur (nb, id_lot) VALUES (?,?)`
                                : `UPDATE brs_compteur SET nb = ? WHERE id_lot = ?`;

                            let sqlValuesCompteur = [data.nb_brs, data.id_lot]

                            conn.query(sqlCompteur, sqlValuesCompteur, (err, result_compteur) => {
                                conn.release();

                                if (err) {
                                    console.log(err.sqlMessage)
                                    return response.status(500).json({
                                        err: 'true',
                                        error: err.message,
                                        errno: err.errno,
                                        sql: err.sql,
                                    });
                                } else response.status(200).json(result)
                            });
                        } else {
                            // Le nouveau BRS viens remplacer un autre
                            let sqlUpdate = 'UPDATE brs SET nouveauBRS = ? WHERE id = ?'
                            let sqlValuesUpdate = [jsonResult.insertId, data.replace_brs]

                            conn.query(sqlUpdate, sqlValuesUpdate, (err, result_compteur) => {
                                conn.release();

                                if (err) {
                                    console.log(err.sqlMessage)
                                    return response.status(500).json({
                                        err: 'true',
                                        error: err.message,
                                        errno: err.errno,
                                        sql: err.sql,
                                    });
                                } else response.status(200).json(result)
                            });
                        }
                    }
                });
            }
        })
    })
})

router.put('/edit', passport.authenticate('jwt', { session: false }), (request, response) => {

    // Recupere l'ensemble des sollicitations du BRS
    // Etat 10 sollicitation modifie
    // Etat 11 les autres 
    let data = request.body;

    let sql = `SELECT bs.id_brs, bs.id_sol, f.id id_formation FROM brs_sollicitation bs 
    LEFT JOIN sollicitation s ON s.id = bs.id_sol
    LEFT JOIN formation f ON s.id_formation = f.id
    WHERE bs.id_brs = 
    (SELECT b.id FROM brs b LEFT JOIN brs_sollicitation bs ON bs.id_brs = b.id WHERE bs.id_sol = ? AND b.modifie_brs = ?)`;

    let sqlValues = [data.id_sol, 0];

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
                const jsonResult = JSON.parse(JSON.stringify(result));
                if (jsonResult.length > 0) {

                    // MaJ brs flag modifie_brs
                    const sqlUpdateBRS = 'UPDATE brs SET modifie_brs = ? WHERE id = ?';
                    const sqlUpdateBRSValues = [1, jsonResult[0].id_brs];

                    conn.query(sqlUpdateBRS, sqlUpdateBRSValues, (err, result) => {
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
                    })
                    // MaJ historique de la sollicitation (BRS modifié)
                    sql = `INSERT INTO sollicitation_historique (id_sol, etat, date_etat, information) VALUES (?,?,?,?)`;

                    for (let i = 0; i < jsonResult.length; i++) {

                        let information = data.information + ' initial ' + jsonResult[i].id_brs
                        let etat = jsonResult[i].id_sol !== data.id_sol ? 11 : 10;
                        sqlValues = [jsonResult[i].id_sol, etat, data.dateTime, information];

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
                        })

                    }
                    response.status(200).json(result)
                } else {
                    return response.status(500).json({
                        err: 'true',
                        error: 'error update historique sollicitation',
                    });
                }
            }

        })
    })
})

router.put('/createFile', passport.authenticate('jwt', { session: false }), (request, response) => {

    let data = request.body;

    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', 'attachment; filename=' + data.filename);

    const wb = xls.CreateBrs(data.filename, data.brs, data.attrib, data.rowsTable)
    const dir = 'excel/BRS/' + data.lot;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    wb.xlsx.writeFile('excel/BRS/' + data.lot + '/' + data.filename)
    wb.xlsx.write(response)
        .then(function () {
            response.status(200).end();
        });
})

router.get('/findAll', passport.authenticate('jwt', { session: false }), (request, response) => {

    const sql = `SELECT b.filename, b.id, b.n_brs, b.id_lot, l.libelle, b.id_attributaire, a.libelle titulaire, 
    COALESCE(b.modifie_brs,0) modifie_brs, COALESCE(b.nouveauBRS,0) nouveauBRS
    FROM brs b 
    LEFT JOIN lot l ON l.id = b.id_lot 
    LEFT JOIN attributaire a ON a.id = b.id_attributaire`;

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
            } else response.status(200).json(result)
        })
    })
})

router.put('/downlaod', passport.authenticate('jwt', { session: false }), (request, response) => {
    const data = request.body;
    const filePath = `excel/BRS/${data.lot}/${data.filename}`

    response.download(filePath);

    // fs.writeFile(filePath, data, function (err) {
    //     if (err) {
    //         //Error handling
    //     } else {
    //         console.log('Done');
    //         res.download(filePath, fileName, function(err) {
    //             console.log('download callback called');
    //             if( err ) {
    //                 console.log('something went wrong');
    //             }

    //         }); // pass in the path to the newly created file
    //     }
    // });


})

router.get('/findSollicitation', passport.authenticate('jwt', { session: false }), (request, response) => {
    const data = request.query
    const sql = `SELECT s.id id_sol, f.id id_formation, f.idgasi, f.dispositif, f.n_Article, f.nb_place, f.vague, f.date_entree_demandee, f.date_fin, f.nConv, 
        c.intitule_form_marche, sh.date_etat, se.etat
        FROM brs_sollicitation bs 
        LEFT JOIN sollicitation s ON s.id = bs.id_sol
        LEFT JOIN formation f ON f.id = s.id_formation
        LEFT JOIN catalogue c ON c.id = f.id_cata
        LEFT JOIN sollicitation_historique sh ON sh.id_sol = s.id
        LEFT JOIN sollicitation_etat se ON se.id = sh.etat
        WHERE bs.id_brs = ? AND sh.date_etat = 
        (SELECT MAX(date_etat) FROM sollicitation_historique h WHERE h.id_sol = s.id) `;

    pool.getConnection(function (error, conn) {
        if (error) throw err;

        conn.query(sql, data.id, (err, result) => {
            conn.release();
            if (err) {
                console.log(err.sqlMessage)
                return response.status(500).json({
                    err: 'true',
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            } else response.status(200).json(result)
        })
    })
})

module.exports = router;