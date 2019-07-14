/**
 *  /router/process_roommate.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Xiao Tianyi (Jack) <jack123qd@hotmail.com>
 *  @version: 1.0
 *  @since 2019-03-19
 *  @last updated: 2019-04-22
 */
`
 A router handles the request of finding a roommate.
 Here we will deal with your submitted data and return the result of your submiting.
 The specific urls and revelant request the router can handle is following:
           URL          |       Request
    --------------------|-------------------
      /process_roommate |        POST
    ----------------------------------------
`

var express = require('express');
let router = express.Router();
var mysql  = require('mysql');  
var config = require('../config').config;

// A module to link the mysql database
function link(){
    return(mysql.createPool({     
        host     : 'localhost',       
        user     : config.db_user,              
        password : config.db_pwd,       
        port: '3306',                   
        database: config.db_name,
        useConnectionPooling: true,
        connectionLimit: 500
    }));
}
module.exports=link;

// the main function
router.post('/', function (req, res) {

    var sid = req.body.SID || 0000000000;
    var Name = req.body.Name || '',  // make sure Name is string
            sex = req.body.sex || ' ',  // make sure sex is string
            college = req.body.College || '',  // make sure College is string 
            Hall = req.body.Hall || '',  // make sure Hall is string
            sleep_start = req.body.sleep_start || 0,   // make sure sleep_start is number 
            sleep_end = req.body.sleep_end || 0;  // make sure sleep_end is number 
    
    // the function to search the information with given SID
    function SearchID(){
        this.select=function(callback,id){
        var sql = 'SELECT distinct * FROM Roommate where user_sid = ' + id;
        var option = {};
            pool.query(sql,function(err,result){
            if(err){console.log(err);}
            option[0] = {'name':"NO ONE"};
            if(result){
            for(var i = 0; i < result.length; i++)
                {option[i]={'name':result[i].name,'sex':result[i].sex,'college':result[i].college,'hall':result[i].hall,'sid':result[i].user_sid,
                'remark':result[i].remark,'start':result[i].sleep_time_start,'end':result[i].sleep_time_end};}
            }
            // If return directly, it will return undefined. So we need call back function to receive the data.
            callback(option); 
        });
        };
    }
    module.exports = SearchID;
    SeID = new SearchID();
    
    // make sure the form of input is right
    if( sid.length !== 10 || sid[0] != 1 || sid[1] != 1 || sid[2] != 5 || sid[3] != 5){
        return res.send("Your SID is wrong!");
    }
    else if(Name==''||sex==''||college==''||Hall==''||sleep_start==''||sleep_end==''){
        return res.send("Please fill in all your necessary information");
    }
    else{

        // main part of collection users' personal information
        var pool = new link();
        SeID.select(function(rdata){
        if(rdata[0].name=="NO ONE"){
            var  addSql = 'INSERT INTO Roommate (request_id, user_sid, name, sex, college, hall, sleep_time_start, sleep_time_end, remark,if_matched) VALUES(0,?,?,?,?,?,?,?,?,0)';
            var  addSqlParams = [sid, Name, sex, college, Hall, sleep_start, sleep_end, req.body.remarks];
            
            // insert the data collected from input into database
            pool.query(addSql,addSqlParams,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            /*console.log('--------------------------INSERT----------------------------');      
                console.log('INSERT ID:',result);        
                console.log('-----------------------------------------------------------------\n\n');*/
            });
            res.send("yes");
        }
        else{res.send("Wrong");}
        },req.body.SID);  
    }
});

module.exports = router;