const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');
const xls = require('../excel/createBRS');

router.get('/create', passport.authenticate('jwt', { session: false }), (request, response) => {

    let data = request.query;
    // Envoi id_sol pour aller prendre la suivante (0 si pas d'id)

    let sql = `SELECT l.n_marche, l.libelle lot, a.libelle attributaire, a.siret, a.representant, a.representantMail, a.destinataire, a.destinataireMail, a.adresse, a.telephone,
    u.libelle utilisateur, f.n_Article, c.intitule_form_marche, o.libelle objectif, n.libelle niveau, c.formacode, x.lieu_execution, f.nb_place, f.heure_max_session, f.heure_entreprise, f.heure_centre, f.date_entree_demandee, f.date_fin, x.dateIcop
    
        FROM formation f
        INNER JOIN (SELECT s.id_formation, s.attributaire, s.id, sh.etat, si.dateIcop, s.lieu_execution FROM sollicitation s
                    LEFT JOIN sollicitation_historique sh ON sh.id_sol = s.id
                    LEFT JOIN sollicitation_etat se ON sh.etat = se.id
                    LEFT JOIN sollicitation_dateicop si ON si.id = s.id_dateIcop
                    WHERE sh.date_etat = 
                        (SELECT MAX(date_etat) FROM sollicitation_historique h WHERE h.id_sol = s.id) 
                ) x ON x.id_formation = f.id
        LEFT JOIN user u ON u.id = f.idgasi
        LEFT JOIN catalogue c ON c.id = f.id_cata
        LEFT JOIN lot l ON l.id = c.id_lot
        LEFT JOIN attributaire a ON a.id = x.attributaire
        LEFT JOIN objectif o ON o.id = c.objectif_form
        LEFT JOIN niveau n ON n.id = c.niveau_form
        WHERE id_lot = ? AND a.id = ? AND x.etat = 5
        GROUP BY f.id`;
    console.log(data)

    pool.getConnection(function (error, conn) {
        if (error) throw err;

        conn.query(sql, [data.id_lot, data.attributaire], (err, result) => {
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
                    const attrib = {
                        titulaire:jsonResult[0].titulaire,
                        siret:jsonResult[0].siret,
                        representantMail:jsonResult[0].representantMail,
                        representant:jsonResult[0].representant,
                        adresse:jsonResult[0].adresse,
                        telephone:jsonResult[0].telephone,}
                    // response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    // response.setHeader('Content-Disposition', 'attachment; filename=MERDE.xlsx');

                    xls.CreateBrs('MERDE.xlsx', jsonResult, attrib).xlsx.write(response)
                        .then(function () {
                            response.status(200).end();
                        });

                    // response.status(200).json(result);
                } else {
                    return response.status(300).json({
                        err: 'true',
                        error: 'Pas de données',
                        errno: 300,
                    });
                }
            }
        });
    });

    // let currentDate = new Date();
    // let time =
    //     currentDate.getFullYear().toString().padStart(2, '0') + '-' +
    //     (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
    //     currentDate.getDate().toString().padStart(2, '0') + ' ' +
    //     currentDate.getHours().toString().padStart(2, '0') + ":" +
    //     currentDate.getMinutes().toString().padStart(2, '0') + ":" +
    //     currentDate.getSeconds().toString().padStart(2, '0');


})


module.exports = router;