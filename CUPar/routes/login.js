/**
 *  /router/login.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Ryan Yuxin LI <lyxnb2333@gmail.com>
 *  @version: 3.0
 *  @since 2019-03-19
 *  @last updated: 2019-04-21
 */
`
 A router handles the request of login, sending authentication email and reset password.
 The specific urls and revelant request the router can handle is following:
           URL          |       Request
    --------------------|-------------------
    /login              |   POST, GET
    /login/reset        |   POST, GET
    /login/reset/email  |   POST
    /login/reset/pwd    |   POST, GET
    ----------------------------------------
 The login subrouter is able to verify the input from the form comparing the data in the
 db and offer valid authentication for access. The reset subrouter is able to send reset
 email to the user and update the password in the database.
 `

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// var User = require('../models/user');
var md5 = require('../plugin/encryption');
var mailer = require('../plugin/mailer');
var DB = require('../plugin/database')

// the subrouter for login
router.post( '/', urlencodedParser, function(req, res){
    console.log('I am here')
    console.log(req.body)
    let sid = req.body.sid || 1234;
    let password = req.body.password;

    // verify user's information
    if( sid.length !== 10 || sid[0] != 1 || sid[1] != 1 || sid[2] != 5 || sid[3] != 5){
        return res.render('login.hbs',{
            layout: null,
            warning: "Your student id is invalid, please check it again"
        });
    }
    // the front-end has verified the length, double check here, prevent hacking
    if( password.length < 6 || password.length > 20 ){
        return res.render('login.hbs',{
            layout: null,
            warning : "password can't be less than 6 or larger than 20!"
          });
    }

    // procedure of login
    password = md5(password);   // encrypt the password
    console.log('I go here')
    // User.selectUserInfo( sid, function( results ){ 
    DB.verify_user_identity(sid, password, function(results){
        if( results.length > 0 ){   // find the user out
            if(results[0].state == 1){  // the user is active
                // set passport as the authentication to access the website
                let passport = { id : results[0].id, name: results[0].name, sid: sid};
                res.cookie('islogin', passport, { maxAge: 2 * 3600 * 1000});
                console.log('Verified')
                res.redirect('/');
            }
            else{
                res.render('login.hbs', {
                    layout: null,
                    warning: "Account hasn't been activated, please return to sign-up page"
                });
            }
        }
        else{
            res.render('login.hbs', {
                layout: null,
                error: "Password or SID is wrong. Try again~"
            });
        }
    });
});

router.get('/', function(req, res){
    res.render('login.hbs',{
        layout: null,
        info : 'Please enter you student ID and password'
    });
});


// the subroute for reset page
router.get('/reset', function(req, res){
    res.render('reset.hbs', {
        layout:null,
        info : 'Please enter you student ID'
    });
});

router.post('/reset', urlencodedParser, function(req, res){
    let sid = req.body.sid;
    let code = req.body.code;
    // User.selectUserInfo(sid, function(result){
    DB.select_user_data(sid, function(result){
        if( result.length === 0 ){ // have not registed yet
            res.render('reset.hbs', {
                layout : null,
                warning : 'You have not registed yet, please sign up'
            });
        } else{ // have registed already
            if( result[0].state === 1 ){ // active
                if( result[0].SID == sid && result[0].code == code ){   // verified by email
                    // continue to reset pwd
                    req.session.sid = {sid : sid }; // save identity
                    res.redirect('/login/reset/pwd');
                }
                else{ // input is wrong
                    res.render('reset.hbs', {
                        layout : null,
                        error : 'Your sid or code is wrong, please check again'
                    });
                }
            }
            else{ // unactive
                res.render('reset.hbs', {
                    layout : null,
                    message : 'Please active your account first in sign-up page',
                    notice : 'Check new code in your cuhk email'
                });
            }
        }
    });
});


// the subrouter for sending varificaiton email
router.post( '/reset/email', urlencodedParser, function(req, res){
    let sid = req.body.sid;
    let email = req.body.email;
    let code = createSixNum();  // generate verification code

    DB.select_user_data(req.body.sid, function(result){
        if( result.length === 0 ){  // have not registed yet
            res.render('reset.hbs', {
                layout : null,
                warning : 'You have not registed yet, please sign up'
            });
        }
        else{
            // active
            if( result[0].state === 1 ){
                // send email
                mailer.send( mailer.resetEmail(email, result[0].name, code), function(err){
                    if(err){
                        return res.send('000'); // unsuccessfully
                    }

                    // User.updateCode(sid, code, function(err){
                    let data_set = {code:code};
                    DB.update_user(sid, data_set, callback=function(err){
                        if(err){
                            console.error('----Some error(s) happened when updating \
                                code of active user: /reset/email----');
                            console.error(err);
                        }
                        res.send('001');    // successfully
                    });
                });
            }
            else{ // unactive
                // send authenticaion email
                mailer.send( mailer.authEmail(email, result[0].name, code), function(err){
                    if(err){
                        return res.send('000'); // unsuccessfully
                    }
                    let data_set = {code:code};
                    DB.update_user(sid, data_set, callback=function(err){
                        if(err){
                            console.error('----Some error(s) happened when updating \
                                code of unactivate user: /reset/email----');
                            console.error(err);
                        }
                        res.render('reset.hbs', {
                            lyaout: null,
                            warning : "Account hasn't been activated, please return to sign-up page"
                        });
                    });
                });
            }
        }
    });
});


// the subrouter for reset password
router.get('/reset/pwd', function(req, res){
    if( ! req.session.sid ){   // refuse invalid access
        return res.redirect('/login');
    }
    res.render('resetPwd.hbs', {
        layout:null,
        info : 'Please enter your new password'
    });
});

router.post('/reset/pwd', function(req, res){
    let sid = req.session.sid.sid;
    res.session = null ; // clean sesssion
    let password = req.body.password;
    let passwordRP = req.body.passwordRP;

    if( password !== passwordRP ){ // passwords aren't matched
        return res.render('resetPwd.hbs', {
            layout : null,
            error : 'Please confirm your password.'
        });
    }

    password = md5(password); // encrypt the password
    // find the user
    DB.select_user_data(sid, function(result){
        if(result.length === 0 ){
            return console.log(" Can't find the user, error");
        }
        let data_set = {password:password};
        DB.update_user(sid, data_set, callback=function(err){
            if(err){
                console.error('----Some error(s) happened while udpating user pwd')
            }
            res.render('login_after_reset_pwd.hbs', {
                layout: null,
                message: 'Reset password successfully, please log in'
            });
        });
    } );
});


// generate six-digit random code
var createSixNum = function(){
    let num = "";
    for( let i = 0; i < 6; i++){
        num += Math.floor( Math.random()*10);
    }
    return num;
};

module.exports = router;
