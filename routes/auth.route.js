const express = require('express');
const router = express.Router();
const connection = require('../config/db.config');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//profile
router.get('/profile', passport.authenticate('jwt', { session: false }), function (req, res) {
    res.send(req.user);
})

// Si cookie xtidc existe pas, connection manuelle sans mdp ?
router.get('/search', (request, response) => {

    let sql = `SELECT * FROM user WHERE id = ? `;
    //   let io = request.app.get("io");
    pool.getConnection(function (error, conn) {
        if (error) throw err; // not connected!

        conn.query(sql, request.query.id, (err, result) => {
            // When done with the connection, release it.
            conn.release();

            // Handle error after the release.
            if (err) {
                console.log(err.sqlMessage)
                return response.status(500).json({
                    err: "true",
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                });
            } else response.status(200).json(result)

        });
    });

});

router.post('/logUser', function (req, res, next) {
    // const user = req.body;
    passport.authenticate('local', (err, user, info) => {

        if (err) {
            return res.status(500).json({
                flash: err.message,
                sql: err.sql,
            });
        }
        if (!user) return res.status(400).json({ flash: info.message });
        req.user = user
        const token = jwt.sign(JSON.stringify(user), 'appli_AFC');
        return res.json({ user, token, flash: 'Utilisateur Connecté ' });
    })(req, res);
})

module.exports = router;