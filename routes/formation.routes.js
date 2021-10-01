const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');

router.put('/create', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sqlValues = [];
    let data = request.body;
    let fieds = ['id_cata', 'idgasi', 'agence_ref', 'dispositif', 'n_Article',
        'nb_place', 'vague', 'id_commune', 'date_creation', 'etat',
        'date_entree_demandee', 'date_entree_fixe', 'date_DDINT1', 'date_DFINT1', 'date_DDINT2', 'date_DFINT2', 'date_fin',
        'heure_max_session', 'heure_centre', 'heure_entreprise', 'date_nconv', 'nConv',]

    sqlValues = fieds.map((v) => data[v] === '' ? null : data[v])
    let field = '(' + fieds.map((v) => v).join(',') + ')';
    let value = '(' + fieds.map((v) => '?').join(',') + ')';

    let sql = `INSERT INTO formation ${field} VALUES ${value}`;

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        const data = request.body;
        conn.query(sql, sqlValues, (err, result) => {

            if (err) {
                conn.release();
                console.log(err.sqlMessage)
                return response.status(500).json({
                    err: 'true',
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            } else {

                // Enregistre dans la table compteur la nouvelle formation
                if (!data.createNewFormationFromThis.etat) {
                    let sqlCompt = (data.nbarticle > 0)
                        ? 'UPDATE catalogue_compteur set nb = ? WHERE id_cata = ?'
                        : 'INSERT INTO catalogue_compteur (nb,id_cata) VALUES (?,?)';

                    sqlValuesCompt = [data.nbarticle + 1, data.id_cata];

                    conn.query(sqlCompt, sqlValuesCompt, (err) => {
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

                } else {
                    // Update etat de la formation initial pour Annulé la form. Sera remplacer par la nouvelle
                    let sqlCancel = 'UPDATE formation SET etat = 20 WHERE id = ?';
                    let sqlValuesCancel = [data.createNewFormationFromThis.idChange];

                    conn.query(sqlCancel, sqlValuesCancel, (err) => {

                        if (err) {
                            conn.release();
                            console.log(err.sqlMessage)
                            return response.status(500).json({
                                err: 'true',
                                error: err.message,
                                errno: err.errno,
                                sql: err.sql,
                            });
                        } else if (data.id_sol) {
                            let sqlCancelSol = 'INSERT INTO sollicitation_historique (id_sol, etat, date_etat, information) VALUES (?,?,?,?)';
                            let sqlValuesCancelSol = [
                                data.id_sol,
                                20,
                                data.date_creation,
                                'Modification ' + data.createNewFormationFromThis.fieldChange +
                                ' par ' + data.createNewFormationFromThis.userChange];

                            conn.query(sqlCancelSol, sqlValuesCancelSol, (err) => {
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

                    });
                }

                // Enregistre dans formation_historic -> En cours d'élaboration
                // const jsonResult = JSON.parse(JSON.stringify(result));

                // let sqlHisto = 'INSERT INTO formation_historique (id_formation, id_etat, date_etat) VALUES (?,?,?)';

                // let sqlValuesHisto = [jsonResult.insertId, 1, data.date_creation];

                // conn.query(sqlHisto, sqlValuesHisto, (err) => {
                //     conn.release();

                //     if (err) {
                //         console.log(err.sqlMessage)
                //         return response.status(500).json({
                //             err: 'true',
                //             error: err.message,
                //             errno: err.errno,
                //             sql: err.sql,
                //         });
                //     }
                // });

                // let io = request.app.get("io");
                // io.emit("updateCatalogue", request.body);
                response.status(200).json(result);
            }
        });
    });

})

router.put('/update', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sqlValues = [];
    let data = request.body;
    let fieds = [
        'agence_ref',
        'n_Article',
        'dispositif',
        'nb_place',
        'vague',
        'id_commune',
        'date_entree_demandee',
        'date_DDINT1',
        'date_DFINT1',
        'date_DDINT2',
        'date_DFINT2',
        'date_fin',
        'date_nconv',
        'nConv',]

    sqlValues = fieds.map((v) => data[v] === '' ? null : data[v])
    let field = fieds.map((v) => v + '=?').join(',');

    let sql = `UPDATE formation SET ${field} WHERE id = ?`;
    sqlValues.push(data.id);
    console.log(sqlValues)
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
            } else response.status(200).json(result);
        });
    });
})

router.put('/updateEtat', passport.authenticate('jwt', { session: false }), (request, response) => {

    let data = request.body;

    let sql = `UPDATE formation SET etat=? WHERE id = ?`;

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        const data = request.body;
        conn.query(sql, [data.etat, data.id], (err, result) => {
            conn.release();

            if (err) {
                console.log(err.sqlMessage)
                return response.status(500).json({
                    err: 'true',
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            } else response.status(200).json(result);
        });
    });
})

