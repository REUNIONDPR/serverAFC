
const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');

router.put('/create', passport.authenticate('jwt', { session: false }), (request, response) => {
    // Créer premiere sollicitation, retourne id, enregistre id_sol
    // let sqlValues = [];
    // let data = request.body;
    // let fieds = ['id_cata',
    //     'idgasi',
    //     'statut',
    //     'agence_ref',
    //     'dispositif',
    //     'n_Article',
    //     'nb_place',
    //     'vague',
    //     'id_commune',
    //     'date_creation',
    //     'date_entree',
    //     'date_DDINT1',
    //     'date_DFINT1',
    //     'date_DDINT2',
    //     'date_DFINT2',
    //     'date_fin',
    //     'heure_max_session',
    //     'heure_centre',
    //     'heure_entreprise',
    //     'date_nconv',
    //     'nConv',]

    // sqlValues = fieds.map((v) => data[v] === '' ? null : data[v])
    // let field = '(' + fieds.map((v) => v).join(',') + ')';
    // let value = '(' + fieds.map((v) => '?').join(',') + ')';

            let sql = `SELECT a.* FROM catalogue_attributaire_commune cac
            INNER JOIN catalogue_attributaire ca ON cac.id_cata_attr = ca.id
            INNER JOIN attributaire a ON a.id = ca.id_attributaire
            INNER JOIN formation f ON f.id_cata = ca.id_cata
            WHERE ca.id_cata = 1 AND cac.id_commune = 7 AND f.id = 19`;

    console.log(data)

    // pool.getConnection(function (error, conn) {
    //     if (error) throw err;
    
    //     conn.query(sql, [], (err, result) => {
    //         conn.release();
    
    //         if (err) {
    //             console.log(err.sqlMessage)
    //             return response.status(500).json({
    //                 err: 'true',
    //                 error: err.message,
    //                 errno: err.errno,
    //                 sql: err.sql,
    //             });
    //         }else{
    //             response.status(200).json(result);
    //         }
    //     });
    // });

})

module.exports = router;  