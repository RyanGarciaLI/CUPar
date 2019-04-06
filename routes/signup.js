//************************************
// Here is a router for sign-up page
// It deals with get and post request 
// from sign-up page
// Author: Ryan Garcia Yuxin LI
// Date: 06/04/2019
//************************************
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var User = require('../controller/user');
var md5 = require('../plugin/encryption');
var send = require('../plugin/mailer');
var config = require('../config');


// display page
router.get('/', function(req, res){
    //res.sendFile(path.resolve( __dirname , "..","./public/sign-up.html")); 
    res.render('sign-up', {
        layout : null,
        //reminder : "Send_auth_code",
    });
});

// receive form from users
router.post('/', urlencodedParser, function(req, res, next){        
    // get info
    var username = req.body.username || '', // make sure username is string
        password = req.body.password || ' ', // make sure password is string
        passwordRP = req.body.passwordRP || '', // make sure passwordRP is string 
        sid = req.body.sid || 0000000000, // make sure sid is number
        code = req.body.code;  // make sure code is number 
    
    // verify user's information
    if( sid.length !== 10 || sid[0] != 1 || sid[1] != 1 || sid[2] != 5 || sid[3] != 5){
        return res.render('sign-up', {
            layout : null,
            warning :"SID is invalid!",
            // NotSubmit : true,
        });
    }                

    if( password.length < 6 || password.length > 20 ){
        return res.render('sign-up', {
            layout : null,
            warning :"The length of password must be in the range from 6 to 20, both inclusive!",
            // NotSubmit : true
        });
    }               
    
    if( username.length === 0 || username.length > 20 ){
        return res.render('sign-up', {
            layout : null,
            warning :"The length of name must be nonempty and no more than 20 !",
            // NotSubmit : true
        });
    }
    
    if( password != passwordRP ){
        return res.render('sign-up', {
            layout : null,
            warning : "Twice inputs are different, please confirm your password!",
            // NotSubmit : true
        });
    }      
    console.log("I am here");
    // find user from db
    User.checkUserInfo(sid, function(results){
        if( results.length > 0 ){ // has registed
            if( results[0].state === 1){
                res.render('sign-up',{
                    layout : null,
                    warning : "You have registed, please log in"
                });
            }
            else if( results[0].code != code ){ // wrong code
                res.render('sign-up', {
                    layout : null,
                    warning : "Enter wrong code, check or send it again"
                });
            }
            else{ // correct code, sign up, update revelant info
                password = md5(password);
                User.updatePwdNameState(sid, username, password, function(result){
                    let userPassport = { name: username, sid: sid, pwd: password };
                    res.cookie("islogin", userPassport, {maxAge: 2 * 3600 * 1000});
                    res.redirect('/');
                });
            }
        }
    });
               
});

router.post('/email', function(req, res){
    let code = createSixNum();
    User.checkUserInfo(req.body.sid, function(result){
        if( result.length > 0 ){ // has registed already
            if( result[0].state === 1 ){ // is active
                return res.send("002");
            }
            else{ // is unactive
                // send email
                send( writeEmail(req.body.email, req.body.username, code), function(err){
                    if (err){
                        return res.send('000');
                    }
                    res.send('001');
                });
                // update db
                User.updateCode( req.body.sid, code);
            } 
        }
        else{   // has not registed yet
            // send email
            send( writeEmail(req.body.email, req.body.username, code), function(err){
                if(err){
                    return res.send('000');
                }
                res.send('001');
            });
            //  record user info
            User.insertUser(req.body.sid, 'anoymous' , 123456 , code);
        }
    })
});

// create random code
var createSixNum = function(){
    let num = "";
    for( let i = 0; i < 6; i++){
        num += Math.floor( Math.random()*10);
    }
    return num;
};

// write email
var writeEmail = function(email, name, code){
    return mailOptions = {
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
};

module.exports = router;