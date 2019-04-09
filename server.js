var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql  = require('mysql');  
var fs = require('fs');
var path = require('path');
var hbs = require('express-hbs');
var config = require('./config').config;

//Test account:1155104321 1155107777 1155223344;zxczxc

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('./public'));

app.engine('hbs', hbs.express4({
  partialsDir   : __dirname +'/views/partials',
  defaultLayout : __dirname +'/views/layouts/default',
  extname       : '.hbs',
  layoutsDir    : __dirname +'/views/layouts',
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// **************************************************
// **************************************************
// the following code is done by 
// programmer: Ryan Garcia Yuxin LI
// date : 21/03/2018
app.use(bodyParser.json());
app.use(urlencodedParser);

let favicon = require('serve-favicon');
app.use(favicon( __dirname + '/keyboarder.ico'));

let cookieParser = require('cookie-parser');
let session = require('express-session');
app.use(cookieParser("CUPar"));
app.use(session({
     secret: 'CUPar is the best', 
     resave: true,  // resave session
     key: 'CUPar deserves an A',  // only for session
     cookie: { maxAge: 2 * 3600 * 1000},  // only for session
     saveUninitialized: false // passport: true, session: false
}));  // so that object req will have a attribute:session representing cookie

let user = require('./controller/user.js');
app.use(user.authenticate);

//invoke  router
// var account = require('./routes/account');
var index =require('./routes/index');
var login = require('./routes/login');
var signup = require('./routes/signup');
var logout = require('./routes/logout');
app.use("/", index);
app.use("/login", login);
app.use('/signup', signup);
app.use('/logout', logout);

// Ryan part ends
// *****************************************************
// *****************************************************


app.use('/Roommate.html',function(req,res){ // Ryan changes Roommate.html to Roommate; back
  if( !req.session.passport ){  // if any problems, call Ryan
    res.redirect('/login');
  }
  var fileName="./Roommate.html";
  fs.readFile(fileName,function(err,data){
      if(err)
          console.log("Sorry, there is a mistake in your Roommate address.");
      else{res.write(data);}
  });
});

app.get('/Roommate', function (req, res) {  // Ryan changes Roommate.html to Roommate
  if( !req.session.passport ){  // if any problems, call Ryan
    res.redirect('/login');
  }
   res.sendFile( __dirname + "/public/" + "Roommate.html" );
});

app.use('/Teammate.html',function(req,res){ // Ryan changes Roommate.html to Roommate; back
  if( !req.session.passport ){  // if any problems, call Ryan
    res.redirect('/login');
  }
  var fileName="./Teammate.html";
  fs.readFile(fileName,function(err,data){
      if(err)
          console.log("Sorry, there is a mistake in your Teammate address.");
      else{res.write(data);}
  });
});

app.get('/Teammate', function (req, res) {  // Ryan changes Roommate.html to Roommate
  if( !req.session.passport ){  // if any problems, call Ryan
    res.redirect('/login');
  }
   res.sendFile( __dirname + "/public/" + "Teammate.html" );
});

app.use('/Post',function(req,res){ // Ryan changes Roommate.html to Roommate
  if( !req.session.passport ){  // if any problems, call Ryan
    res.redirect('/login');
  }
  var fileName="./Post.html";
  fs.readFile(fileName,function(err,data){
      if(err)
          console.log("Sorry, there is a mistake in your Post address.");
      else{res.write(data);}
  });
});

app.get('/Post', function (req, res) {  // Ryan changes Roommate.html to Roommate
  if( !req.session.passport ){  // if any problems, call Ryan
    res.redirect('/login');
  }
   res.sendFile( __dirname + "/public/" + "Post" );
});


// **************************************************
// **************************************************
// the following code is done by 
// programmer: Xiao Tianygi Jack

function link(){
  return(mysql.createPool({     
    host     : 'localhost',       
    user     : config.db_user,              
    password : config.db_pwd,       
    port: '3306',                   
    database: config.db_name,
    useConnectionPooling: true,
    connectionLimit: 500
  }))
}
module.exports=link;

function count(o){
  var n = 0;
  for(var i in o){ n++; }
  return n;
}

///////////////////////////////////////
/////      Input for Roommate     /////
///////////////////////////////////////
app.post('/process_post', urlencodedParser, function (req, res) {
 
  res.redirect("/index"); // Ryan changes  to index
   
  var pool = new link();
  
    var  addSql = 'INSERT INTO Roommate (request_id, user_sid, name, sex, college, hall, sleep_time_start, sleep_time_end, remark,if_matched) VALUES(0,?,?,?,?,?,?,?,?,0)';
    var  addSqlParams = [req.body.SID, req.body.Name, req.body.sex, req.body.College, req.body.Hall, req.body.sleep_start, req.body.sleep_end, req.body.remarks];
    //add
    pool.query(addSql,addSqlParams,function (err, result) {
          if(err){
           console.log('[INSERT ERROR] - ',err.message);
           return; }        
   
         console.log('--------------------------INSERT----------------------------');
         //console.log('INSERT ID:',result.insertId);        
         console.log('INSERT ID:',result);        
         console.log('-----------------------------------------------------------------\n\n');  
    });
   
    console.log(res);
    //res.end(JSON.stringify(res));
});


///////////////////////////////////////
/////      Input for Teammate     /////
///////////////////////////////////////
app.post('/process_teammate', urlencodedParser, function (req, res) {
 
  res.redirect("/index"); // Ryan changes index.html to index
  //MySql
   var pool = new link();
  
   var  addSql = 'INSERT INTO Teammate (request_id, user_sid, name, sex, college, CourseTitle, CourseCode, size, remark, now_size,if_matched) VALUES(0,?,?,?,?,?,?,1,0)';
   var  addSqlParams = [req.body.SID, req.body.Name, req.body.sex, req.body.College, req.body.size, req.body.CourseTitle, req.body.CourseCode, req.body.size, req.body.remarks];
   //add
   pool.query(addSql,addSqlParams,function (err, result) {
         if(err){
          console.log('[INSERT ERROR] - ',err.message);
          return;
        }        
        console.log('--------------------------INSERT----------------------------');
        //console.log('INSERT ID:',result.insertId);        
        console.log('INSERT ID:',result);        
        console.log('-----------------------------------------------------------------\n\n');  
   });
  
   console.log(res);
   //res.end(JSON.stringify(res));
});

/////////////////////////////////
/////      account Page     /////
/////////////////////////////////
app.get('/account_page', urlencodedParser, function (req, res) {
  if( !req.session.passport ){  // if any problems, call Ryan
    res.redirect('/login');
}
  let user_name = req.cookies.islogin.name;// if any problems, call Ryan
  let userID = req.cookies.islogin.sid;    // if any problems, call Ryan
  res.render('account.hbs', {
    layout: null,
    name: user_name,
    sid : userID,
    email: userID + "@link.cuhk.edu.hk",
  });
   //res.end(JSON.stringify(res));
});


///////////////////////////////////////
/////      Match for Roommate     /////
///////////////////////////////////////
app.post('/check_roommate', urlencodedParser, function (req, res) {
   
  var pool = new link();

  function SearchID(){
    this.select=function(callback,id){
      var sql = 'SELECT distinct * FROM Roommate where user_sid = ' + id;
      var option = {};
        pool.query(sql,function(err,result){
        if(err){console.log(err);}
        if(result){
          for(var i = 0; i < result.length; i++)
            {option[i]={'name':result[i].name,'sex':result[i].sex,'college':result[i].college,'hall':result[i].hall,'sid':result[i].user_sid,
              'remark':result[i].remark,'start':result[i].sleep_time_start,'end':result[i].sleep_time_end};}
        }
        callback(option); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
    };
  }
  module.exports = SearchID;

  
  function MatchID(){    
    this.select=function(callback1,datas){
      var sql1 = 'SELECT * FROM Roommate where sex = ? AND college = ? AND hall = ? AND user_sid != ? And if_matched != 1';
      var Params = [datas.sex,datas.college,datas.hall,datas.sid];
      var option1 = {};
      pool.query(sql1,Params,function(err,results){
        if(err){console.log(err);}

        option1[0]={'name':"NO ONE",'sex':null, 'sid':null};
        if(results){
          for(var i = 0; i < results.length; i++)
          {option1[i]={'name':results[i].name,'sex':results[i].sex,'college':results[i].college,'hall':results[i].hall,'sid':results[i].user_sid,
            'remark':results[i].remark,'start':results[i].sleep_time_start,'end':results[i].sleep_time_end};}
        }
        console.log("Inside the function");
        console.log(option1);
        console.log(datas);
        callback1(option1); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
    };
  }
  module.exports = MatchID;

  
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
        callback(option); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
    };
  }
  module.exports = CheckID;


  function SaveID(){
    this.select=function(id1,id2){  
      var sql = 'INSERT INTO Room_result (id,user_id1,user_id2,result) VALUES (0,"'+id1+'","'+id2+'",2)';
      pool.query(sql,function(err){
        if(err){console.log(err);}
      });
    };
  }
  module.exports = SaveID;


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
        callback(option); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
    };
  }
  module.exports = CheckRE;

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
        callback(option); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
    };
  }
  module.exports = ReCheckID;


  var datas = Array;
  var datasC = Array;
  var datas1 = Array;
  var datas2 = Array;
  var SeID = new SearchID();
  var MaID = new MatchID();
  var ChID = new CheckID();
  var RChID = new ReCheckID();
  var SaID = new SaveID();
  

  let userID = req.cookies.islogin.sid; // if any problems, call Ryan
  SeID.select(function (rdataS){
    datas = rdataS;
    ChID.select(function (rdataC){
      datasC = rdataC;

      ////First Check
      if(datasC[0].user_id1=="00000")
      {
        RChID.select(function(rdataR){
          var ban = Array;
          
          for(var i=0;i<count(rdataR);i++){
            if(rdataR[i].user_id1 == userID)
              ban[i] = rdataR[i].user_id2;
            else ban[i] = rdataR[i].user_id1;
          }
          console.log("length of recheck list: " + count(rdataR));

          MaID.select(function(rdataM){
            datas1 = rdataM;
            console.log("First Check");
            console.log('----Search----');
            console.log(datas);
            console.log('----Check----');
            console.log(datasC);
            console.log('----ban----');
            console.log(ban);
            console.log('----Match----');
            console.log(datas1);
  
            //No result
            if(datas1[0].name=="NO ONE"){
              res.redirect("NoRoommate.html");
            }

            //Have resultm - choose the best roommate
            else{
              var len = count(datas1);
              console.log('length:'+len);
              var time = 0;
              var min_time = 10000;
              var st = datas[0].start;
              var ed = datas[0].end;
              var choice;
              for(var i=0 ; i<len ; i++){

                var check = 0;
                for(var j=0; j<count(ban) ; j++){
                  if (ban[j] == datas1[i].sid) {
                    console.log('Ban at '+ban[j] + ' and ' + datas1[i].sid);
                    check = 1;
                    break;
                } }
                if(check==1) continue;
                
                time = Math.min(ed,datas1[i].end) - Math.min(st,datas1[i].start);
                console.log('time: '+time);
                if (time < min_time){
                  min_time = time;
                  choice = datas1[i];
                  console.log('min:'+min_time);
                }
              }
              if(time==0)  {
                console.log("All is banned");
                res.redirect("NoRoommate.html");
              }
              else {
                SaID.select(userID,choice.sid);
                console.log("First Check");
                res.render('YesRoommate.hbs', {
                  layout: null,
                  r_name: choice.name,
                  r_sex: choice.sex,
                  r_sid: choice.sid,
                  r_remark: choice.remark,
                  r_status: "waiting for reply",
                  r_result_id: "(Not prepared yet)"
                });
              }
            }
           },datas[0]);
        },userID);
       }

      ////Not First check
      else{
        var otherID;
        if(datasC[0].user_id1==userID) {otherID = datasC[0].user_id2;}
        else {otherID = datasC[0].user_id1;}

        SeID.select(function(rdataM){
          datas2 = rdataM;
          console.log("Not First Check");
          console.log('----Search----');
          console.log(datas);
          console.log('----Check----');
          console.log(datasC);
          console.log('----Match----');
          console.log(datas2);
          console.log("Not First Check");

          var reply = "waiting for reply";
          var chat = "(Not prepared yet)";
          var dataR = Array;
          //reply ='Temporary';
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
                r_result_id: chat
              });
            },userID);
          }
          else{
            res.render('YesRoommate.hbs', {
              layout: null,
              r_name: datas2[0].name,
              r_sex: datas2[0].sex,
              r_sid: datas2[0].sid,
              r_remark: datas2[0].remark,
              r_status: reply,
              r_result_id: chat
            });
          }
         },otherID);
       }
    },userID);
  },userID);  
  //res.end(JSON.stringify(res));
});



