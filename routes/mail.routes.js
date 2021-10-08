require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const mail = require('../utils/mail');

// const transporter =
//     nodemailer.createTransport({
//         host: process.env.SMTP,
//         port: 25,
//         secure: false,
//         tls: { rejectUnauthorized: false },
//     }, {
//         from: 'no-reply@reuniondpr.fr',
//         subject: 'AFC : Sollicitation',
//     });

// //verifying the connection configuration
// transporter.verify(function (error, success) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("Server is ready to take our messages!");
//     }
// });

router.get('/sendSollicitation', passport.authenticate('jwt', { session: false }), (request, response) => {
    const data = request.query
    console.log(data)

    mail.sendSollicitation('nicarap@hotmail.com', 'sollicitation', 'formation', (err, data) => {
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