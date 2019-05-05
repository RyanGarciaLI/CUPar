//************************************
// Here is a plugin for operation of 
// MySQL database, it contains select, 
// insert, update;
// Author: WEI Wang
// Date: 21/03/2019
//************************************
var mysql = require('mysql');
var config = require('../config').config;
// create connection pool to enhance efficiency 
var pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : config.db_pwd,
    database : 'cup'
});

var dbprocess={
    // change the status of post in database to private using "update"
    setPrivate:function(postid,params,callback){
        pool.getConnection(function(err,connection){
            if(err) throw err;
            let strSql ='UPDATE `post` SET ? WHERE `id` = '+postid;
            connection.query(strSql, params, function(err, result){
                connection.release();
                if(err) 
                    {
                        console.error(err);
                }
                callback(result);
            })
        });
    },
    // change the status of post in database to public using "update"
    setPublic:function(postid,params,callback){
        pool.getConnection(function(err,connection){
            if(err) throw err;
            let strSql ='UPDATE `post` SET ? WHERE `id` = '+postid;
            connection.query(strSql, params, function(err, result){
                connection.release();
                if(err) 
                    {
                        console.error(err);
                }
                callback(result);
            })
        });
    },
    // add new post in "post" table using "insert"
    addPost:function (params, callback){
        pool.getConnection(function(err, connection){
            if(err) throw err;
            let strSql ='INSERT INTO `post` SET ?';
            connection.query(strSql, params, function(err, result){
                connection.release();
                
                if(err) 
                    {
                        console.error(err);
                }

                callback(result);
            })
        });
    },
    // add a new comment in "comment" table using "insert"
    addReply : function(params, callback){
        pool.getConnection(function(err, connection){
            if(err) throw err;
            let strSql = 'INSERT INTO `comment` SET ?';
            connection.query(strSql, params, function(err, result){
                connection.release();
                if(err) 
                    {
                        console.error(err);
                }
                callback(result);
            })
        });
    },
    // display all public posts in "post" table using "select"
    displayPosts : function(callback){
        pool.getConnection(function(err, connection){
            if(err) throw err;
            let strSql ='SELECT `post`.*, name FROM `post`, `account` WHERE `post`.`status`= 0 AND `post`.`uid`=`account`.`id` ';
            connection.query(strSql, function(err, result){
                connection.release();
                if(err) 
                    {
                        console.error(err);
                }
                callback(result);
            })
        });
    },
    // display the user's all posts in "post" table using "select"
    displayMyPost : function(id,callback){
        pool.getConnection(function(err, connection){
            if(err) throw err;
            let strSql ='SELECT `post`.* FROM `post` WHERE `post`.`uid`= '+id;
            connection.query(strSql, function(err, result){
                connection.release();
                
                if(err) 
                    {
                        console.error(err);
                }

                callback(result);
                
            })
        });
    },
    // display the specific post all information
    getPost:function (id, callback){
        pool.getConnection(function(err, connection){
            if(err) throw err;
            let strSql='SELECT * FROM `post` WHERE `post`.`id`=?';
            connection.query(strSql, [id], function(err, result){
                connection.release(); 
                if(err) {
                    console.error(err);}
                callback(result);
            })
        });
    },
    // display all comments from the specific post
    getReply : function(postid, callback){
        pool.getConnection(function(err, connection){
            if(err) throw err;
            let strSql = 'SELECT * FROM `comment` WHERE `postid`=?'
            connection.query(strSql, [postid], function(err, result){
                connection.release(); 
                if(err) {
                    console.error(err);}
                    
                callback(result);
                
            })
        });
    }
}
module.exports = dbprocess;