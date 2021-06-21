const express = require('express');
const router = express.Router();
const connection = require('../config/db.config');
const bcrypt=require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//profile
router.get('/profile', passport.authenticate('jwt', { session:  false }),function (req, res) {
    console.log(req.user);
    res.send(req.user);
})


module.exports = router;