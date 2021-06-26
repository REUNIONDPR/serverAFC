const express = require('express');
const router = express.Router();
const connection = require('../config/db.config');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//profile
router.get('/profile', passport.authenticate('jwt', { session:  false }),function (req, res) {
    res.send(req.user);
})

router.post('/logUser', function(req, res, next){
    // const user = req.body;
    passport.authenticate('local', (err, user, info) => {
        
        if(err){
            return res.status(500).json({
                flash: err.message,
                sql: err.sql,
            });
        }
        if(!user) return res.status(400).json({flash: info.message});
        req.user = user
        console.log('-------------- auth');
        console.log(user)
        console.log('-------------- auth');
        const token = jwt.sign(JSON.stringify(user), 'coucou');
        return res.json({user, token, flash: 'Utilisateur Connecté '});
    })(req, res);
})

module.exports = router;