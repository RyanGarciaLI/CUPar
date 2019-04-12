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
    if( req.session.passport ) {
        //console.log("/ no");
        res.render("index.hbs", {
            layout: null,
            username: req.session.passport.name,
            login: 1
        });
    }
    else{
        //console.log("/ yes");

        res.render("index.hbs", {
            layout: null,
            username: "My Page",
            login: 0
        });
    }
});

// display page
router.get('/index', function( req, res){
    //console.log("index yes");
    if( req.session.passport ) {
        res.render("index.hbs", {
            layout: null,
            username: req.session.passport.name,
            login: 1
        });
    }
    else{
        //console.log("index no");
        res.render("index.hbs", {
            layout: null,
            username: "My Page",
            login: 0
        });
    }
});

module.exports = router;