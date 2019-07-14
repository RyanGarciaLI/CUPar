/**
 *  /router/account.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Xiao Tianyi (Jack) <jack123qd@hotmail.com>
 *  @version: 1.0
 *  @since 2019-03-19
 *  @last updated: 2019-04-22
 */
`
 A router handles the request of looking through account page.
 By the way, in account page, you can check the matching result of your
 roommates and teammates, and also start to chat and evaluate other people.
 The specific urls and revelant request the router can handle is following:
           URL          |       Request
    --------------------|-------------------
       /account_page    |        GET
    ----------------------------------------
`

var express = require('express');
let router = express.Router();

router.get('/', function( req, res){
    
    // If user hasn't logged in
    if( !req.session.passport ){ 
        res.redirect('/login');
    }

    // get user's information
    let user_name = req.cookies.islogin.name;
    let userID = req.cookies.islogin.sid; 
    
    // render the hbs document
    res.render('account.hbs', {
        layout: null,
        name: user_name,
        sid : userID,
        email: userID + "@link.cuhk.edu.hk",
        username: user_name,
        login: 1
    });

});

module.exports = router;