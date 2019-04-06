var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql  = require('mysql');  
var fs = require('fs');
var path = require('path');
var hbs = require('express-hbs');

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


// app.use('/index.html',function(req,res){
//   var fileName="./index.html";
//   fs.readFile(fileName,function(err,data){
//       if(err)
//           console.log("Sorry, there is a mistake in your address.");
//       else{res.write(data);}
//   });
// });

app.use('/Roommate',function(req,res){
  if( !req.session.passport ){ // if any problems, call Ryan
    res.redirect('/login');
}
  var fileName="./Roommate.html";
  fs.readFile(fileName,function(err,data){
      if(err)
          console.log("Sorry, there is a mistake in your address.");
      else{res.write(data);}
  });
});

app.get('/Roommate', function (req, res) {
    if( !req.session.passport ){  // if any problems, call Ryan
      res.redirect('/login');
    }
   res.sendFile( __dirname + "/" + "Roommate.html" );
});

//Store data into MySql
app.post('/process_post', urlencodedParser, function (req, res) {
 
   res.redirect("/index");
   //MySql
    var connection = mysql.createConnection({     
        host     : 'localhost',       
        user     : 'root',              
        password : 'jack1998',       
        port: '3306',                   
        database: 'cup' 
      }); 
   
    connection.connect();
  
    var  addSql = 'INSERT INTO Roommate (request_id, user_sid, name, sex, college, hall, sleep_time_start, sleep_time_end, remark) VALUES(0,?,?,?,?,?,?,?,?)';
    var  addSqlParams = [req.body.SID, req.body.Name, req.body.sex, req.body.College, req.body.Hall, req.body.sleep_start, req.body.sleep_end, req.body.remarks];
    //add
    connection.query(addSql,addSqlParams,function (err, result) {
          if(err){
           console.log('[INSERT ERROR] - ',err.message);
           return; }        
   
         console.log('--------------------------INSERT----------------------------');
         //console.log('INSERT ID:',result.insertId);        
         console.log('INSERT ID:',result);        
         console.log('-----------------------------------------------------------------\n\n');  
    });
   
    connection.end();

    console.log(res);
    //res.end(JSON.stringify(res));
});




app.post('/process_teammate', urlencodedParser, function (req, res) {
 
  res.redirect("/index");
  //MySql
   var connection = mysql.createConnection({     
       host     : 'localhost',       
       user     : 'root',              
       password : 'jack1998',       
       port: '3306',                   
       database: 'cup' 
     }); 
  
   connection.connect();
 
   var  addSql = 'INSERT INTO Teammate (request_id, user_sid, name, sex, college, hall, sleep_time_start, sleep_time_end, remark) VALUES(0,?,?,?,?,?,?,?,?)';
   var  addSqlParams = [req.body.SID, req.body.Name, req.body.sex, req.body.College, req.body.Hall, req.body.sleep_start, req.body.sleep_end, req.body.remarks];
   //add
   connection.query(addSql,addSqlParams,function (err, result) {
         if(err){
          console.log('[INSERT ERROR] - ',err.message);
          return; }        
  
        console.log('--------------------------INSERT----------------------------');
        //console.log('INSERT ID:',result.insertId);        
        console.log('INSERT ID:',result);        
        console.log('-----------------------------------------------------------------\n\n');  
   });
  
   connection.end();

   console.log(res);
   //res.end(JSON.stringify(res));
});



app.get('/account_page', urlencodedParser, function (req, res) {
  if( !req.session.passport ){  // if any problems, call Ryan
    res.redirect('/login');
}
  let user_name = req.cookies.islogin.name;// if any problems, call Ryan
  let userID = req.cookies.islogin.sid;    // if any problems, call Ryan
  res.render('account', {
    layout: null,
    name: user_name,
    sid : userID,
    email: userID + "@link.cuhk.edu.hk",
  });
   //res.end(JSON.stringify(res));
});

