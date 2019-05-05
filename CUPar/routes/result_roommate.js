/**
 *  /router/result_roommate.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Xiao Tianyi (Jack) <jack123qd@hotmail.com>
 *  @version: 1.0
 *  @since 2019-03-19
 *  @last updated: 2019-04-22
 */
`
 A router handles the request of accepting or refusing the result of matching 
 roommates. You need to click the button after you see the result of matching
 roommate . 
 The specific urls and revelant request the router can handle is following:
           URL          |       Request
    --------------------|-------------------
      /result_roommate  |        POST
    ----------------------------------------
If user refuse the result, the whole match will fail and system would start
a new match, and this refusion can't be reversed. If both of you accept the
result, then the matching is successful and no one can change it. However
before every accept the result, user can still refuse the result even he/she
has accepted.
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

  res.redirect("/index");
  let userID = req.cookies.islogin.sid; 
  var pool = new link();
  
  // the function to check room_result with given SID
  function CheckRE(){
    this.select=function(callback,id){
      var sql = 'SELECT * FROM Room_result where user_id1 = ' + id + ' or user_id2 =' + id;
      var option = {};  
      pool.query(sql,function(err,result){
        if(err){console.log(err);}
        // default result
        option[0]={'user_id1':"00000",'user_id2':null};
        if(result){
          for(var i = 0; i < result.length; i++)
            {option[i]={'result':result[i].result,'id':result[i].id,'res1':result[i].res1,'res2':result[i].res2,'user_id1':result[i].user_id1,'user_id2':result[i].user_id2};}
        }
        // If return directly, it will return undefined. So we need call back function to receive the data.
        callback(option); 
      });
    };
  }
  module.exports = CheckRE;
  ChRE = new CheckRE();

  // update the room_result to record the acceptance of one roommate
  function SimpleUpdateRE(){
    this.select=function(id,number,result){
      var sql = 'UPDATE Room_result SET res' + number + ' = ' + result + ' where user_id1 = ' + id + ' or user_id2 =' + id;
      pool.query(sql,function(err){
        if(err){console.log(err);}
      });
    };
  }
  module.exports = SimpleUpdateRE;
  SiupRE = new SimpleUpdateRE();
  
  // update the final result of a matching, result = 1 -> success, result = 0 -> fail 
  function UpdateRE(){
    this.select=function(id,result){
      var sql = 'UPDATE Room_result SET result = ' + result + ' where user_id1 = ' + id + ' or user_id2 =' + id;
      pool.query(sql,function(err){
        if(err){console.log(err);}
      });
    };
  }
  module.exports = UpdateRE;
  UpRE = new UpdateRE();

  datas = Array;  
  ChRE.select(function(rdata){
    datas = rdata;

    // the matching hasn't succeeded
    if(datas[0].result!=1){

      // user accept the result
      if(req.body.result=="accept")
      {
        var num;
        if(datas[0].user_id1==userID)
        { otherID = datas[0].user_id2; num = 1; }
        else{ num = 2; otherID = datas[0].user_id1; }

        // matching is successful
        if((datas[0].res1==1 && num==2)||(datas[0].res2==1 && num==1))
          { UpRE.select(userID,1); }
        // waiting for the other one's acceptance
        else{ SiupRE.select(userID,num,1); }
      }

      // user refuse the result
      else{ UpRE.select(userID,0); }

    }
  },userID);
  
});

module.exports = router;