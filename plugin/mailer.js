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

let send = function (mailOptions, callback) {
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

module.exports = send;