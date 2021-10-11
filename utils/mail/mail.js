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

  sendMail: function (data, attachment, callback) {

    // fs.readFile(path.join(__dirname, '/templateSollicitation.html'), { encoding: 'utf-8' }, function (err, dataFile) {
    fs.readFile(path.join(__dirname, '/' + data.templateFileName), { encoding: 'utf-8' }, function (err, dataFile) {

      if (err) {
        console.log(err);
        process.exit(1);
      } else {

        let variables = {
          mail_of: data.mail_src,
          titulaire: data.libelle,
          user: data.contact,
          id_sol: data.id,
        }

        Object.entries(variables).forEach(([k, v]) => dataFile = dataFile.replace('{{ ' + k + ' }}', v))

        // let attachments = [{
        //   filename: 'banniereSollicitation.png',
        //   path: path.join(__dirname, '/banniereSollicitation.png'),
        //   cid: 'banniere',
        // }];
        let attachments = [{
          filename: data.banniereFileName,
          path: path.join(__dirname, '/' + data.banniereFileName),
          cid: 'banniere',
        }];

        if (Object.keys(attachment).length > 0) attachments.push(attachment)

        console.log('------------------------------------------')
        console.log('SEND MAIL :')
        console.log('BCC :', data.mail_destinataire)
        console.log('Destinataire :', data.bcc)

        let bcc_DEV = data.bcc ? 'nicarap@hotmail.com' : '';
        let mail_destinataire_DEV = 'raphael.lebon@pole-emploi.fr';

        return transporter.sendMail({
          to: mail_destinataire_DEV,
          bcc: bcc_DEV,
          attachments: attachments,
          html: dataFile,
        }, callback)

      }
    });

  }
}