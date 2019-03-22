//************************************
// Here is a router for sign-up page
// It deals with get and post request 
// from sign-up page
// Author: Ryan Garcia Yuxin LI
// Date: 21/03/2019
//************************************
let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: false });
let User = require('../controller/user');
let md5 = require('../plugin/common');
let path = require("path");

// display page
router.get('/', function(req, res){
        res.sendFile(path.resolve( __dirname , "..","./public/sign-up.html")); 
        console.log("welcome to sign up page");
        })

// receive form from users
router.post('/', urlencodedParser, function(req, res, next){
        var username = req.body.username || '', // make sure username is string
            password = req.body.password || ' ', // make sure password is string
            passwordRP = req.body.passwordRP || '', // make sure passwordRP is string 
            sid = req.body.sid || 0000000000, // make sure sid is number
            code = req.body.code || 123456;  // make sure code is number 
            
            // verify user's information
            if( sid.length !== 10 || sid[0] != 1 || sid[1] != 1 || sid[2] != 5 || sid[3] != 5){
                return res.status(400).end("SID is invalid!");
            }                
            
            if( password.length < 6 || password.length > 20 ){
                return res.status(400).end("password must be equal or larger than 6 and equal or less than 20!")
            }               
            
            if( username.length === 0 || username.length > 20 ){
                return res.status(400).end("username must be nonempty and equal or less than 20 !");
            }
            
            if( password != passwordRP ){
                return res.status(400).end("Twice inputs are different, please confirm your password!");
            }             

          
            // procedure of sign up
            User.checkUserInfo(sid, function(results){
                if( results.length > 0 ){
                    res.redirect('/login');    // need improve
                    console.log(" you have been registed, please log in!");
                }
                else{
                    password = md5(password);
                    User.insertUser(sid, username, password, function( results ){
                        // set passport to user for access
                        let userPassport = { name: username, sid: sid, pwd: password };
                        res.cookie("islogin",userPassport, {maxAge: 2 * 3600 * 1000});
                        res.redirect('/');
                    });
                }
                
            })
                 
   });


module.exports = router;