/**
 *  /router/index.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Ryan Yuxin LI <lyxnb2333@gmail.com>
 *  @version: 1.0
 *  @since 2019-03-19
 *  @last updated: 2019-04-21
 */
`
 A router handles the request of login, sending authentication email and reset password.
 The specific urls and revelant request the router can handle is following:
           URL          |       Request
    --------------------|-------------------
       /                |        GET
       /index           |        GET
    ----------------------------------------
`

var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    if (req.session.passport) { // the user has logged in
        res.render("index.hbs", {
            layout: null,
            username: req.session.passport.name, // display the username on the page
            login: 1
        });
    } else {
        res.render("index.hbs", {
            layout: null,
            username: "My Page",
            login: 0
        });
    }
});

router.get('/index', function( req, res){
    if (req.session.passport) { // the user has logged
        res.render("index.hbs", {
            layout: null,
            username: req.session.passport.name,    // display the username on the page
            login: 1
        });
    } else {
        res.render("index.hbs", {
            layout: null,
            username: "My Page",
            login: 0
        });
    }
});

module.exports = router;