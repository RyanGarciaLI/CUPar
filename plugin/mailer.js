let nodemailer = require('nodemailer'),
  config = require('../config').config;

let transporter = nodemailer.createTransport({
  service: config.mail_server, 
  auth: {
    user: config.mail_account,
    pass: config.mail_pwd
  }
});

exports.send = function(mailOptions) {
  mailOptions = mailOptions ? mailOptions : {
    from: '"CU Par" <'+ config.mail_account +'>', // login user must equel to this user
    to: '1155107874@link.cuhk.edu.hk', 
    subject: 'Test',
    text: 'this is a test email', 
    html: '<b>The main content of the mail. You have successfully logged in to Nodejs.</b>' 
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
}