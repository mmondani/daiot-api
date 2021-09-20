const nodemailer = require('nodemailer');

module.exports.nodeMailer = function (toEmail, subject, msg) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
      user: 'user@mygmail.com',
      pass: 'mypasswdmail'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let mailOptions = {
    from: 'Empresa',
    to: toEmail,
    subject: subject, 
    text: 'Solicitud de blanqueo de password.', 
    html: msg 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });
}