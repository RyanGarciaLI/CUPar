/**
 *  /router/process_teammate.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Xiao Tianyi (Jack) <jack123qd@hotmail.com>
 *  @version: 1.0
 *  @since 2019-03-19
 *  @last updated: 2019-04-22
 */
`
 A router handles the request of finding a teammate.
 Here we will deal with your submitted data and return the result of your submiting.
 The specific urls and revelant request the router can handle is following:
           URL          |       Request
    --------------------|-------------------
      /process_teammate |        POST
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
    var Name = req.body.Name || '', // make sure Name is string
        sex = req.body.sex || ' ', // make sure sex is string
        college = req.body.College || '', // make sure College is string 
        CourseTitle = req.body.CourseTitle || '', // make sure CourseTitle is string
        CourseCode = req.body.CourseCode || 0,  // make sure CourseCode is number 
        size = req.body.size || 0; // make sure size is number 
    
    // the function to search the information with given SID
    function SearchID(){
        this.select=function(callback,id){
        var sql = 'SELECT distinct * FROM Teammate where user_sid = ' + id;
        var option = {};
            pool.query(sql,function(err,result){
            if(err){console.log(err);}
            option[0] = {'name':"NO ONE"};
            if(result){
            for(var i = 0; i < result.length; i++)
                {option[i]={'name':result[i].name,'sex':result[i].sex};}
            }
            // If return directly, it will return undefined. So we need call back function to receive the data.
            callback(option); 
        });
        };
    }
    module.exports = SearchID;
    SeID = new SearchID();

    // check the data before store it, and send feedback to front-end
    if( sid.length !== 10 || sid[0] != 1 || sid[1] != 1 || sid[2] != 5 || sid[3] != 5){
        return res.send("Your SID is wrong!");
    }
    else if(Name==''||sex==''||college==''||CourseTitle==''||CourseCode==''||size==''){
        return res.send("Please fill in all your necessary information");
    }
    else if(CourseTitle.length!=4){
        return res.send("Course Title should be 4 letters");
    }
    else if(CourseCode.length!=4 ){
        return res.send("Course Code should be 4 digits");
    }
    else if(CourseCode<1000 || CourseCode>7000){
        return res.send("First digit of the code should between 1~6");
    }
    else if(size>6 || size<2){
        return res.send("Size of your team should between 2~6");
    }
    else{
        
        // make sure the course title is upper case
        CourseTitle = CourseTitle.toUpperCase();
        var pool = new link();
        SeID.select(function(rdata){
        if(rdata[0].name=="NO ONE"){
            var  addSql = 'INSERT INTO Teammate (request_id, user_sid, name, sex, college, CourseTitle, CourseCode, size, remark, now_size, if_matched) VALUES(0,?,?,?,?,?,?,?,?,1,0)';
            var  addSqlParams = [sid, Name, sex, college, CourseTitle, CourseCode, size, req.body.remarks];
            
            // insert the data collected from input into database
            pool.query(addSql,addSqlParams,function (err, result){
            if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return;
            }
            /*console.log('--------------------------INSERT----------------------------');      
            console.log('INSERT ID:',result);        
            console.log('-----------------------------------------------------------------\n\n'); */
            });
            res.send("yes");
        }
        else{ res.send("Wrong"); }
        },req.body.SID);  
    }
});

  module.exports = router;