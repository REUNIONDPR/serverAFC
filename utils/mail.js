const nodemailer = require('nodemailer');
const passport = require('passport');
const fs = require('fs');
const path = require('path');

const transporter =
  nodemailer.createTransport({
    host: process.env.SMTP,
    port: 25,
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

module.exports = {
    /*
        Modules pour l'envoi des mails
    */

    sendSollicitation: function (mail_source, sollicitation, formation, callback) {

        console.log(path.join(__dirname, '/mail'))

        fs.readFile(path.join(__dirname, '/mail/templateSollicitation.html'), { encoding: 'utf-8' }, function (err, dataFile) {
            if (err) {
                console.log(err);
                process.exit(1);
            } else {
                
                let variables = {
                    mail_of: 'nicarap@hotmail.com',
                    titulaire: 'TITULAIRE',
                    user: 'UTILISATEUR',
                    id_sol: 'ID_SOL',
                }
                Object.entries(variables).forEach(([k,v]) => dataFile = dataFile.replace('{{ '+k+' }}', v) )

                return transporter.sendMail({
                    to: 'raphael.lebon@pole-emploi.fr',
                    attachments:[{
                      filename:'mailingSOL.png',
                      path:path.join(__dirname, '/mail/mailingSOL.png'),
                      cid:'banniere',
                    }],
                    html: dataFile,
                }, callback)
            }
        });
        



    }


}