//************************************
// Here is a router for index page
// It deals with get request from index  
// Author: Ryan Garcia Yuxin LI
// Date: 21/03/2019
//************************************
var express = require('express');
var router = express.Router();
let path = require("path");

// display page
router.get('/', function( req, res){
    console.log("I am here");
    if( !req.session.passport ){
        console.log('welcome');
        res.redirect('/login');
    }
    else{
        res.sendFile(path.resolve( __dirname , "..","./public/index.html"));
    } 
    
})

// display page
router.get('/index', function( req, res){
    console.log( req.session.passport);
    if( !req.session.passport ){
        //console.log('welcome');
        res.redirect('/login');
    }
    else{
        //res.redirect('/login');
        res.sendFile(path.resolve( __dirname , "..","./public/index.html"));
    } 
    
 })
module.exports = router;