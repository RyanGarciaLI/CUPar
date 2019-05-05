/**
 *  /router/check_roommate.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Xiao Tianyi (Jack) <jack123qd@hotmail.com>
 *  @version: 1.0
 *  @since 2019-03-19
 *  @last updated: 2019-04-22
 */
`
 A router handles the request of checking the result of matching roommates.
 You need to click the button in account page to check the matching result
 of your roommate. And then you will see the name and SID and other relative
 information of your roommates.
 The specific urls and revelant request the router can handle is following:
           URL          |       Request
    --------------------|-------------------
       /check_roommate  |        POST
    ----------------------------------------
In fact, the matching for roommates are started when user click the 'check roommate'
button. By the way, item 'if_matched' in table 'roommate' is not very useful, since
now we use a new table 'room_result' to store the result, and use function CheckID,
RecheckID and CheckRE to check the result.
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

// function to calculate the length of a given object
function count(o){
  var n = 0;
  for(var i in o){ n++; }
  return n;
}

// the main function
router.post('/', function (req, res) {
  var pool = new link();

  // the function to search the information with given SID
  function SearchID(){
    this.select=function(callback,id){
      var sql = 'SELECT distinct * FROM Roommate where user_sid = ' + id;
      var option = {};
        pool.query(sql,function(err,result){
        if(err){console.log(err);}
        // default value for result
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

  // the function to filter the data with given necessary info: sex, college and Hall
  function MatchID(){    
    this.select=function(callback1,datas){
      // Besides the same sex, college and hall, it also needed to be assured that it's not the same person
      var sql1 = 'SELECT * FROM Roommate where sex = ? AND college = ? AND hall = ? AND user_sid != ? And if_matched != 1';
      var Params = [datas.sex,datas.college,datas.hall,datas.sid];
      var option1 = {};
      pool.query(sql1,Params,function(err,results){
        if(err){console.log(err);}
        // default result
        option1[0]={'name':"NO ONE",'sex':null, 'sid':null};
        if(results){
          for(var i = 0; i < results.length; i++)
          {option1[i]={'name':results[i].name,'sex':results[i].sex,'college':results[i].college,'hall':results[i].hall,'sid':results[i].user_sid,
            'remark':results[i].remark,'start':results[i].sleep_time_start,'end':results[i].sleep_time_end};}
        }
        // If return directly, it will return undefined. So we need call back function to receive the data.
        callback1(option1); 
      });
    };
  }
  module.exports = MatchID;

  // check if the user is matched and succeed or the matching hasn't been done with given sid
  function CheckID(){
    this.select=function(callback,id){
      var sql = 'SELECT * FROM Room_result where (user_id1 = ' + id + ' or user_id2 =' + id +' ) AND result != 0';
      var option = {};  
      pool.query(sql,function(err,result){
        if(err){console.log(err);}
        option[0]={'user_id1':"00000",'user_id2':null,'result':null};
        if(result){
          for(var i = 0; i < result.length; i++)
            {option[i]={'user_id1':result[i].user_id1,'user_id2':result[i].user_id2,'result':result[i].result};}
        }
        // If return directly, it will return undefined. So we need call back function to receive the data.
        callback(option); 
      });
    };
  }
  module.exports = CheckID;

  // insert the matching result into database
  function SaveID(){
    this.select=function(id1,id2){  
      var sql = 'INSERT INTO Room_result (id,user_id1,user_id2,result) VALUES (0,"'+id1+'","'+id2+'",2)';
      pool.query(sql,function(err){
        if(err){console.log(err);}
      });
    };
  }
  module.exports = SaveID;

   // check if the user was matched before with given sid
  function CheckRE(){
    this.select=function(callback,id){
      var sql = 'SELECT * FROM Room_result where user_id1 = ' + id + ' or user_id2 =' + id;
      var option = {};  
      pool.query(sql,function(err,result){
        if(err){console.log(err);}
        option[0]={'user_id1':"00000",'user_id2':null};
        if(result){
          for(var i = 0; i < result.length; i++)
            {option[i]={'id':result[i].id,'res1':result[i].res1,'res2':result[i].res2,'user_id1':result[i].user_id1,'user_id2':result[i].user_id2};}
        }
        // If return directly, it will return undefined. So we need call back function to receive the data.
        callback(option); 
      });
    };
  }
  module.exports = CheckRE;
  
  // check if the user was matched but failed with given sid
  function ReCheckID(){
    this.select=function(callback,id){
      var sql = 'SELECT * FROM Room_result where (user_id1 = ' + id + ' or user_id2 = ' + id + ' ) AND result = 0';
      var option = {};  
      pool.query(sql,function(err,result){
        if(err){console.log(err);}
        option[0]={'user_id1':"00000",'user_id2':null};
        if(result){
          for(var i = 0; i < result.length; i++)
            {option[i]={'id':result[i].id,'res1':result[i].res1,'res2':result[i].res2,'user_id1':result[i].user_id1,'user_id2':result[i].user_id2};}
        }
         // If return directly, it will return undefined. So we need call back function to receive the data.
        callback(option);
      });
    };
  }
  module.exports = ReCheckID;

  // initial variables and get the module
  var datas = Array;
  var datasC = Array;
  var datas1 = Array;
  var datas2 = Array;
  var SeID = new SearchID();
  var MaID = new MatchID();
  var ChID = new CheckID();
  var RChID = new ReCheckID();
  var SaID = new SaveID();
  

  let userID = req.cookies.islogin.sid;
  SeID.select(function (rdataS){
    datas = rdataS;

    // the user has filled his/her information
    if(datas[0].name!="NO ONE"){
    
      // check the reault
      ChID.select(function (rdataC){
        datasC = rdataC;

        // no result in 'room_result'
        if(datasC[0].user_id1=="00000")
        {
          // make sure the failed matching won't occur again
          RChID.select(function(rdataR){
            
            // get the ban list
            var ban = Array;
            for(var i=0;i<count(rdataR);i++){
              if(rdataR[i].user_id1 == userID)
                ban[i] = rdataR[i].user_id2;
              else ban[i] = rdataR[i].user_id1;
            }
            
            // match the roommmate
            MaID.select(function(rdataM){
              datas1 = rdataM;
              
              // No result
              if(datas1[0].name=="NO ONE"){
                res.render('NoRoommate.hbs',{
                  username: req.cookies.islogin.name,
                  login: 1
                });
              }

              // have result: choose the best roommate
              else{
                var len = count(datas1);
                var time = 0;
                var min_time = 10000;
                var st = datas[0].start;
                var ed = datas[0].end;
                var choice;

                for(var i=0 ; i<len ; i++){
                  var check = 0;
                  for(var j=0; j<count(ban) ; j++){
                    if (ban[j] == datas1[i].sid) {
                      check = 1;
                      break;
                    }
                  }
                  if(check==1) continue;
                  time = Math.min(ed,datas1[i].end) - Math.min(st,datas1[i].start);
                  if (time < min_time){
                    min_time = time;
                    choice = datas1[i];
                  }
                }

                if(time==0)  {
                  // All possible roommates are banned
                  res.render('NoRoommate.hbs',{
                    username: req.cookies.islogin.name,
                    login: 1
                  });
                }
                else {
                  // save the matching result and render the hbs document
                  SaID.select(userID,choice.sid);
                  res.render('YesRoommate.hbs', {
                    layout: null,
                    r_name: choice.name,
                    r_sex: choice.sex,
                    r_sid: choice.sid,
                    r_remark: choice.remark,
                    r_status: "waiting for reply",
                    r_result_id: "(Not prepared yet)",
                    username: req.cookies.islogin.name,
                    login: 1
                  });
                }
              }
              },datas[0]);
          },userID);
        }

        // there is already a matching result
        else{
          
          // get the other one's SID
          var otherID;
          if(datasC[0].user_id1==userID) {otherID = datasC[0].user_id2;}
          else {otherID = datasC[0].user_id1;}

          SeID.select(function(rdataM){
            datas2 = rdataM;
            
            var reply = "waiting for reply";
            var chat = "(Not prepared yet)";
            var dataR = Array;

            // the matching is already successful
            if (datasC[0].result=='1'){
              reply = "Success!";
              var ChRE = new CheckRE();
              ChRE.select(function(rdata){
                dataR = rdata;
                chat = dataR[0].id;
                res.render('YesRoommate.hbs', {
                  layout: null,
                  r_name: datas2[0].name,
                  r_sex: datas2[0].sex,
                  r_sid: datas2[0].sid,
                  r_remark: datas2[0].remark,
                  r_status: reply,
                  r_result_id: chat,
                  username: req.cookies.islogin.name,
                  login: 1
                });
              },userID);
            }

            // the matching hasn't been done
            else{
              res.render('YesRoommate.hbs', {
                layout: null,
                r_name: datas2[0].name,
                r_sex: datas2[0].sex,
                r_sid: datas2[0].sid,
                r_remark: datas2[0].remark,
                r_status: reply,
                r_result_id: chat,
                username: req.cookies.islogin.name,
                login: 1
              });
            }

          },otherID);
        }

      },userID);
  
    }
    
    // the user hasn't filled his/her information
    else {
      res.render('NoRoommate.hbs',{
      username: req.cookies.islogin.name,
      login: 1
    });}

  },userID);  
  
});

module.exports = router;