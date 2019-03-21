const formidable = require('formidable');
const fs = require("fs");
const db = require("../plugin/database");  
//const index = require('./index'); // need update
const events = require('events');
const emitter = new events.EventEmitter();
//const mail = require('../plugin/mail');  
const md5 = require( '../plugin/common'); 

User.emitter = emitter;

function User( user ){
    this.name = user.name;
    this.pwd = user.pwd;
    this.sid = user.sid; 
} /// pay attention to structure of user

User.authenticate = function(req, res, next){
    console.log('*********************ready to check passport');
    console.log("                     your req cookie is ", req.cookies);
    console.log("                      your req session is ",req.session.user);
    console.log('*********************check ends');
    if( req.cookies.islogin ){
        req.session.user = req.cookies.islogin;
    }
    else{
        req.session.user = null;
    }
    
    if( !req.session.user ){ // req.user
        console.log("######## your url is ", req.url);
        if( req.url == '/login' || req.url == '/signup' ){
            console.log('keep logging in or signing up');
            next();
        }
        else{
            console.log('you are invalid , you will be redirected to log in');
            res.redirect('/login');
        }
    }
    else if( req.session.user ){  // req.user
        console.log(" do whatever you like");
        next();
    }

}

User.logout = function(req, res){
    req.session.user = null;  // req.user
    res.redirect('/login');
}

User.login = function(req, res, callback){
    let sid = req.body.sid;
    let password = req.body.password;

    password = md5(password); // encrypt pwd
    selectUserInfo( sid, password, function( results){
        if( results.length > 0 ){
            // set session
            let userPPT = { user: sid, pwd: password}  // need explore
            res.cookie('islogin', userPPT, { maxAge: 2 * 3600 * 1000});
            emitter.emit('userInfo', results[0]);
            res.redirect('/');
            callback(results);
        }
        else{
            console.log(" we don't find you out, please log in again");
            res.redirect('/login');
        }
    });
}

User.signup = function(req, res, callback){
    let sid = req.body.sid;
    let password = req.body.password;
    let username = req.body.username;

    checkUserInfo(sid, function(results){
        if( results.length > 0 ){
            callback(results);
        }
        else{
            password = md5(password);
            insertUser(sid, username, password, function( results){
                emitter.emit('userInfo', {name: username, sid: sid, });
                let userPPT = { user: sid, pwd: password };
                req.cookie("islogin",userPPT, {maxAge: 2 * 3600 * 1000});
                console.log(req.session.user);
                res.redirect('/');
            });
        }
        
    })

    
}

var selectUserInfo = function( sid, password, callback){
    try{
        let _db = new db();
        let strSql = 'SELECT * FROM account WHERE BINARY sid="'+ sid +'" and password="' + password +'"';
        _db.doSelect( strSql, callback);
        _db = null;
    }
    catch(err){
        console.error(err);
    }
}

var checkUserInfo = function( sid, callback){
    try{
        let _db = new db();
        let strSql = 'SELECT * FROM account WHERE BINARY sid='+ sid ;
        _db.doSelect( strSql, callback);
        _db = null;
    }
    catch(err){
        console.error(err);
    }
}


var insertUser = function(sid, username, password, callback){
    try{
        let _db = new db();
        let strSql = 'INSERT INTO account ' + '(sid, name, password, gender, state) VALUES(?,?,?,?,?)';
        let params = [sid, username, password, 'F',1];
        _db.doInsert(
            strSql,
            params,
            callback
        );
        _db = null;
    }
    catch(err){
        //logger.error('err: '+ err.error_msg);
        console.log(" some problems happen in function insertUser ");
        console.error(err);
    }
}  

module.exports = User;