////////////////////////////////////
//////   Result of Roommate   //////
////////////////////////////////////
app.post('/result_roommate', urlencodedParser, function (req, res) {

  res.redirect("/index");
  let userID = req.cookies.islogin.sid; 

  var pool = new link();

  function CheckRE(){
    //var connect = new link(); connect.connect();
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
        callback(option); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
    };
    //this.end = function(){connect.end();}
  }
  module.exports = CheckRE;
  ChRE = new CheckRE();


  function SimpleUpdateRE(){
    //var connect = new link();connect.connect();
    this.select=function(id,number,result){
      var sql = 'UPDATE Room_result SET res' + number + ' = ' + result + ' where user_id1 = ' + id + ' or user_id2 =' + id;
      pool.query(sql,function(err){
        if(err){console.log(err);}
      });
    };
    //this.end = function(){connect.end();};
  }
  module.exports = SimpleUpdateRE;
  SiupRE = new SimpleUpdateRE();
  

  function UpdateRE(){
    //var connect = new link();connect.connect();
    this.select=function(id,result){
      var sql = 'UPDATE Room_result SET result = ' + result + ' where user_id1 = ' + id + ' or user_id2 =' + id;
      pool.query(sql,function(err){
        if(err){console.log(err);}
      });
    };
    //this.end = function(){connect.end();};
  }
  module.exports = UpdateRE;
  UpRE = new UpdateRE();


  function UpdateID(){
    //var connect = new link();connect.connect();
    this.select=function(id){
      var sql = 'UPDATE Roommate SET if_matched = 1 where user_sid = ' + id ;
      pool.query(sql,function(err){if(err){console.log(err);}});
    };
    //this.end = function(){connect.end();};
  }
  module.exports = UpdateID;
  UpID1 = new UpdateID();
  UpID2 = new UpdateID();

  datas = Array;
  if(req.body.result=="accept")
  {
    ChRE.select(function(rdata){
      datas = rdata;
      var otherID;
      var num;
      if(datas[0].user_id1==userID){
        otherID = datas[0].user_id2;
        num = 1;
      }
      else{
        num = 2;
        otherID = datas[0].user_id1;
      }

      if((datas[0].res1==1 && num==2)||(datas[0].res2==1 && num==1))
      {//////REAL SUCCESS
        UpRE.select(userID,1);
        UpID1.select(userID);
        UpID2.select(otherID);
        console.log("-----Real Sucess-----");
      }
      else{
        console.log("-----First accept-----");
        SiupRE.select(userID,num,1);
      }

    },userID);
  }
  else{
    console.log("-----Refuse-----");
    UpRE.select(userID,0);
  }
});




