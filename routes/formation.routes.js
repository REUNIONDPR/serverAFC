const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');

router.put('/create', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sqlValues = [];
    let data = request.body;
    let fieds = ['id_cata',
        'idgasi',
        'etat',
        'agence_ref',
        'dispositif',
        'n_Article',
        'nb_place',
        'vague',
        'id_commune',
        'date_creation',
        'date_entree_demandee',
        'date_DDINT1',
        'date_DFINT1',
        'date_DDINT2',
        'date_DFINT2',
        'date_fin',
        'heure_max_session',
        'heure_centre',
        'heure_entreprise',
        'date_nconv',
        'nConv',]

    sqlValues = fieds.map((v) => data[v] === '' ? null : data[v])
    let field = '(' + fieds.map((v) => v).join(',') + ')';
    let value = '(' + fieds.map((v) => '?').join(',') + ')';

    let sql = `INSERT INTO formation ${field} VALUES ${value}`;

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
            } else {

                // Enregistre dans la table compteur la nouvelle formation
                let sqlCompt = (data.nbarticle > 0)
                    ? 'UPDATE catalogue_compteur set nb = ? WHERE id_cata = ?'
                    : 'INSERT INTO catalogue_compteur (nb,id_cata) VALUES (?,?)';

                let sqlValuesCompt = [data.nbarticle + 1, data.id_cata];
                
                pool.getConnection(function (error, conn) {
                    if (error) throw err;
                    conn.query(sqlCompt, sqlValuesCompt, (err, result) => {
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
        'etat',
        'agence_ref',
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
    let field = '(' + fieds.map((v) => v + '=?').join(',') + ')';

    let sql = `UPDATE formation SET ${field} WHERE id = ?`;
    sqlValues.push(data.id);

    console.log(sql)
    console.log(sqlValues)
    // pool.getConnection(function (error, conn) {
    //     if (error) throw err;
    //     const data = request.body;
    //     conn.query(sql, sqlValues, (err, result) => {
    //         conn.release();

    //         if (err) {
    //             console.log(err.sqlMessage)
    //             return response.status(500).json({
    //                 err: 'true',
    //                 error: err.message,
    //                 errno: err.errno,
    //                 sql: err.sql,
    //             });
    //         } else response.status(200).json(result);
    //     });
    // });

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
    let sql = `SELECT f.id, c.id_lot id_lot, c.intitule_form_marche intitule, f.id_cata, f.agence_ref, f.dispositif, f.n_Article,
    f.nb_place, f.date_creation, f.date_entree_demandee, f.date_entree_fixe, f.date_DDINT1, f.date_DDINT2, f.date_DFINT1, f.date_DFINT2, 
    f.heure_centre, f.heure_entreprise, f.date_fin, f.heure_max_session, f.adresse, f.vague, f.nConv, f.date_nconv,
    v.id id_commune, v.libelle commune,
    u.fonction userFct,
    f.etat, s.libelle etat_formation, s.tooltip etat_formation_tooltip
        FROM formation f
        LEFT JOIN catalogue c ON c.id = f.id_cata
        LEFT JOIN ville v ON v.id = f.id_commune
        LEFT JOIN user u ON u.id = f.idgasi
        LEFT JOIN formation_etat s ON s.id = f.etat
       
        GROUP BY f.id`;
    let sqlValues = [];

    // COALESCE(z.id_soll_non_refuse,0) id_sol,
    // LEFT JOIN 
    // (SELECT x.id id_soll_non_refuse, x.id_formation FROM sollicitation x
    //     LEFT JOIN sollicitation_historique solh ON solh.id_sol = x.id
    //     WHERE solh.id IS NOT NULL AND x.id not in 
    //         (SELECT s.id_sol FROM sollicitation_historique s 
    //             WHERE s.id_sol = x.id AND s.etat = 3)
    // ) z ON z.id_formation = f.id

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

module.exports = router;