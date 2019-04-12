//************************************
// Here is a plugin for sending email  
// via gmail account, use send(mail) to
// the user with specific configuration
// insert, update and delete;
// Author: Ryan Garcia Yuxin LI
// Date: 21/03/2019
//************************************
'use strict';
let nodemailer = require('nodemailer');
let config = require('../config').config;

let transporter = nodemailer.createTransport({
    service: config.mail_server, 
    auth: {
        user: config.mail_account,
        pass: config.mail_pwd
    }
});

exports.send = function (mailOptions, callback) {
    mailOptions = mailOptions || {
        from: '"CU Par" <' + config.mail_account + '>', // login user must equel to this user
        to: '1155107874@link.cuhk.edu.hk',
        subject: 'Test',
        text: 'this is a test email',
        html: '<b>The main content of the mail. You have successfully logged in to Nodejs.</b>' 
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            callback(error);
            return console.log(error);
        }
        callback();
        console.log('Message sent: ' + info.response);
    });
};

exports.resetEmail = function( email, name, code){
    return {
        from: '"CU Par" <'+ config.mail_account +'>', // login user must equel to this user
        to: email,
        subject: "The CAPTCHA for your to reset password",
html: `
<pre style="font-family:calibri;font-size:17px">
Hi ` + name + ` : 
    
    Here is your CAPTCHA Code for reset your password: <b>` + code + `</b> , please enter it into form in 10 minitues :)
    Here is CU Par, a powful integral platform for all CUHK Undergraduate students! Start to look for your partners now!
    
Best wishes
CU Par Corporation Limited
</pre> 
`
    };
};

exports.authEmail = function( email, name, code){
    return {
        from: '"CU Par" <'+ config.mail_account +'>', // login user must equel to this user
        to: email,
        subject: "The CAPTCHA for your to sign up CU Par",
html: `
<pre style="font-family:calibri;font-size:17px">
Hi ` + name + ` : 
    
    Welcome! Here is your CAPTCHA Code for authentication: <b>` + code + `</b> , please enter it into form in 10 minitues :)
    Thank you for your registration. Here is CU Par, a powful integral platform for all CUHK Undergraduate students! Start to look for your partners now!
    

Best wishes
CU Par Corporation Limited
</pre> 
`
    };
}