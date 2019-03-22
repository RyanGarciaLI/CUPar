//************************************
// Here is a router for login page
// It deals with get and post request 
// from login page
// Author: Ryan Garcia Yuxin LI
// Date: 21/03/2019
//************************************
let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: false })
let User = require('../controller/user');
let md5 = require('../plugin/common');
let path = require("path");


// receive form from login page
router.post( '/', urlencodedParser, function(req, res){
    let sid = req.body.sid || 1234;
    let password = req.body.password || '';

    // verify user's information 
    if( sid.length !== 10 || sid[0] != 1 || sid[1] != 1 || sid[2] != 5 || sid[3] != 5){
        res.redirect('/login');
        return res.status(400).end("SID is invalid!");  // need improve
    }
        
    
    if( password.length < 6 || password.length > 20 ){
        res.redirect('/login');
        return res.status(400).end("password can't be less than 6 or larger than 20!");  // need improve
    }      
    

    // procedure of log in
    password = md5(password);
    User.selectUserInfo( sid, password, function( results ){
        if( results.length > 0 ){
            let passport = { name: results[0].name, sid: sid, pwd: password};
            res.cookie('islogin', passport, { maxAge: 2 * 3600 * 1000});
            res.redirect('/');
        }
        else{
            console.log(" we don't find you out, please check your sid and password~");
            res.redirect('/login');
        }
    });
    
})

// display page
router.get('/', function(req, res){
    res.sendFile( path.resolve( __dirname , "..","./public/login.html") ); 
    console.log("welcome to log in page");
})



module.exports = router;
