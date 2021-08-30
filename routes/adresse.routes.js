const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/find', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sqlValues = [];
    let sql = `SELECT a.id, a.adresse
        FROM adresse a 
        LEFT JOIN adresse_catalogue ac ON ac.id_adresse = a.id
        WHERE ac.id_cata = ?`;
    sqlValues.push(request.query.id);

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        conn.query(sql, sqlValues, (err, result) => {
            conn.release();

            if (err) {
                console.log(err.sqlMessage)
                return response.status(500).json({
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


module.exports = router;