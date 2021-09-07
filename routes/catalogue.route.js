const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/findAll', passport.authenticate('jwt', { session: false }), (request, response) => {
    // Modifier catalogue_attributaire_adresse
    let sql = `SELECT c.id, c.id_lot, c.id_lot lot, c.n_Article, 
        c.intitule_form_marche, c.intitule_form_base_article, c_of.priorite, of.libelle of, c_of.id id_of_cata,
        c.formacode, c.niveau_form, c.objectif_form, 
        c.nb_heure_socle, c.nb_heure_ent, c.nb_heure_appui, c.nb_heure_soutien, c.prixTrancheA, c.prixTrancheB,
        GROUP_CONCAT(CONCAT(c_of_adr.id_adresse,':',a.adresse, ' - ', v_adresse.libelle) SEPARATOR '|')  as adresse,
        GROUP_CONCAT(CONCAT(v.id, ':', v.libelle) SEPARATOR ' | ') commune
    FROM catalogue c 
        LEFT JOIN lot l ON l.id = c.id_lot
        LEFT JOIN catalogue_attributaire c_of ON c_of.id_cata = c.id
        LEFT JOIN catalogue_attributaire_commune catc ON catc.id_cata_attr = c_of.id
        LEFT JOIN ville v ON v.id = catc.id_commune
        LEFT JOIN catalogue_attributaire_adresse c_of_adr ON c_of_adr.id_catalogue_attributaire = c_of.id 
    
        LEFT JOIN adresse a ON a.id = c_of_adr.id_adresse 
        LEFT JOIN attributaire of ON of.id = c_of.id_attributaire
        LEFT JOIN ville v_adresse ON v_adresse.id = a.commune 
    
    GROUP BY l.id, c.id, c_of.id ORDER BY l.id, c.id, c_of.priorite `;

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        conn.query(sql, (err, result) => {
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

router.put('/update', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sql = `UPDATE catalogue SET 
        n_Article = ?, 
        id_lot = ?,
        intitule_form_marche = ?, 
        intitule_form_base_article = ?,
        nb_heure_ent = ?, 
        nb_heure_appui = ?, 
        nb_heure_soutien = ?, 
        prixTrancheA = ?, prixTrancheB = ? WHERE id = ?`;

    const data = request.body;

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        conn.query(sql, [data.n_Article,
        data.id_lot,
        data.intitule_form_marche,
        data.intitule_form_base_article,
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
            } else {
                let io = request.app.get("io");
                io.emit("updateCatalogue", request.body);
                response.status(200).json(result);
            }
        });
    });

})

router.put('/create', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sqlValues = [];
    let data = request.body;
    let fieds = ['n_Article', 'id_lot', 'intitule_form_marche', 'intitule_form_base_article',
        'nb_heure_ent', 'nb_heure_appui', 'nb_heure_soutien', 'prixTrancheA', 'prixTrancheB',
        'niveau_form', 'objectif_form']

    sqlValues = fieds.map((v) => data[v])
    let field = '(' + fieds.map((v) => v).join(',') + ')';
    let value = '(' + fieds.map((v) => '?').join(',') + ')';

    let sql = `INSERT INTO catalogue ${field} VALUES ${value}`;

    console.log(sql, sqlValues)
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
                let io = request.app.get("io");
                io.emit("updateCatalogue", request.body);
                response.status(200).json(result);
            }
        });
    });

})

router.put('/delete', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sql = 'DELETE FROM catalogue WHERE id = ?';

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        const data = request.body;
        conn.query(sql, [request.body.id], (err, result) => {
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
                let io = request.app.get("io");
                io.emit("updateCatalogue", request.body);
                response.status(200).json(result);
            }
        });
    });
})

router.get('/of', passport.authenticate('jwt', { session: false }), (request, response) => {

    const data = request.query;
    let sql = `SELECT cat.id, cat.priorite, of.libelle, of.id id_attr, c.id_commune id_commune, 
                GROUP_CONCAT(CONCAT(v.id, ':', v.libelle) SEPARATOR ' | ') commune
                FROM catalogue_attributaire cat
                LEFT JOIN catalogue_attributaire_commune c ON c.id_cata_attr = cat.id
                LEFT JOIN ville v ON v.id = c.id_commune
                LEFT JOIN attributaire of ON of.id = cat.id_attributaire
                WHERE cat.id_cata = ? GROUP BY cat.id ORDER BY cat.priorite`;
    let sqlValues = [];
    sqlValues.push(data.id_cata)

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
                let io = request.app.get("io");
                io.emit("updateCatalogue", request.body);
                response.status(200).json(result);
            }
        });
    });
})

router.put('/delete_of', passport.authenticate('jwt', { session: false }), (request, response) => {

    let data = request.body;
    let sqlOF = `DELETE FROM catalogue_attributaire WHERE id = ?`;
    console.log(data.id)
    pool.getConnection(function (error, conn) {
        if (error) throw err;
        conn.query(sqlOF, [data.id], (err, result) => {
            conn.release();

            if (err) {
                console.log(err.sqlMessage)
                return response.status(500).json({
                    err: 'true',
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            } else response.status(200).json(result);
        });
    });

})

router.put('/add_of', passport.authenticate('jwt', { session: false }), (request, response) => {

    let data = request.body;
    let sql = `INSERT INTO catalogue_attributaire (id_cata, id_attributaire, priorite) VALUES (?,?,?)`;

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        conn.query(sql, [data.id_cata, data.id_attr, data.priorite], (err, result) => {
            conn.release();
            if (err) {
                console.log(err.sqlMessage)
                return response.status(500).json({
                    err: 'true',
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            } else response.status(200).json(result);
        });
    });

})

router.put('/update_of', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sql = `UPDATE catalogue_attributaire SET priorite = ? WHERE id = ?`;

    const data = request.body;

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        conn.query(sql, [data.priorite, data.id], (err, result) => {
            conn.release();

            if (err) {
                console.log(err.sqlMessage)
                return response.status(500).json({
                    err: 'true',
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            } else response.status(200).json(result);
        });
    });

})

router.put('/add_commune_of', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sql = `INSERT INTO catalogue_attributaire_commune (id_cata_attr, id_commune) VALUES (?,?)`;

    const data = request.body;

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        conn.query(sql, [data.id_of_cata, data.id_commune], (err, result) => {
            conn.release();

            if (err) {
                console.log(err.sqlMessage)
                return response.status(500).json({
                    err: 'true',
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            } else response.status(200).json(result);
        });
    });

})
router.put('/delete_commune_of', passport.authenticate('jwt', { session: false }), (request, response) => {

    let sql = `DELETE FROM catalogue_attributaire_commune WHERE id_cata_attr = ? AND id_commune = ?`;

    const data = request.body;

    pool.getConnection(function (error, conn) {
        if (error) throw err;
        conn.query(sql, [data.id_of_cata, data.id_commune], (err, result) => {
            conn.release();

            if (err) {
                console.log(err.sqlMessage)
                return response.status(500).json({
                    err: 'true',
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            } else response.status(200).json(result);
        });
    });

})

module.exports = router;