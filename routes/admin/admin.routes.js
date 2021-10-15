const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool_admin = require('./admin.config');
const pool = require('../../config/db.config');

router.put('/updateTable', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sql = `select c.id, atrc.id_attributaire, c.n_Article, GROUP_CONCAT(CONCAT(a.commune,':', a.id) SEPARATOR ',') adresses from t_catalogue c
    inner join t_adr_catalogue adrc ON adrc.id_elmt = c.id 
    inner join t_attributaire_adresse atrc ON atrc.id = adrc.id_adr_attr
    inner join t_adresse a ON a.id = atrc.id_adresse
    where c.lot = 13 OR c.lot = 15 OR c.lot = 16 GROUP BY c.id`;

    pool_admin.getConnection(function (error, conn) {
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
            } else {

                const jsonResult = JSON.parse(JSON.stringify(result));
                console.log(jsonResult)

                let sqlInter = `INSERT INTO catalogue_attributaire_commune (id_cata_attr, id_commune)
                    (SELECT id, ? FROM catalogue_attributaire WHERE id_attributaire = ? AND id_cata = ?) `;

                Object.values(jsonResult).map((v) => {
                    
                    let arrayAdresse = []
                    if(v.adresses.includes(',')){
                        arrayAdresse = v.adresses.split(',')
                    }else arrayAdresse = [v.adresses]

                    arrayAdresse.map((a) => {

                        let array = a.split(':')
                        let commune = array[0]
                        let adresse = array[1]
    
                        pool.getConnection(function (error, conn) {
                            if (error) throw err;
                        
                            conn.query(sqlInter, [commune, v.id_attributaire, v.id], (err, result2) => {
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
                                    const jsonResult2 = JSON.parse(JSON.stringify(result2));
                                    console.log(jsonResult2)
    
                                    let sqlLast = `INSERT INTO catalogue_attributaire_commune_adresse 
                                        (id_catalogue_attributaire_commune, id_adresse) VALUES(?,?)`;
    
                                    pool.getConnection(function (error, conn) {
                                        if (error) throw err;
                                    
                                        conn.query(sqlLast, [jsonResult2.insertId, adresse], (err, result3) => {
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
                                }
                            });
                        });

                    })

                })

                // let io = request.app.get("io");
                // io.emit("updateAdresse", request.body);
                // response.status(200).json(result);
            }
        });
    });

})


module.exports = router;