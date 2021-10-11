require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const mail = require('../utils/mail/mail');
const xls = require('../utils/excel/excel');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db.config');
const { exit } = require('process');

router.put('/sendSollicitation', passport.authenticate('jwt', { session: false }), (request, response) => {

    const data = request.body

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
                    templateFileName: 'templateSollicitation.html',
                    banniereFileName: 'banniereSollicitation.png',
                    bcc:jsonResult[0].mail_src,
                    mail_destinataire: data.destinaireMail,
                }

                mail.sendMail(dataMail, attachment, (err, data) => {
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

router.put('/sendNotification', passport.authenticate('jwt', { session: false }), (request, response) => {

    const data = request.body;
    let attachment = {};
    let sql = '';
    let sqlValues = [];
    let dataMail = {
        templateFileName: 'templateNotification.html',
        banniereFileName: 'banniereNotification.png',
    };
    switch (data.target) {

        // A l'édition d'un BRS, envoi un mail au DT pour les notifier
        case 'DT_BRS_Edite':

            let sqlComplete = data.array_id_sol.map((v) => '?').join(',');

            sql = `SELECT f.n_Article, c.intitule_form_marche intitule, u.mail mail_destinataire
                FROM sollicitation s 
                INNER JOIN formation f ON f.id = s.id_formation
                INNER JOIN user u ON u.id = f.idgasi
                INNER JOIN catalogue c ON c.id = f.id_cata
                WHERE s.id IN (${sqlComplete})`;

            sqlValues = data.array_id_sol;

            dataMail.message = 'Un BRS à été édité pour les formations suivantes :<br/>';

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

                        dataMail.message += jsonResult.map((v) => ` - ${v.n_Article} : ${v.intitule}`).join('<br/>');
                        dataMail.message += `<br/><br/>BRS ${data.filename}`
                        dataMail.mail_destinataire = jsonResult[0].mail_destinataire;
                        dataMail.bcc = null;
                        dataMail.dateTime = data.dateTime;

                        mail.sendMail(dataMail, attachment, (err, data) => {
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

            break;

        case 'conventionnement':
            // Récupr adresse DT concerné + adresse OF
            console.log(data)
            sql = `SELECT u.mail bcc, a.destinataireMail mail_destinataire
                FROM attributaire a 
                INNER JOIN catalogue_attributaire ca ON ca.id_attributaire = a.id
                INNER JOIN catalogue c On c.id = ca.id_cata
                INNER JOIN formation f On f.id_cata = c.id
                LEFT JOIN user u ON u.id = f.idgasi
                WHERE f.id = ?`;

            pool.getConnection(function (error, conn) {
                if (error) throw err;

                conn.query(sql, [data.formation.id], (err, result) => {
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

                        dataMail.message = `La formation ${data.formation.intitule} à reçu le numéro de conventionnement suivant : ${data.formation.nConv_tmp}`;
                        dataMail.mail_destinataire = jsonResult[0].mail_destinataire;
                        dataMail.bcc = jsonResult[0].bcc;
                        dataMail.dateTime = data.dateTime;

                        mail.sendMail(dataMail, attachment, (err, data) => {
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

            break;
        default: return false;
    }

})

module.exports = router;