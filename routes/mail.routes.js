require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const passport = require('passport');

//a tester
const transporter =
    nodemailer.createTransport({
        // host: process.env.SMTP,
        // port: process.env.SMTP_PORT,
        port:443,
        secure: false,
        tls: { rejectUnauthorized: false },
    }, {
        from: 'no-reply@reuniondpr.fr',
        subject: 'AFC : Sollicitation',
    });

//verifying the connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages!");
    }
});

router.post('/sendSollicitationOF', passport.authenticate('jwt', { session: false }), (request, response) => {
    const data = request.body

    transporter.sendMail({
        to: 'raphael.lebon@pole-emploi.fr',
        html: `<h3>Bonjour, une nouvelle carte a été créée</h3>`,
    }, (err, data) => {
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
})

module.exports = router;