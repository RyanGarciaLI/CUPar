/**
 *  /plugin/database.js
 *  Copyright (c) 2018-2019  CUPar Ltd. All right reserved.
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

function create_pool(){
    return (mysql.createPool({
        host    : 'localhost',
        user    : config.db_user,
        password: config.db_pwd,
        port    : '3306',
        database: config.db_name,
        userConnectionPooling: true,
        connectionLimit: 500
    }));
}

;var pool = new create_pool()

/**
 * Select user data via unique id from DB
 * @since 2019/07/15
 * @param {number} sid 10-digit number
 * @param {function} callback to do after query data
 * @returns {object} user data
 */
exports.select_user_data = function(sid, callback){
    let sql = 'SELECT * FROM account WHERE BINARY `sid`="' + sid + '"'
    pool.query(sql, function(err, user_list){
        if(err){
            console.error("Some error(s) raised from select_user_data():")
            console.error(err)
            console.error('--------------------')
        }
        if(user_list && typeof callback == 'function'){
            callback(user_list)
            return user_list[0]
        }
    })
}

/**
 * Select user data via unique id and specific pwd from DB, used to verify identity
 * @since 2019/07/15
 * @param {number} sid 10-digit number
 * @param {string} password password of user
 * @param {function} callback to do after query data
 * @returns {object} user data
 */
exports.verify_user_identity = function(sid, password, callback){
    let sql = 'SELECT * FROM account WHERE `sid`="' + sid +
                '" AND `password`="' + password + '"'
    pool.query(sql, function(err, user_list){
        if(err) {print_func_err('verify_user_identity', err)}
        if(user_list && typeof callback == 'function'){
            callback(user_list)
            return user_list[0]
        }
    })
}

/**
 * Insert a user into DB with specific sid, username, code and default pwd, gender, state
 * by default, pwd=123456, gender=1, state=0
 * @param {number} sid 10-digit number
 * @param {string} name name of user
 * @param {string} code 6-digit number in string
 * @param {function} callback to do after query data
 */
exports.insert_unactive_user = function(sid, name, code, callback){
    let sql = 'INSERT INTO ?? (??,??,??,??,??,??) VALUES (?,?,?,?,?,?)'
    let params = [config.tb_account].concat(config.tb_account_params)
    params = params.concat([sid, name, '123456', 'F', 0, code])
    sql_stm = mysql.format(sql, params)
    console.debug(sql_stm)
    pool.query(sql_stm, function(err, res){
        if(err){throw err}
        if(res && typeof callback == 'function'){
            callback(res)
            console.log(res.insertID)   // added
        }
    })
    console.error("Some error(s) were raised from insert_unactive_user():")
}

/**
 * update user data into DB with any specific params expect for sid
 * @param {number} sid 10-digit number
 * @param {object} data data to be updated
 * @param {string} data.name new username
 * @param {string} data.password new pwd
 * @param {char} data.gender new gender setting  //TODO
 * @param {number} data.state 0 or 1
 * @param {string} data.code 6-digit number in string
 * @param {function} callback to do after query data
 */
exports.update_user = function(sid, data, callback){
    let params_keys = Object.keys(data)
    let params_array = params_keys.map(key => "`" + key + "`='" + data[key] + "'")
    let params_str = params_array.join(',')
    let sql = 'UPDATE `cupar`.`account` SET ' + params_str + ' WHERE `sid`=' + sid;
    console.debug('sql statement is:', sql)
    try{
        pool.query(sql, function(err, res){
            if(err) {throw err}
            if(res && typeof callback == 'function'){
                // res is nothing but some info about mysql
                callback()
                console.log('Number of affected rows:', res.affectedRows)
            }
        })
    }catch(err){
        console.error('Some error(s) were raised from update_user() ')
        console.error(err)
    }
}

print_func_err = function(name,err){
    console.error("Some error(s) raised from " + name + "():")
    console.error(err)
    console.error('<=----------------------------------------=>')
}

// function DB() {
//     if( this instanceof DB ){
//         this.connect();
//     }
//     else{
//         throw{
//             error_msg: 'Please create the constructor of DB like this: "var _db = new DB();" '
//         }
//     }
// }

// DB.prototype.connect = function(){
    
//     this.DATABASE = config.db_name;
//     this.client = mysql.createConnection({
//         user: config.db_user,
//         password: config.db_pwd,
//     })

//     this.client.connect(handleError);   // connect to mySQL
//     this.client.on('error', handleError);
//     this.client.query('use ' + this.DATABASE);  // use specific db

//     function handleError(err){
//         if(err){
//             if(err.code === 'PROTOCOL_CONNECTION_LOST'){
//                 this.connect();
//             }
//             else{
//                 console.error(err.stack || err);
//             }
//         }
//     }
// }

// DB.prototype.doSelect = function(sql, callback){ // do selection
//     let self = this;
//     self.client.query(
//         sql,    // sql statement, the same below
//         function(err, results){
//             if(err){
//                 throw err;
//             }
//             if( results && typeof callback == 'function')
//             {
//                 callback(results);
//             }
//             self.client.end();  // disconnected
//         }
//     );
// }

// DB.prototype.doInsert = function(sql, params, callback){ // do insertion
//     let self = this;
//     self.client.query(
//         sql,
//         params,
//         function(err,results){
//             if(err){
//                 throw err;
//             }
//             if(results && typeof callback == 'function')
//             {
//                 callback(results);
//             }
//             self.client.end();
//         }
//     );
// }

// DB.prototype.doUpdate = function(sql, params, callback){ // do updation
//     let self = this;
//     self.client.query(
//         sql,
//         params,
//         function(err, results){
//             if(err){
//                 throw err;
//             }
//             if( results && typeof callback == 'function'){
//                 callback(results);
//             }
//             self.client.end();
//         }
//     );
// }

// DB.prototype.doDelete = function(sql, callback){ // do deletion
//     let self = this;
//     self.client.query(
//         sql,
//         params,
//         function( err, results){
//             if(err){
//                 throw err;
//             }
//             if( results && typeof callback == 'function'){
//                 callback(results);
//             }
//             self.client.end();
//         }
//     );
// }

// // module.exports = DB;