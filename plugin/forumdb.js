var mysql = require('mysql');
var config = require('../config').config;

var pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : config.db_pwd,
    database : 'cup'
});
var dbprocess={
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