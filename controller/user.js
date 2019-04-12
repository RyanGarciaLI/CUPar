//************************************************************
// Here is a controller for users to manage their personal info 
// in the db. It could be seen as a user model roughly. And a tool
// for authentication of cookies and sesion is also provided.
// Author: Ryan Garcia Yuxin LI
// Date: 21/03/2019
//************************************
const db = require("../plugin/database"); 

// for authenticate user log-in state
exports.authenticate = function(req, res, next){
    if( req.cookies.islogin ){
        req.session.passport = req.cookies.islogin;
        let user = {name : req.session.passport.name};
        res.locals.user = user;
    }
    else{
        req.session.passport = null;
        res.locals.user = null;
    }
    
    if( !req.session.passport ){ 
        if( req.url == '/' || req.url == '/login' || req.url == '/signup' || req.url == '/signup/email' || req.url == "/login/reset" || req.url == "/login/reset/email" || req.url == "/login/reset/pwd" ){
            next();
        }
        else{
            res.redirect('/login');
        }
    }
    else if( req.session.passport ){  
        next();
    }

}

exports.selectUserInfo = function( sid, password, callback){
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

exports.checkUserInfo = function( sid, callback){
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


exports.insertUser = function(sid, username, password, code, callback){
    try{
        let _db = new db();
        let strSql = 'INSERT INTO account ' + '(sid, name, password, gender, state, code) VALUES(?,?,?,?,?,?)';
        let params = [sid, username, password, 'F', 0, code];
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

exports.updatePwdNameState = function(sid, username, password, callback){
    try{
        let _db = new db();
        //let strSql = 'UPDATE account SET name=' + username + ', password=' + password + ', state=' + 1 + ' WHERE sid=' + sid;
        let strSql = 'UPDATE account SET name=? , password=?, state=? WHERE sid=? ';
        let params = [username, password, 1, sid];
        _db.doUpdate(strSql, params, callback);
        _db = null;
    }
    catch(err){
        console.err(err);
    }
}

exports.updateCode = function( sid, code, callback){
    try{
        let _db = new db();
        let strSql = 'UPDATE account SET code=? WHERE sid=?';
        let params = [code, sid];
        _db.doUpdate(strSql, params, callback);
        _db = null;
    }
    catch(err){
        console.err(err);
    }
}

exports.updatePwd = function( sid, pwd, callback){
    try{
        let _db = new db();
        let strSql = 'UPDATE account SET password=? WHERE sid=?';
        let params = [pwd, sid];
        _db.doUpdate(strSql, params, callback);
        _db = null;
    }
    catch(err){
        console.err(err);
    }
}

exports.updateGender = function( sid, gender, callback){
    try{
        let _db = new db();
        let strSql = 'UPDATE account SET gender=' + gender + ' WHERE sid=' + sid;
        _db.doUpdate(strSql, callback);
        _db = null;
    }
    catch(err){
        console.err(err);
    }
}

exports.updateState = function( sid, callback){
    try{
        let _db = new db();
        let strSql = 'UPDATE account SET state=' + 1 + ' WHERE sid=' + sid;
        _db.doUpdate(strSql, callback);
        _db = null;
    }
    catch(err){
        console.err(err);
    }
}