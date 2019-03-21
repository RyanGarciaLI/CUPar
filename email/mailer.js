var nodemailer = require('nodemailer');

var config = {
        service: 'gmail',
        auth: {
            user: 'ryangarcia2333@gmail.com',
            pass: 'lyxnb2333'
        }
    };
    
var transporter = nodemailer.createTransport(config);

var mailer = function( mail ){
    transporter.sendMail(mail, function(error, info){
        if(error) return console.log(error);
        console.log('mail sent:', info.response);
    });
}

module.exports = mailer;