////////////////////////////////////
//////   March for Teammate   //////
////////////////////////////////////
app.post('/check_teammate', urlencodedParser, function (req, res) {
  //MySql
  var pool = new link();
  
  function SearchID(){
    this.select=function(callback,id){
      var  sql = 'SELECT distinct * FROM Teammate where user_sid = ' + id;
      var option = {};
      pool.query(sql,function(err,result){
        if(err){console.log(err);}
        if(result){
          for(var i = 0; i < result.length; i++)
            {option[i]={'CourseTitle':result[i].CourseTitle,'CourseCode':result[i].CourseCode,
              'Size':result[i].Size,'sid':result[i].user_sid,'college':result[i].college,'sex':result[i].sex,'remark':result[i].remark,'name':result[i].name};}
        }
        callback(option); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
    };
  }
  module.exports = SearchID;
 
  /*
  function MatchID(){    
    this.select=function(callback1){
      var  sql1 = 'SELECT distinct * FROM Teammate where CourseCode = ? AND CourseTitle = ? AND user_sid != ?';
      var thedata = datas[0];
      var  Params = [thedata.CourseCode,thedata.CourseTitle,thedata.sid];
      var option1 = {};
      pool.query(sql1,Params,function(err,results){
        if(err){console.log(err);}
        for(var j = 0; j < thedata.Size; j++)
          {option1[j]={'name':"NO ONE",'sex':null, 'sid':null};}
        if(results){
          for(var i = 0; i < results.length; i++)
          {option1[i]={'CourseTitle':results[i].CourseTitle,'CourseCode':results[i].CourseCode,
              'Size':results[i].Size,'sid':results[i].user_sid,'college':results[i].college,'sex':results[i].sex};}
        }
        callback1(option1); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
    };
  }
  module.exports = MatchID;
  */


  function CheckID(){
    this.select=function(callback,id,adata){
      var sql = 'SELECT * FROM team_result where (user1 = ? or user2 = ? or user3 = ? or user4 = ? or user5 = ? or user6 = ?) AND CourseTitle = ? AND CourseCode = ? AND result != 0';
      var param = [id,id,id,id,id,id,adata.CourseTitle,adata.CourseCode];
      var option = {};  
      pool.query(sql,param,function(err,result){
        if(err){console.log(err);}
        option[0]={'user1':"00000",'user2':null,'result':null};
        if(result){
          for(var i = 0; i < result.length; i++)
            {option[i]={'user1':result[i].user1,'user2':result[i].user2,'user3':result[i].user3,'user4':result[i].user4,'user5':result[i].user5,
            'user6':result[i].user6,'result':result[i].result,'now_size':result[i].now_size,'Size':result[i].Size,'team_id':result[i].team_id};}
        }
        callback(option); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
    };
  }
  module.exports = CheckID;


  function ReCheckID(){
    this.select=function(callback,adata){
      var sql = 'SELECT * FROM team_result where  CourseTitle = ? AND CourseCode = ? AND result != 0 AND now_size != ?';
      var param = [adata.CourseTitle,adata.CourseCode,adata.Size];
      var option = {};  
      pool.query(sql,param,function(err,result){
        if(err){console.log(err);}
        option[0]={'user1':"00000",'user2':null,'result':null};
        if(result){
          for(var i = 0; i < result.length; i++)
            {option[i]={'team_id':result[i].team_id,'user1':result[i].user1,'user2':result[i].user2,'user3':result[i].user3,'user4':result[i].user4,'user5':result[i].user5,
            'user6':result[i].user6,'result':result[i].result,'now_size':result[i].now_size};}
        }
        callback(option); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
    };
  }
  module.exports = ReCheckID;


  function FirstSaveID(){
    this.select=function(userid,adata){
      var sql = 'INSERT INTO team_result (team_id, user1, CourseTitle, CourseCode, Size,now_size,result) VALUES (0,?,?,?,?,1,2)';
      var param = [userid, adata.CourseTitle, adata.CourseCode, adata.Size];
      pool.query(sql,param,function(err){
        if(err){console.log(err);}
      });
    };
  }
  module.exports = FirstSaveID;


  function UpdateID(){
    this.select=function(num,user_id,team_id){  
      var sql = 'UPDATE team_result SET user? = ? ,now_size = ? where team_id = ?';
      var param = [num+1,user_id,num+1,team_id];
      pool.query(sql,param,function(err){
        if(err){console.log(err);}
        console.log('Update');
      });
    };
  }
  module.exports = UpdateID;

  /*
  function UpdateRE(){
    this.select=function(result,team_id){  
      var sql = 'UPDATE team_result SET result = '+result+'where team_id = '+team_id;
      pool.query(sql,function(err){
        if(err){console.log(err);}
      });
    };
  }
  module.exports = UpdateRE;
  */

  var SeID = new SearchID();
  //var MaID = new MatchID();
  var ChID = new CheckID();
  var RchID = new ReCheckID();
  var FsID = new FirstSaveID();
  var UpID = new UpdateID();
  //var UpRE = new UpdateRE();

 
  var datas = Array;
  var datasC = Array;
  var datasR = Array;
  
  let userID = req.cookies.islogin.sid; // if any problems, call Ryan

  function YesRender(number,team,team_id){
    console.log(team);
    console.log(number);
    console.log(team_id);
    switch(number){
      case(1):
      res.render('YesTeammate.hbs', {
        layout: null,
        r_chat_id: team_id + 500,
        r_name1: team[0][0].name,
        r_sex1: team[0][0].sex,
        r_sid1: team[0][0].sid,
        r_remark1: team[0][0].remark,
      });
    break;
      case(2):
        res.render('YesTeammate.hbs', {
          layout: null,
          r_chat_id: team_id + 500,
          r_name1: team[0][0].name,
          r_sex1: team[0][0].sex,
          r_sid1: team[0][0].sid,
          r_remark1: team[0][0].remark,
          r_name2: team[1][0].name,
          r_sex2: team[1][0].sex,
          r_sid2: team[1][0].sid,
          r_remark2: team[1][0].remark,
        });
      break;
      case(3):
        res.render('YesTeammate.hbs', {
          layout: null,
          r_chat_id: team_id + 500,
          r_name1: team[0][0].name,
          r_sex1: team[0][0].sex,
          r_sid1: team[0][0].sid,
          r_remark1: team[0][0].remark,
          r_name2: team[1][0].name,
          r_sex2: team[1][0].sex,
          r_sid2: team[1][0].sid,
          r_remark2: team[1][0].remark,
          r_name3: team[2][0].name,
          r_sex3: team[2][0].sex,
          r_sid3: team[2][0].sid,
          r_remark3: team[2][0].remark,
        });
      break;
      case(4):
        res.render('YesTeammate.hbs', {
          layout: null,
          r_chat_id: team_id + 500,
          r_name1: team[0][0].name,
          r_sex1: team[0][0].sex,
          r_sid1: team[0][0].sid,
          r_remark1: team[0][0].remark,
          r_name2: team[1][0].name,
          r_sex2: team[1][0].sex,
          r_sid2: team[1][0].sid,
          r_remark2: team[1][0].remark,
          r_name3: team[2][0].name,
          r_sex3: team[2][0].sex,
          r_sid3: team[2][0].sid,
          r_remark3: team[2][0].remark,
          r_name4: team[3][0].name,
          r_sex4: team[3][0].sex,
          r_sid4: team[3][0].sid,
          r_remark4: team[3][0].remark,
        });
      break;
      case(5):
        res.render('YesTeammate.hbs', {
          layout: null,
          r_chat_id: team_id + 500,
          r_name1: team[0][0].name,
          r_sex1: team[0][0].sex,
          r_sid1: team[0][0].sid,
          r_remark1: team[0][0].remark,
          r_name2: team[1][0].name,
          r_sex2: team[1][0].sex,
          r_sid2: team[1][0].sid,
          r_remark2: team[1][0].remark,
          r_name3: team[2][0].name,
          r_sex3: team[2][0].sex,
          r_sid3: team[2][0].sid,
          r_remark3: team[2][0].remark,
          r_name4: team[3][0].name,
          r_sex4: team[3][0].sex,
          r_sid4: team[3][0].sid,
          r_remark4: team[3][0].remark,
          r_name5: team[4][0].name,
          r_sex5: team[4][0].sex,
          r_sid5: team[4][0].sid,
          r_remark5: team[4][0].remark
        });
      break;
    }
  } 
  
  var team = Array;
  SeID.select(function (rdata){
    datas = rdata;
   
    ChID.select(function(rdataM){
      datasC = rdataM;
      if(datasC[0].user1=='00000'){
        //First Check for user_now
        console.log("First Check");
        RchID.select(function(rdataR){
          datasR = rdataR;
          if(datasR[0].user1=='00000'){
            //No relative team_result
            FsID.select(userID,datas[0]);
            res.redirect("NoTeammate.html");
          }
          else{
            //already incomplete team_result there
            //Let user join the first team
            //  Which is datasR[0]
            UpID.select(datasR[0].now_size,userID,datasR[0].team_id);
            if(datasR[0].now_size+1!=datas[0].Size){
              res.redirect("NoTeammate.html");
            }
            else{
              console.log("complete");
              //The team become complete and user_now is the last one to join the team
              //var team = Array;
            
              var now = datasR[0].now_size;
              var chat_id = datasR[0].team_id;
              /*
              for(var i=0;i<now;i++){
                team[i].name = null;
                team[i].sex = null;
                team[i].sid = null;
                team[i].remark = null;
              }
              */
              if(now==1){
                SeID.select(function(rdata_t1){
                  team[0]=rdata_t1;
                  YesRender(now,team,chat_id);
                },datasR[0].user1);
              }
              if(now==2){
                SeID.select(function(rdata_t1){
                  team[0]=rdata_t1;
                  SeID.select(function(rdata_t2){
                    team[1]=rdata_t2;
                    YesRender(now,team,chat_id);
                  },datasR[0].user2);
                },datasR[0].user1);
              }
              if(now==3){
                SeID.select(function(rdata_t1){
                  team[0]=rdata_t1;
                  SeID.select(function(rdata_t2){
                    team[1]=rdata_t2;
                    SeID.select(function(rdata_t3){
                      team[2]=rdata_t3;
                      YesRender(now,team,chat_id);
                    },datasR[0].user3);
                  },datasR[0].user2);
                },datasR[0].user1);
              }
              if(now==4){
                SeID.select(function(rdata_t1){
                  team[0]=rdata_t1;
                  SeID.select(function(rdata_t2){
                    team[1]=rdata_t2;
                    SeID.select(function(rdata_t3){
                      team[2]=rdata_t3;
                      SeID.select(function(rdata_t4){
                        team[3]=rdata_t4;
                        YesRender(now,team,chat_id);
                      },datasR[0].user4);
                    },datasR[0].user3);
                  },datasR[0].user2);
                },datasR[0].user1);
              }
              if(now==5){
                SeID.select(function(rdata_t1){
                  team[0]=rdata_t1;
                  SeID.select(function(rdata_t2){
                    team[1]=rdata_t2;
                    SeID.select(function(rdata_t3){
                      team[2]=rdata_t3;
                      SeID.select(function(rdata_t4){
                        team[3]=rdata_t4;
                        SeID.select(function(rdata_t5){
                          team[4]=rdata_t5;
                          YesRender(now,team,chat_id);
                        },datasR[0].user5);
                      },datasR[0].user4);
                    },datasR[0].user3);
                  },datasR[0].user2);
                },datasR[0].user1);
              }
            }
          }
        },datas[0]);
      }
      else{
        //user already in a team
        console.log("already in");
        if(datasC[0].now_size==datasC[0].Size){
          console.log("complete");
          //The team become complete and user_now is the last one to join the team
          //   datasC[0] is the team
          var now = datasC[0].Size - 1;
          var a = [0,1,2,3,4,5,6];
          var sids = Array;
          var chat_id = datasC[0].team_id;
          for(var i=0;i<now+1;i++){
            if(i==0) sids[i] = datasC[0].user1;
            if(i==1) sids[i] = datasC[0].user2;
            if(i==2) sids[i] = datasC[0].user3;
            if(i==3) sids[i] = datasC[0].user4;
            if(i==4) sids[i] = datasC[0].user5;
            if(i==5) sids[i] = datasC[0].user6;
          }
          for(var j=0;j<now+1;j++){
            if(sids[j]==userID){
              a.splice(j,1);
              break;
            }
          }
          /*
          for(var i=0;i<now;i++){
            team[i].name = null;
            team[i].sex = null;
            team[i].sid = null;
            team[i].remark = null;
          }
          */
          if(now==1){
            SeID.select(function(rdata_t1){
              team[0]=rdata_t1;
              YesRender(now,team,datasC[0].team_id);
            },sids[a[0]]);
          }
          if(now==2){
            SeID.select(function(rdata_t1){
              team[0]=rdata_t1;
              SeID.select(function(rdata_t2){
                team[1]=rdata_t2;
                YesRender(now,team,datasC[0].team_id);
              },sids[a[1]]);
            },sids[a[0]]);
          }
          if(now==3){
            SeID.select(function(rdata_t1){
              team[0]=rdata_t1;
              SeID.select(function(rdata_t2){
                team[1]=rdata_t2;
                SeID.select(function(rdata_t3){
                  team[2]=rdata_t3;
                  YesRender(now,team,datasC[0].team_id);
                },sids[a[2]]);
              },sids[a[1]]);
            },sids[a[0]]);
          }
          if(now==4){
            SeID.select(function(rdata_t1){
              team[0]=rdata_t1;
              SeID.select(function(rdata_t2){
                team[1]=rdata_t2;
                SeID.select(function(rdata_t3){
                  team[2]=rdata_t3;
                  SeID.select(function(rdata_t4){
                    team[3]=rdata_t4;
                    YesRender(now,team,datasC[0].team_id);
                  },sids[a[3]]);
                },sids[a[2]]);
              },sids[a[1]]);
            },sids[a[0]]);
          }
          if(now==5){
            SeID.select(function(rdata_t1){
              team[0]=rdata_t1;
              SeID.select(function(rdata_t2){
                team[1]=rdata_t2;
                SeID.select(function(rdata_t3){
                  team[2]=rdata_t3;
                  SeID.select(function(rdata_t4){
                    team[3]=rdata_t4;
                    SeID.select(function(rdata_t5){
                      team[4]=rdata_t5;
                      YesRender(now,team,datasC[0].team_id);
                    },sids[a[4]]);
                  },sids[a[3]]);
                },sids[a[2]]);
              },sids[a[1]]);
            },sids[a[0]]);
          }
        }
        else{console.log("not complete");res.redirect("NoTeammate.html");}
      }
    },userID,datas[0]);

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    /*
    MaID.select(function(rdata1){
      
      dom1 = rdata1;
      console.log('----Search----');
      console.log(datas);
      console.log('----Match----');
      console.log(dom1);
      
      asize = datas[0].Size-1;
      console.log(asize);
    
      if(dom1[asize-1].name=="NO ONE"){
        res.redirect("NoTeammate");
      }
      else if(asize==2){res.render('YesTeammate', {
        layout: null,
        r_name1: dom1[0].name,
        r_sex1: dom1[0].sex,
        r_sid1: dom1[0].sid
        });
      }
      else if(asize==3){res.render('YesTeammate', {
        layout: null,
        r_name1: dom1[0].name,
        r_sex1: dom1[0].sex,
        r_sid1: dom1[0].sid,
        r_name2: dom1[1].name,
        r_sex2: dom1[1].sex,
        r_sid2: dom1[1].sid
        });
       }
       else if(asize==4){res.render('YesTeammate', {
        layout: null,
        r_name1: dom1[0].name,
        r_sex1: dom1[0].sex,
        r_sid1: dom1[0].sid,
        r_name2: dom1[1].name,
        r_sex2: dom1[1].sex,
        r_sid2: dom1[1].sid,
        r_name3: dom1[2].name,
        r_sex3: dom1[2].sex,
        r_sid3: dom1[2].sid
        });
       }
       else if(asize==5){res.render('YesTeammate', {
        layout: null,
        r_name1: dom1[0].name,
        r_sex1: dom1[0].sex,
        r_sid1: dom1[0].sid,
        r_name2: dom1[1].name,
        r_sex2: dom1[1].sex,
        r_sid2: dom1[1].sid,
        r_name3: dom1[2].name,
        r_sex3: dom1[2].sex,
        r_sid3: dom1[2].sid,
        r_name4: dom1[3].name,
        r_sex4: dom1[3].sex,
        r_sid4: dom1[3].sid
        });
       }
       else if(asize==6){
         res.render('YesTeammate', {
          layout: null,
          r_name1: dom1[0].name,
          r_sex1: dom1[0].sex,
          r_sid1: dom1[0].sid,
          r_name2: dom1[1].name,
          r_sex2: dom1[1].sex,
          r_sid2: dom1[1].sid,
          r_name3: dom1[2].name,
          r_sex3: dom1[2].sex,
          r_sid3: dom1[2].sid,
          r_name4: dom1[3].name,
          r_sex4: dom1[3].sex,
          r_sid4: dom1[3].sid,
          r_name5: dom1[4].name,
          r_sex5: dom1[4].sex,
          r_sid5: dom1[4].sid
        });
       }
      });
      */
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

  },userID);
  
  //connection.end();
  console.log(res);
  //res.end(JSON.stringify(res));
});

//Jack part ends
//***************************
//***************************

var post = require('./routes/post');
app.use('/post',post);

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Adress is http://%s:%s", host, port);
});
