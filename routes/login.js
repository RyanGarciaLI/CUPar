//************************************
// Here is a router for login page
// It deals with get and post request 
// from login page
// Author: Ryan Garcia Yuxin LI
// Update Date: 05/04/2019
//************************************
let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: false })
let User = require('../controller/user');
let md5 = require('../plugin/encryption');
var mailer = require('../plugin/mailer');
// let path = require("path");


// receive form from login page
router.post( '/', urlencodedParser, function(req, res){
    let sid = req.body.sid || 1234;
    let password = req.body.password || '';

    // verify user's information
    if( sid.length !== 10 || sid[0] != 1 || sid[1] != 1 || sid[2] != 5 || sid[3] != 5){
        return res.render('login.hbs',{
            layout: null,
            warning: "Your student id is invalid, please check it again"
        });
    }
        
    if( password.length < 6 || password.length > 20 ){
        return res.render('login.hbs',{
            layout: null,
            warning : "password can't be less than 6 or larger than 20!"
          })  // need improve
    }      
    
    // procedure of log in
    password = md5(password);
    User.selectUserInfo( sid, password, function( results ){
        if( results.length > 0 ){
            if(results[0].state == 1){
            let passport = { id : results[0].id, name: results[0].name, sid: sid, pwd: password};
            res.cookie('islogin', passport, { maxAge: 2 * 3600 * 1000});
            res.redirect('/');
            }
            else{
                res.render('login.hbs', {
                    layout: null,
                    warning: "Account hasn't been activated, please return to sign-up page"
                });
            }
        }
        else{
            res.render('login.hbs', {
                layout: null,
                error: "Password or SID is wrong. Try again~"
            });
        }
    });
    
})

// display page
router.get('/', function(req, res){
    //res.sendFile( path.resolve( __dirname , "..","./public/login.html") );
    res.render('login.hbs',{
        layout: null,
        info : 'Please enter you student ID and password'
    }); 
});

// display reset page
router.get('/reset', function(req, res){
    res.render('reset.hbs', {
        layout:null,
        info : 'Please enter you student ID'
    });
});

router.post('/reset', urlencodedParser, function(req, res){
    let sid = req.body.sid;
    let code = req.body.code;
    User.checkUserInfo( sid, function( result){
        if( result.length === 0 ){ // have not registed yet
            res.render('reset.hbs', {
                layout : null,
                warning : 'You have not registed yet, please sign up'
            });
        } else{ // have registed already
            if( result[0].state === 1 ){ // active
                if( result[0].SID == sid && result[0].code == code ){
                    // go to next step
                    req.session.sid = {sid : sid };
                    res.redirect('/login/reset/pwd');
                }
                else{ // input is wrong
                    res.render('reset.hbs', {
                        layout : null,
                        error : 'Your sid or code is wrong, please check again'
                    });
                }
            }
            else{ // unactive
                res.render('reset.hbs', {
                    layout : null,
                    message : 'Please active your account first in sign-up page',
                    notice : 'Check new code in your cuhk email'
                })
            }
        }
    })
})

// reset password
router.post( '/reset/email', urlencodedParser, function(req, res){
    let sid = req.body.sid;
    let email = req.body.email;
    let code = createSixNum();
    
    User.checkUserInfo(req.body.sid, function(result){
        if( result.length === 0 ){
            // have not registed yet
            res.render('reset.hbs', { 
                layout : null,
                warning : 'You have not registed yet, please sign up'
            }  );
            // res.redirect('signup');
        }
        else{
            // active
            if( result[0].state === 1 ){
                // send email
                mailer.send( mailer.resetEmail(email, result[0].name, code), function(err){
                    if(err){
                        return res.send('000');
                    }
                    // update user's code in db
                    User.updateCode(sid, code, function(err){
                        // send email successfully
                        res.send('001');
                    });
                });
            }
            else{ // unactive
                // send authenticaion email
                mailer.send( mailer.authEmail(email, result[0].name, code), function(err){
                    if(err){
                        return res.send('000');
                    }
                    // update user'code in db
                    User.updateCode( sid, code, function(result){
                        res.render('reset.hbs', {
                            lyaout: null,
                            warning : "Account hasn't been activated, please return to sign-up page"
                        });
                    });
                });
            }
        }
    });
});



router.get('/reset/pwd', function(req, res){
    //refuse hacking access
    if( ! req.session.sid ){
        console.log('nothing in req.session.sid');
        return res.redirect('/login');
    }
    res.render('resetPwd.hbs', {
        layout:null,
        info : 'Please enter your new password'
    });
});

router.post('/reset/pwd', function(req, res){
    let sid = req.session.sid.sid;
    res.session = null ; // clean sesssion
    let password = req.body.password;
    let passwordRP = req.body.passwordRP;

    if( password !== passwordRP ){ // passwords aren't the same
        return res.render('resetPwd.hbs', {
            layout : null,
            error : 'Please confirm your password.'
        });
    }

    password = md5(password);
    // find the user
    User.checkUserInfo(sid, function(result){
        if(result.length === 0 ){
            return console.log(" Can't find the user, error");
        }

        User.updatePwd( sid, password, function(result){
            //res.redirect('/login');
            res.render('loginReset.hbs', {
                layout: null,
                message: 'Reset password successfully, please log in'
            });
        });
    } );

});



// create random code
var createSixNum = function(){
    let num = "";
    for( let i = 0; i < 6; i++){
        num += Math.floor( Math.random()*10);
    }
    return num;
};
module.exports = router;
