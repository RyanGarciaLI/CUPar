// this is route for index
var express = require('express');
var router = express.Router();
//var bodyParser = require('body-parser');
//var urlencodedParser = bodyParser.urlencoded( {extend: false});

router.get('/', function( req, res){
    console.log("I am here");
    if( !req.session.user ){
        console.log('welcome');
        res.redirect('/login');
    }
    else{
        res.sendFile(process.cwd() +"/CUPar/public" + "/index.html");
    } 
    
})

router.get('/index', function( req, res){
    if( !req.session.user ){
        console.log('welcome');
        res.redirect('/login');
    }
    else{
        //res.redirect('/login');
        res.sendFile(process.cwd() +"/CUPar/public" + "/index.html");
    } 
    
 })
module.exports = router;