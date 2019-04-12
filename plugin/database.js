var mysql = require('mysql');
var config = require('../config').config;


//************************************
// Here is a plugin for operation of 
// MySQL database, it contains select, 
// insert, update and delete;
// Author: Ryan Garcia Yuxin LI
// Date: 21/03/2019
//************************************
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

// ***********************************
//  Ryan's part ends
// ***********************************