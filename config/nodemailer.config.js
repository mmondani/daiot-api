const nodemailer = require('nodemailer');

module.exports.nodeMailer = function (toEmail, subject, msg) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
      user: 'server.mcastello@gmail.com',
      pass: 'ch0c0lat3'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let mailOptions = {
    from: 'mcastello ingenieria',
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