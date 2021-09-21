const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');
const xls = require('../excel/createBRS');
const excel = require('exceljs');
const fs = require('fs');
const https = require('https');

router.put('/create', passport.authenticate('jwt', { session: false }), (request, response) => {

    // Créer BRS BDD
    // Créer ligne histo
    // MaJ brs_compteur

    let data = request.body;
    console.log(data)
    let sql = 'INSERT INTO brs (n_brs, filename, id_lot, id_attributaire) VALUES (?,?,?,?)';
    let sqlValues = [data.n_brs, data.filename, data.id_lot, data.id_attributaire];

    pool.getConnection(function (error, conn) {
        if (error) throw err;

        conn.query(sql, sqlValues, (err, result) => {

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

                    if (err) {
                        console.log(err.sqlMessage)
                        return response.status(500).json({
                            err: 'true',
                            error: err.message,
                            errno: err.errno,
                            sql: err.sql,
                        });
                    } else {

                        let sqlCompteur = '';
                        sqlCompteur = data.nb_brs === 1
                            ? `INSERT INTO brs_compteur (nb, id_lot, id_attr) VALUES (?,?,?)`
                            : `UPDATE brs_compteur SET nb = ? WHERE id_lot = ? AND id_attr = ?`;

                        let sqlValuesCompteur = [data.nb_brs, data.id_lot, data.id_attributaire]

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
                    }
                });
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

module.exports = router;