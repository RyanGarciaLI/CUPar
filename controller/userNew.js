const db = require("../plugin/database"); 

exports.authenticate = function(req, res, next){
    console.log('*********************ready to check passport**********************');
    console.log("                     your req cookie is ", req.cookies.islogin);
    console.log("                     your req session is ",req.session.user);
    console.log('*********************check ends***********************************');
    console.log(!req.cookies.islogin)
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
