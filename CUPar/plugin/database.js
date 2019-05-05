/**
 *  /plugin/database.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Ryan Yuxin LI <lyxnb2333@gmail.com>
 *  @version: 1.0
 *  @since 2019-03-20
 *  @last updated: 2019-04-21
 */
 `
  The database plugin is able to connect to the database according to the config.js
  it is also able to interact with the database according to the SQL statements as its
  argument. The functions doXXXX are the same, but it's easy to distinguish if named
  differently when they are called in user.js
 `

var mysql = require('mysql');
var config = require('../config').config;

function DB() {
    if( this instanceof DB ){
        this.connect();
    }
    else{
        throw{
            error_msg: 'Please create the constructor of DB like this: "var _db = new DB();" '
        }
    }
}

DB.prototype.connect = function(){
    
    this.DATABASE = config.db_name;
    this.client = mysql.createConnection({
        user: config.db_user,
        password: config.db_pwd,
    })

    this.client.connect(handleError);   // connect to mySQL
    this.client.on('error', handleError);
    this.client.query('use ' + this.DATABASE);  // use specific db

    function handleError(err){
        if(err){
            if(err.code === 'PROTOCOL_CONNECTION_LOST'){
                this.connect();
            }
            else{
                console.error(err.stack || err);
            }
        }
    }
}

DB.prototype.doSelect = function(sql, callback){ // do selection
    let self = this;
    self.client.query(
        sql,    // sql statement, the same below
        function(err, results){
            if(err){
                throw err;
            }
            if( results && typeof callback == 'function')
            {
                callback(results);
            }
            self.client.end();  // disconnected
        }
    );
}

DB.prototype.doInsert = function(sql, params, callback){ // do insertion
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

DB.prototype.doUpdate = function(sql, params, callback){ // do updation
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

DB.prototype.doDelete = function(sql, callback){ // do deletion
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