//************************************
// Here is a router for log-out function
// It deals with log out request 
// Author: Ryan Garcia Yuxin LI
// Date: 21/03/2019
//************************************
let express = require('express');
let router = express.Router();

router.all('/', function(req, res){
    req.session.passport = null;
    res.clearCookie('islogin',{ maxAge: 2 * 3600 * 1000})
    res.redirect('/login');
})

module.exports = router;