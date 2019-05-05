/**
 *  /router/logout.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Ryan Yuxin LI <lyxnb2333@gmail.com>
 *  @version: 1.5
 *  @since 2019-03-20
 *  @last updated: 2019-04-21
 */
`
 A router handles the request of login, sending authentication email and reset password.
 The specific urls and revelant request the router can handle is following:
           URL          |       Request
    --------------------|-------------------
        /logout         |        ALL
    ----------------------------------------
 The router will clean the cookie and redirect to the login page
`

var express = require('express');
var router = express.Router();

router.all('/', function (req, res) {
    req.session.passport = null;
    res.clearCookie('islogin', {maxAge: 2 * 3600 * 1000});
    res.redirect('/login');
});

module.exports = router;