/**
 *  /plugin/mailer.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Ryan Yuxin LI <lyxnb2333@gmail.com>
 *  @version: 2.0
 *  @since 2019-04-02
 *  @last updated: 2019-04-21
 */
`
The mailer plugin is able to send email. It requires correct configuration of a mailer
account. It also contains two template email for authenticaiton and reset respectively.
If there is no specific email, the mailer shall send default email to the administrator
`

var nodemailer = require('nodemailer');
var config = require('../config').config;

// configuration of mailer
var transporter = nodemailer.createTransport({
    service: config.mail_server, 
    auth: {
        user: config.mail_account,
        pass: config.mail_pwd
    }
});

// function of sending email, if not assign email options, it shall send to 1155107874@link.cuhk.edu.hk
exports.send = function (mailOptions, callback) {
    mailOptions = mailOptions || {  // default email
        from: '"CU Par" <' + config.mail_account + '>',
        to: '1155107874@link.cuhk.edu.hk',
        subject: 'Test',
        text: 'this is a test email',
        html: '<b>The main content of the mail. You have successfully logged in to Nodejs.</b>' 
    };

    transporter.sendMail(mailOptions, function (error, info){
        if (error) {
            callback(error);
            return console.log(error);
        }
        callback();
        console.log('Message sent: ' + info.response);
    });
};

// the template email for reset password
exports.resetEmail = function( email, name, code){
    return {
        from: '"CU Par" <'+ config.mail_account +'>',
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

// the template email for authentication
exports.authEmail = function( email, name, code){
    return {
        from: '"CU Par" <'+ config.mail_account +'>',
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
};