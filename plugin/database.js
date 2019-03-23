var mysql = require('mysql');
var config = require('../config').config;

var pool = mysql.createPool({
    host : '127.0.0.1',
    user : 'andy',
    password : '123456',
    database : 'forum'
});

// addPost : function(params, cb){
//     pool.getConnection(function(err, connection){
//         if(err) throw err;

//         connection.query('INSERT INTO `post` SET ?', params, function(err, result){
//             if(err) throw err;

//             cb(result);
//             connection.release();
//         })
//     });
// }

// getPosts : function(id, cb){
//     pool.getConnection(function(err, connection){
//         if(err) throw err;

//         connection.query('SELECT * FROM `post` WHERE `id`=?', [id], function(err, result){
//             if(err) throw err;
//             cb(result);
//             connection.release(); 
//         })
//     });
// }

function DB() {
    if( this instanceof DB ){
        this.connect();
    }
    else{
        throw{
            error_msg: 'Please new the constructor of DB like this: "var _db = new DB();" '
        }
    }
}

DB.prototype.connect = function(){
    
    this.DATABASE = config.db_name;
    this.client = mysql.createConnection({
        user: config.db_user,
        password: config.db_pwd,
    })

    this.client.connect(handleError);
    this.client.on('error', handleError);
    this.client.query('use ' + this.DATABASE);

    function handleError(err){
        if(err){
            if(err.code === 'PROTOCOL_CONNECTION_LOST'){
                this.connect(); ///     ???????????????????
            }
            else{
                console.error(err.stack || err);
            }
        }
    }
}

DB.prototype.doSelect = function(sql, callback){
    let self = this;
    self.client.query(
        sql,
        function(err, results){
            if(err){
                throw err;
            }
            if( results && typeof callback == 'function')
            {
                callback(results);
            }
            self.client.end();
        }
    );
}

DB.prototype.doInsert = function(sql, params, callback){
    let self = this;
    self.client.query(
        sql,
        params,
        function(err,results){
            if(err){
                throw err;
            }
            if(results && typeof callback == 'function')
            {
                callback(results);
            }
            self.client.end();
        }
    );
}

DB.prototype.doUpdate = function(sql, params, callback){
    let self = this;
    self.client.query(
        sql,
        params,
        function(err, results){
            if(err){
                throw err;
            }
            if( results && typeof callback == 'function'){
                callback(results);
            }
            self.client.end();
        }
    );
}

DB.prototype.doDelete = function(sql, callback){
    let self = this;
    self.client.query(
        sql,
        params,
        function( err, results){
            if(err){
                throw err;
            }
            if( results && typeof callback == 'function'){
                callback(results);
            }
            self.client.end();
        }
    );
}

module.exports = DB;

// the following function can be invoked anywhere for convenience

// var selectUserInfo = function(){
//     try{
//         let _db = new DB();
//         let strSql = 'SELECT sid, name FROM account';
//         _db.doSelect(
//             strSql,
//             function(results){
//                 for( let i = 0; i < results.length; i++){
//                     console.log("%d\t%s", results[i].sid, results[i].name);
//                 };
//             }
//         );
//         _db = null;
//     }
//     catch(err){}
//     console.log(err.error_msg);

// }

// var insertUser = function(){
//     try{
//         let _db = new DB();
//         let strSql = 'INSERT INTO user ' + '(sid, name, password, gender, state) VALUES(?,?,?,?,?)';
//         let params = ['11559999999', 'QA', '123456', 'F', 1];
//         _db.doInsert(
//             strSql,
//             params,
//             function(err, results){
//                 console.info(results);
//             }
//         );
//         _db = null; 
//     }
//     catch(err){
//         console.log(err.error_msg);
//     }
// }