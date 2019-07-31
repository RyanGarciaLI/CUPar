/**
 *  /router/logout.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Ryan Yuxin LI <lyxnb2333@gmail.com>
 *  @version: 1.5
 *  @since 2019-03-20
 *  @last updated: 2019-04-21
 */

var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded( {extended: false});
var User = require('../models/user');
var mailer = require('../plugin/mailer');
var md5 = require('../plugin/encryption');

router.get('/', function(req, res){
    if (!req.session.passport) {
        return res.redirect('/login');
    }
    res.render('deleteAccount.hbs', {
        layout: null,
        info: 'Please confirm your student ID and password'
    });
});

router.post('/email', urlencodedParser, function(req, res){
    let sidInput = req.body.sid;
    let sidLogin = req.session.passport.sid;
    let email = req.body.email;
    let code = createSixNum();

    if ( sidInput !== sidLogin ){
        return res.render('deleteAccount.hbs',{
            layout: null,
            error: "You cannot delete other persons' accounts!"
        });
    }

    User.selectUserInfo(sidInput, function( results){
        if( results.length > 0 ) {   // find the user
            mailer.send( mailer.delEmail(email, results[0].name, code), function(err){
                if (err){
                    return res.send('000'); // unsuccessfully
                }

                User.updateCode(sid, code, function(err){
                    res.send('001');    // successfully
                });
            });
        }
        res.render('deleteAccount.hbs',{
            layout: null,
            warning: 'We cannot find you out. Please sign up'
            
        });
    });
});

router.post('/', urlencodedParser, function(req, res){
    let sidInput = req.body.sid;
    let sidLogin = req.session.passport.sid;
    let password = req.body.password;
    let code = req.body.code;

    if (sidInput !== sidLogin ){
        return res.render("deleteAccount.hbs", {
            layout: null,
            warning: "You cannont delete other person' accounts!"
        });
    }

    User.selectUserInfo( sidInput, function(results){
        if (results.length > 0 ){
            password = md5(password);
            if (password !== results[0].password){
                return res.render("deleteAccount.hbs",{
                    layout: null,
                    error: 'Your password is wrong'
                });
            }

            if (code !== results[0].code){
                return res.render("deleteAccount.hbs", {
                    layout: null,
                    error: 'Your code is wrong'
                });
            }

            User.deleteUser(sidInput, function(err){
                console.log("deletion completed")
                req.session.passport = null;
                res.clearCookie('islogin', {maxAge: 2 * 3600 * 1000});
                res.redirect('/signup');
            });
        }
        else{
            res.render("deleteAccount.hbs",{
                layout: null,
                warnig: "We can't find you out. Please sign up!"
            });
        };
    });
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