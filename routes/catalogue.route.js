const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/findAll', passport.authenticate('jwt', { session: false }), (request, response) => {

    // let sql = `SELECT c.id, c.lot, c.n_Article,
    // c.intitule_form_marche, c.formacode,
    // n.niveau as niveau_form, o.certification as objectif_form, 
    // c.nb_heure_socle, c.nb_heure_ent, c.nb_heure_appui, c.nb_heure_soutien, c.prixTrancheA, c.prixTrancheB, 
    // GROUP_CONCAT(CONCAT('{"id":"', a.id, '", "adresse":"',a.adresse,'"}') SEPARATOR '//') as adresse
    // FROM catalogue c 
    // LEFT JOIN formation_objectif o ON o.id = c.objectif_form 
    // LEFT JOIN formation_niveau n ON n.id = c.niveau_form
    // LEFT JOIN adresse_catalogue adc ON adc.id_elmt = c.id
    // LEFT JOIN adresse_attributaire adt ON adc.id_adr_attr = adt.id
    // LEFT JOIN adresse a ON a.id = adt.id_adresse
    // GROUP BY c.id`;

    let sql = `SELECT c.id, c.lot display_lot, c.n_Article,
        c.intitule_form_marche, c.formacode,
        c.niveau_form display_formation_niveau, c.objectif_form display_formation_objectif, 
        c.nb_heure_socle, c.nb_heure_ent, c.nb_heure_appui, c.nb_heure_soutien, c.prixTrancheA, c.prixTrancheB, 
        c.id as adresse
        FROM catalogue c 
        GROUP BY c.id`;

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        conn.query(sql, (err, result) => {
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

router.put('/update', passport.authenticate('jwt', {session:false}), (request, response) => {
    
    let sql = 'UPDATE catalogue SET n_Article = ?, intitule_form_marche = ?, nb_heure_ent = ?, nb_heure_appui = ?, nb_heure_soutien = ?, prixTrancheA = ?, prixTrancheB = ? WHERE id = ?';
    
    pool.getConnection(function (error, conn) {
        if (error) throw err;
        const data = request.body;
        conn.query(sql, [data.n_Article,
            data.intitule_form_marche,
            data.nb_heure_ent,
            data.nb_heure_appui,
            data.nb_heure_soutien,
            data.prixTrancheA,
            data.prixTrancheB,
            data.id], (err, result) => {
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
                io.emit("updateCatalogue", request.body);
                response.status(200).json(result);
            }
        });
    });

})

module.exports = router;