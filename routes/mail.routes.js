require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const passport = require('passport');
const fs = require('fs');
const util = require('util');
const path = require('path');

const transporter =
    nodemailer.createTransport({
        host: process.env.SMTP,
        port:25,
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

router.get('/sendSollicitation', passport.authenticate('jwt', { session: false }), (request, response) => {
    const data = request.query

    let templateSollicitation;

    fs.readFile(path.join(__dirname,'/mail/templateSollicitation.html'), {encoding:'utf-8'}, function(err,data){
        if(err){
            console.log(err);
            process.exit(1);
        }else{
            
            data.replace('{{ mail_of }}', 'nicarap@hotmail.com');
            transporter.sendMail({
        to: 'raphael.lebon@pole-emploi.fr',
        html: data,
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
        }
    });


    

    // transporter.sendMail({
    //     to: 'raphael.lebon@pole-emploi.fr',
    //     html: data,
    // }, (err, data) => {
    //     if (err) {
    //         console.log(err)
    //         response.status(500).json({
    //             status: 'fail'
    //         })
    //     } else {
    //         response.status(201).json({
    //             status: 'success'
    //         })
    //     }
    // })


})

module.exports = router;