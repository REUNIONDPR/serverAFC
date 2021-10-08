require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const mail = require('../utils/mail/mail');
const xls = require('../utils/excel/excel');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db.config');

router.put('/sendSollicitation', passport.authenticate('jwt', { session: false }), (request, response) => {

    const data = request.body
    console.log(data)

    const sql = `SELECT o.libelle objectif, n.libelle niveau, c.formacode, u.libelle contact, u.mail mail_src
        FROM formation f 
        INNER JOIN catalogue c ON c.id = f.id_cata
        INNER JOIN objectif o ON o.id = c.objectif_form
        INNER JOIN niveau n ON n.id = c.niveau_form
        INNER JOIN user u ON u.id = f.idgasi
        WHERE f.id = ?`;

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

                const jsonResult = JSON.parse(JSON.stringify(result));

                const rowTalbe = [[
                    jsonResult[0].contact,
                    data.n_Article,
                    data.intitule,
                    jsonResult[0].objectif,
                    jsonResult[0].niveau,
                    jsonResult[0].formacode,
                    '',
                    7,
                    data.nb_place,
                    '',
                    data.heure_max_session,
                    data.heure_entreprise,
                    data.heure_centre,
                    data.date_entree_demandee,
                    '',
                    '',
                    '',
                ]]

                const wb = xls.CreateSollicitation('S' + data.id_attributaire + data.id_sol, rowTalbe)
                const dir = path.join(__dirname, '../utils/excel/sollicitation/LOT1')
                const filename = 'A' + data.id_attributaire + 'S' + data.id_sol + '.xlsx';

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                wb.xlsx.writeFile(dir + '/' + filename)

                let attachment = {
                    filename: filename,
                    path: path.join(__dirname, '../utils/excel/sollicitation/LOT1/' + filename),
                }

                const dataMail = {
                    mail_src: jsonResult[0].mail_src,
                    libelle: data.libelle,
                    contact: jsonResult[0].contact,
                    id: data.id_sol,
                    // bcc:jsonResult[0].mail_src,
                    // mail_destinataire: data.destinaireMail,
                    bcc:'nicarap@hotmail.com',
                    mail_destinataire: 'raphael.lebon@pole-emploi.fr',
                }

                mail.sendSollicitation(dataMail, attachment, (err, data) => {
                    if (err) {
                        console.log(err)
                        response.status(500).json({
                            status: 'fail'
                        })
                    } else {
                        response.status(201).json({
                            status: 'success'
                        })
                    }
                })
            }
        })
    })






})

module.exports = router;