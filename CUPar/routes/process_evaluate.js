/**
 *  /router/process_evaluate.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Xiao Tianyi (Jack) <jack123qd@hotmail.com>
 *  @version: 1.0
 *  @since 2019-03-19
 *  @last updated: 2019-04-22
 */
`
 A router handles the request of evaluating your teammates.
 You can report the freerider and try to mark your teammates.
 However, there may be some defects which may limit the use of this system.
 The specific urls and revelant request the router can handle is following:
           URL          |       Request
    --------------------|-------------------
      /process_evaluate |        POST
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

  // link the database
  var pool = new link();
  let userID = req.cookies.islogin.sid; 
  
  // the function to search the information with given SID
  function SearchID(){
    this.select=function(callback,id){
      var sql = 'SELECT distinct * FROM Teammate where user_sid = ' + id;
      var option = {};
      pool.query(sql,function(err,result){
        if(err){console.log(err);}
        option[0] = {'Size':0,'evaluation':0}; // set a default value
        if(result){
          // get the information from the variable 'result'
          for(var i = 0; i < result.length; i++)
            {option[i]={'CourseTitle':result[i].CourseTitle,'CourseCode':result[i].CourseCode,'evaluation':result[i].evaluation,
              'Size':result[i].Size,'sid':result[i].user_sid,'college':result[i].college,'sex':result[i].sex,'remark':result[i].remark,'name':result[i].name};}
        }
        // If return directly, it will return undefined. So we need call back function to receive the data.
        callback(option);
      });
    };
  }
  module.exports = SearchID;
  SeID = new SearchID();

  // the function to update the database
  function UpdateID(){
    this.select=function(point,id){
      var sql = 'UPDATE teammate SET evaluation = ' + point + ' where user_sid = ' + id ;
      pool.query(sql,function(err){if(err){console.log(err);}});
    };
  }
  module.exports = UpdateID;
  UpID = new UpdateID();
  
  // the function to record freerider
  function SaveID(){
    this.select=function(user_id){
      var sql = 'INSERT INTO freerider (id, sid) VALUES (0,?)';
      var param = [user_id];
      pool.query(sql,param,function(err){
        if(err){console.log(err);}
      });
    };
  }
  module.exports = SaveID;
  SaID = new SaveID();
  data = Array;

  SeID.select(function(rdata){
    // get the result from the callback function
    data = rdata;
    
    if( data[0].Size!=0 && userID!=req.body.sid ){

      // calculate the point of the user
      var point = data[0].evaluation;
      point += (req.body.star-3)*10;
      // deal with the freerider report
      if(req.body.freerider=="freerider"){
        SaID.select(req.body.sid);
        point-=30;
      }
      // update the data and redirect the page to index
      UpID.select(point,req.body.sid);
      res.redirect('/');
    }
    else{res.redirect('/');} // function to default
  },req.body.sid);
  
});

module.exports = router;