router.get('/findAttributaires', passport.authenticate('jwt', { session: false }), (request, response) => {

    const data = request.query;

    let sqlValues = [];
    let sql = `SELECT a.*, GROUP_CONCAT(cac.id_commune SEPARATOR '-') id_communes, ca.priorite FROM attributaire a 
                LEFT JOIN catalogue_attributaire ca ON ca.id_attributaire = a.id
                LEFT JOIN catalogue_attributaire_commune cac ON cac.id_cata_attr = ca.id
                LEFT JOIN formation f ON f.id_cata = ca.id_cata
                WHERE f.id = ? GROUP BY a.id ORDER BY ca.priorite`;

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

router.get('/count', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sql = `SELECT count(id) as count FROM formation`;
    let sqlValues = [];

    pool.getConnection(function (error, conn) {
        if (error) throw err;

        let data = request.query;
        if (data.s > 0) {
            sql += ' WHERE etat = ?';
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
            } else {
                response.status(200).json(result);
            }
        });
    });
})

router.get('/findAll', passport.authenticate('jwt', { session: false }), (request, response) => {
    let sql = `SELECT f.id, c.id_lot id_lot, c.intitule_form_marche intitule, f.id_cata, f.agence_ref, a.libelle_ape agence_ref_libelle, f.dispositif, f.n_Article,
    f.nb_place, f.date_creation, f.date_entree_demandee, f.date_entree_fixe, f.date_DDINT1, f.date_DDINT2, f.date_DFINT1, f.date_DFINT2, 
    f.heure_centre, f.heure_entreprise, f.date_fin, f.heure_max_session, f.adresse, f.vague, f.nConv, f.date_nconv,
    v.id id_commune, v.libelle commune, s.id id_sol, s.attributaire id_attributaire, 
    (CASE 
    	WHEN s.id is NULL THEN CASE WHEN f.etat = 1 THEN 0 ELSE f.etat END
        ELSE sh.etat
    END) etat,
    (CASE 
    	WHEN s.id is NULL THEN CASE WHEN f.etat = 1 THEN "En cours d'élaboration" ELSE "Annulé" END
        ELSE se.etat
    END) etat_libelle,
    sh.date_etat,
    u.fonction userFct, COALESCE(cc.nb,0) nbarticle
        FROM formation f
        LEFT JOIN ape a ON a.id = f.agence_ref
        LEFT JOIN catalogue c ON c.id = f.id_cata
        LEFT JOIN catalogue_compteur cc ON cc.id_cata = c.id
        LEFT JOIN ville v ON v.id = f.id_commune
        LEFT JOIN user u ON u.id = f.idgasi
        LEFT JOIN sollicitation s ON s.id_formation = f.id
        LEFT JOIN sollicitation_historique sh ON sh.id_sol = s.id
        LEFT JOIN sollicitation_etat se ON se.id = sh.etat
            WHERE (
                sh.date_etat = 
                    (SELECT MAX(h1.date_etat) FROM formation f1 
                        LEFT JOIN sollicitation s1 ON s1.id_formation = f1.id 
                        LEFT JOIN sollicitation_historique h1 ON h1.id_sol = s1.id WHERE f1.id = f.id )  
                    OR sh.date_etat is null
                )
            
        GROUP BY f.id
        ORDER BY f.date_creation DESC`

    let sqlValues = [];


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
})

router.put('/historique', passport.authenticate('jwt', { session: false }), (request, response) => {

    let data = request.body;
    let sql = 'INSERT INTO formation_historique(id_formation, id_etat, date_etat, information) VALUES (?,?,?,?)';

    pool.getConnection(function (error, conn) {
        if (error) throw err;

        conn.query(sql, [data.id_formation, data.id_etat, data.date_etat, data.information], (err, result) => {
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

// Enregistre le numéro de conventionnement
router.put('/conventionnement', passport.authenticate('jwt', { session: false }), (request, response) => {
    let data = request.body;
    let sql = 'UPDATE formation SET nConv = ?, date_nConv = ? WHERE id = ?';

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        conn.query(sql, [data.nConv, data.date_nConv, data.id_formation], (err, result) => {

            if (err) {
                conn.release();
                console.log(err.sqlMessage)
                return response.status(500).json({
                    err: 'true',
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            } else {

                const jsonResult = JSON.parse(JSON.stringify(result));

                sql = `UPDATE sollicitation SET date_nConv = ? WHERE id = ?`;
                sqlValues = [data.date_nConv, data.id_sol];

                conn.query(sql, sqlValues, (err) => {

                    if (err) {
                        console.log(err.sqlMessage)
                        return response.status(201).json({
                            err: 'true',
                            error: err.message,
                            errno: err.errno,
                            sql: err.sql,
                        });
                    } else {
                        // Nouvel entrée pour l'historique de la sollicitation
                        sql = `INSERT INTO sollicitation_historique (id_sol, etat, date_etat, information) VALUES (?,?,?,?)`;
                        sqlValues = [data.id_sol, 12, data.date_nConv, data.user + ' : ' + data.nConv]

                        conn.query(sql, sqlValues, (err) => {

                            if (err) {
                                console.log(err.sqlMessage)
                                return response.status(201).json({
                                    err: 'true',
                                    error: err.message,
                                    errno: err.errno,
                                    sql: err.sql,
                                });
                            }
                        })
                    }
                })
                response.status(200).json(result);
            }
        });
    });

})

module.exports = router;