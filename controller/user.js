const db = require("../plugin/database"); 

// for authenticate user log-in state
exports.authenticate = function(req, res, next){
    if( req.cookies.islogin ){
        req.session.passport = req.cookies.islogin;
    }
    else{
        req.session.passport = null;
    }
    
    if( !req.session.passport ){ 
        if( req.url == '/login' || req.url == '/signup' ){
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


exports.insertUser = function(sid, username, password, callback){
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
