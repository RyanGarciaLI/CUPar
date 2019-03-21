// this is route for account system
let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.route('/signup') // page
    
    // return page for signing up
    .get( function(req, res){
        //if( !req.user ) return res.redirect('/account/login');
        let response = {
            "sid": req.query.sid,
            "name": req.query.username,
            "password": req.query.password,
            "passwordRP":req.query.passwordRP  // repeat password
        };

        res.end(JSON.stringify(response));
        })

    // receive form from users
    .post( urlencodedParser, function(req, res, next){
        let username = req.body.username || '', // make sure username is string
            password = req.body.password || '', // make sure password is string
            sid = req.body.studentID || 0000000000, // make sure sid is number
            code = req.body.code || 123456;  // make sure code is number 

            if( sid.length !== 10 || password.length === 0 || username.length === 0){
                return res.status(400).end("SID, username or password is invalid!");
            }
            
            let sidExist = false;

            if( sidExist ){
                return res.status(400).end("user exists! Please log in!");
            }
            
            console.log("Sign up post received!");
            console.log('Username: ', username, 'Password: ', password, "Student ID: ", sid, "Code: ", code);
            res.status(201).end(' received request successfully');
   });






router.route('/login')

    .get( function(req, res){
        console.log("login successfully");
        return res.send("this is login page");
    })

    .post( urlencodedParser, function(req, res, next){
        let sid = req.body.sid || 1234;
        let password = req.body.password || '';
        //let sid = 1155107874;
        
        if( sid.length !== 10 || password.length === 0)
            return res.status(400).end("SID or password is invalid!");
        
        let sidExist = false;
        if( sidExist ){
            return res.status(400).end("user does not exist! Please sign up!");
        }

        console.log("Login in post received!");
        console.log("sid: ", sid, "password: ", password);
        res.status(201).end(' received request successfully');
    })


module.exports = router;