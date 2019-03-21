let express = require('express');
let router = express.Router();

router.all('/', function(req, res){
    req.session.user = null;
    res.clearCookie('islogin',{ maxAge: 2 * 3600 * 1000})
    //ookies.islogin = undefined;
    res.redirect('/login');
})

module.exports = router;