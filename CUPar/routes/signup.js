/**
 *  /router/signup.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Ryan Yuxin LI <lyxnb2333@gmail.com>
 *  @version: 3.0
 *  @since 2019-03-19
 *  @last updated: 2019-04-21
 *  @syntax standard: ES6
 */
`
 A router handles the request of signup and sending authentication email.
 The specific urls and revelant request the router can handle is following:
           URL          |       Request
    --------------------|-------------------
    /signup             |   POST, GET
    /signup/email       |   POST, GET
    ----------------------------------------
 The module is able to verify the input from the form and record the correct
 information of the user into the database. The user identity shall be verifed
 by sending authentication email in the signup procedure.
`

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var User = require('../models/user');
var md5 = require('../plugin/encryption');
var mailer = require('../plugin/mailer');


// the subrouter for signup
router.get('/', function(req, res){
    res.render('sign-up.hbs', {
        layout : null,
        info : "Click and send code to your email",
    });
});

router.post('/', urlencodedParser, function(req, res, next){        
    var username = req.body.username || '', // make sure username is string
        password = req.body.password,
        passwordRP = req.body.passwordRP,
        sid = req.body.sid,
        code = req.body.code;

    // verify user's information
    if( sid.length !== 10 || sid[0] != 1 || sid[1] != 1 || sid[2] != 5 || sid[3] != 5){
        return res.render('sign-up.hbs', {
            layout : null,
            error :"SID is invalid!",
        });
    }

    if( password.length < 6 || password.length > 20 ){
        return res.render('sign-up.hbs', {
            layout : null,
            error :"The length of password must be in the range from 6 to 20, both inclusive!",
        });
    }

    if( username.length === 0 || username.length > 20 ){
        return res.render('sign-up.hbs', {
            layout : null,
            error :"The length of name must be nonempty and no more than 20 !",
        });
    }

    if( password != passwordRP ){
        return res.render('sign-up.hbs', {
            layout : null,
            error : "Two passwords are not the same!",
        });
    }      

    // find user from db
    User.selectUserInfo(sid, function(results){
        if( results.length > 0 ){  // has registed
            if( results[0].state === 1){
                res.render('sign-up.hbs',{
                    layout : null,
                    warning : "You have registed, please log in"
                });
            }
            else if( results[0].code != code ){ // wrong code
                res.render('sign-up.hbs', {
                    layout : null,
                    error : "Wrong code, check or send it again"
                });
            }
            else{ // correct code, sign up, update revelant info
                password = md5(password);
                User.updatePwdNameState(sid, username, password, function(result){
                    // set passport as the authentication to access the website
                    let userPassport = { id : results[0].id, name: username, sid: sid, pwd: password };
                    res.cookie("islogin", userPassport, {maxAge: 2 * 3600 * 1000});
                    res.redirect('/');
                });
            }
        }
    });
               
});

// the subrouter for sending authentication email
router.post('/email', function(req, res){
    let code = createSixNum();  // generate code
    User.selectUserInfo(req.body.sid, function(result){
        if( result.length > 0 ){ // has registed already
            if( result[0].state === 1 ){ // is active
                return res.send("002");
            }
            else{ // is unactive
                // send email
                mailer.send( mailer.authEmail(req.body.email, req.body.username, code), function(err){
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
            mailer.send( mailer.authEmail(req.body.email, req.body.username, code), function(err){
                if(err){
                    return res.send('000'); // send unsuccessfully
                }
                res.send('001');    // send successfully
            });
            //  record user info as an unactive account
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

module.exports = router;