const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/getAll', passport.authenticate('jwt', { session:  false }), (request, response) => {

    let sql = `SELECT id, lot, n_Article,
    intitule_form_marche, 
    nb_heure_ent, 
    nb_heure_appui,
    nb_heure_soutien,
    prixTrancheA,
    prixTrancheB FROM catalogue`;

    pool.getConnection(function(error, conn){
        if(error) throw err;
        conn.query(sql, (err, result) => {
            conn.release();
            
            if(err){
                console.log(err.sqlMessage)
                return  resp.status(500).json({
                        err: "true", 
                        error: err.message,
                        errno: err.errno,
                        sql: err.sql,
                        });
            }
            else{
                response.status(200).json(result);
            }
        
        });
    });

})

module.exports = router;