// MATCH
app.post('/check_roommate', urlencodedParser, function (req, res) {

  //MySql
  var connection = mysql.createConnection({     
       host     : 'localhost',       
       user     : 'root',              
       password : 'jack1998',       
       port: '3306',                   
       database: 'cup',
       useConnectionPooling: true
  }); 
  connection.connect(); 

  var connection1 = mysql.createConnection({     
    host     : 'localhost',       
    user     : 'root',              
    password : 'jack1998',       
    port: '3306',                   
    database: 'cup',
    useConnectionPooling: true
  }); 

  function SearchID(){
    this.select=function(callback,id){
      var  sql = 'SELECT distinct * FROM Roommate where user_sid = ' + id;
      var option = {};
      connection.query(sql,function(err,result){
        if(err){console.log(err);}
        if(result){
          for(var i = 0; i < result.length; i++)
            {option[i]={'sex':result[i].sex,'college':result[i].college,'hall':result[i].hall,'sid':result[i].user_sid};}
        }
        callback(option); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
    };
  }
  module.exports = SearchID;
  
  function MatchID(){    
    this.select=function(callback1){
      var  sql1 = 'SELECT distinct * FROM Roommate where sex = ? AND college = ? AND hall = ? AND user_sid != ?';
      var  Params = [datas[0].sex,datas[0].college,datas[0].hall,datas[0].sid];
      var option1 = {};
      connection1.query(sql1,Params,function(err,results){
        if(err){console.log(err);}

        option1[0]={'name':"NO ONE",'sex':null, 'sid':null};
        if(results){
          for(var i = 0; i < results.length; i++)
          {option1[i]={'name':results[i].name,'sex':results[i].sex,'college':results[i].college,'hall':results[i].hall,'sid':results[i].user_sid};}
        }
        
        callback1(option1); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
    };
  }
  module.exports = MatchID;
 
  var datas = Array;
  var dom1 = Array;
 // dom1[0]={'name':"NO ONE", 'sex':null, 'sid':null};
  var mqt = new SearchID();
  var SeID = new MatchID();

  let userID = req.cookies.islogin.sid; // if any problems, call Ryan
  mqt.select(function (rdata){
    datas = rdata;
    
    connection1.connect(); 
    SeID.select(function(rdata1){
      dom1 = rdata1;
      console.log('----Search----');
      console.log(datas);
      console.log('----Match----');
      console.log(dom1);
      if(dom1[0].name=="NO ONE"){
        res.redirect("NoRoommate.html");
      }
      else{res.render('YesRoommate', {
        layout: null,
        r_name: dom1[0].name,
        r_sex: dom1[0].sex,
        r_sid: dom1[0].sid
        });
      }
    });
  },userID);  

  connection.end();
  console.log(res);
  //res.end(JSON.stringify(res));
});


app.post('/check_teammate', urlencodedParser, function (req, res) {

  //MySql
  var connection = mysql.createConnection({     
       host     : 'localhost',       
       user     : 'root',              
       password : 'jack1998',       
       port: '3306',                   
       database: 'cup',
       useConnectionPooling: true
  }); 
  connection.connect(); 

  var connection1 = mysql.createConnection({     
    host     : 'localhost',       
    user     : 'root',              
    password : 'jack1998',       
    port: '3306',                   
    database: 'cup',
    useConnectionPooling: true
  }); 

  function SearchID(){
    this.select=function(callback,id){
      var  sql = 'SELECT distinct * FROM Teammate where user_sid = ' + id;
      var option = {};
      connection.query(sql,function(err,result){
        if(err){console.log(err);}
        if(result){
          for(var i = 0; i < result.length; i++)
            {option[i]={'CourseTitle':result[i].CourseTitle,'CourseCode':result[i].CourseCode,'Size':result[i].Size,'sid':result[i].user_sid};}
        }
        callback(option); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
    };
  }
  module.exports = SearchID;
 
  function MatchID(){    
    this.select=function(callback1){
      var  sql1 = 'SELECT distinct * FROM Teammate where CourseCode = ? AND CourseTitle = ? AND user_sid != ?';
      var thedata = datas[0];
      var  Params = [thedata.CourseCode,thedata.CourseTitle,thedata.sid];
      var option1 = {};
      connection1.query(sql1,Params,function(err,results){
        if(err){console.log(err);}
        for(var j = 0; j < thedata.Size; j++)
          {option1[j]={'name':"NO ONE",'sex':null, 'sid':null};}
        if(results){
          for(var i = 0; i < results.length; i++)
          {option1[i]={'name':results[i].name,'sex':results[i].sex,'sid':results[i].user_sid};}
        }
        
        callback1(option1); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
    };
  }
  module.exports = MatchID;
  var MaID = new MatchID();
  var SeID = new SearchID();
 
  var datas = Array;
  var dom1 = Array;

 
  SeID.select(function (rdata){
    datas = rdata;
  
    connection1.connect(); 
    MaID.select(function(rdata1){
      
      dom1 = rdata1;
      console.log('----Search----');
      console.log(datas);
      console.log('----Match----');
      console.log(dom1);
      
      asize = datas[0].Size-1;
      console.log(asize);
    
      if(dom1[asize-1].name=="NO ONE"){
        res.redirect("NoTeammate.html");
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
       else if(asize==6){res.render('YesTeammate', {
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
     },userID);
  
  connection.end();
  console.log(res);
  //res.end(JSON.stringify(res));
});

//Jack part ends

var post = require('./routes/post');
app.use('/post',post);


var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Adress is http://%s:%s", host, port);
});