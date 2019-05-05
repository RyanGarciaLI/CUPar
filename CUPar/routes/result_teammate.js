/**
 *  /router/result_teammate.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Xiao Tianyi (Jack) <jack123qd@hotmail.com>
 *  @version: 1.0
 *  @since 2019-03-19
 *  @last updated: 2019-04-22
 */
`
 A router handles the request of accepting or refusing the result of matching 
 teammates. You need to click the button after you see the result of matching
 teammates . 
 The specific urls and revelant request the router can handle is following:
           URL          |       Request
    --------------------|-------------------
      /result_teammate  |        POST
    ----------------------------------------
If user refuse the result, the whole match will fail and system would start
a new match for everyone in this team, and this refusion can't be reversed.
If every teammates accept the result, then the matching is successful and no
one can change it. However before every accept the result, user can still 
refuse the result even he/she has accepted.
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

  // the function to check team_result with given id and team_id
  function CheckRE(){
    this.select=function(callback,id,team_id){
      var sql = 'SELECT * FROM team_result where (user1 = ? or user2 = ? or user3 = ? or user4 = ? or user5 = ? or user6 = ?) AND team_id = ?  AND result != 0';
      var params = [id,id,id,id,id,id,team_id];
      var option = {};  
      pool.query(sql,params,function(err,result){
        if(err){console.log(err);}
        // default result
        option[0]={'user_id1':"00000",'user_id2':null};
        if(result){
          for(var i = 0; i < result.length; i++)
          {option[i]={'user1':result[i].user1,'user2':result[i].user2,'user3':result[i].user3,'user4':result[i].user4,'user5':result[i].user5,
          'user6':result[i].user6,'result':result[i].result,'now_size':result[i].now_size,'Size':result[i].Size,'team_id':result[i].team_id,'agree_number':result[i].agree_number};}
        }
        // If return directly, it will return undefined. So we need call back function to receive the data.
        callback(option);
      });
    };
  }
  module.exports = CheckRE;
  ChRE = new CheckRE();

  // update the agree_number in team_result, which record the acceptance of the whole team
  function UpdateNumber(){
    this.select=function(team_id,number){
      var sql = 'UPDATE team_result SET agree_number = ' + number + ' where team_id = ' + team_id;
      pool.query(sql,function(err){
        if(err){console.log(err);}
      });
    };
  }
  module.exports = UpdateNumber;
  UpNum = new UpdateNumber();
  
 // update the tean_result if the one teammate refuse the result or all of them accept it
  function UpdateRE(){
    this.select=function(team_id,result){
      var sql = 'UPDATE team_result SET result = ' + result + ' where team_id = ' + team_id;
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
    var code = datas[0].agree_number;

    // check the position of the user in his/her team
    var position;
    if(datas[0].user1==userID)
      position = 0;
    else if(datas[0].user2==userID)
      position = 1;
    else if(datas[0].user3==userID)
      position = 2;
    else if(datas[0].user4==userID)
      position = 3;
    else if(datas[0].user5==userID)
      position = 4;
    else if(datas[0].user6==userID)
      position = 5;

    // calculate the number represent the success of matching
    var end_num = 0;
    for(var i=0;i<datas[0].Size;i++){
      end_num += Math.pow(10,i);
    }

    // the matching hasn't been done
    if(code!=end_num){
      
      // if the user's reply is accept, calculate the new agree_number and update the database
      if(req.body.result=="accept"){
        if((code % Math.pow(10,position+1)) < Math.pow(10,position)){ // check if the user has accepted the result before
          UpNum.select(req.body.team_id,code+Math.pow(10,position));
          if(code+Math.pow(10,position)==end_num){ // the matching is sucessful after this acceptance
            UpRE.select(req.body.team_id,1);
          }
        }
      }

      // the user refuse the result
      else{ UpRE.select(team_id,0); }
    }
    // if the matching is already sucessful, there is nothing should be done
  },userID,req.body.team_id);
});

module.exports = router;