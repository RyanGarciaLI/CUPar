var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql  = require('mysql');  
var fs = require('fs');
 
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('./code_page'));

app.use('/index.html',function(req,res){
  var fileName="./index.html";
  fs.readFile(fileName,function(err,data){
      if(err)
          console.log("Sorry, there is a mistake in your address.");
      else{
          res.write(data);
      }
  });
});

app.use('/Roommate.html',function(req,res){
  var fileName="./Roommate.html";
  fs.readFile(fileName,function(err,data){
      if(err)
          console.log("Sorry, there is a mistake in your address.");
      else{
          res.write(data);
      }
  });
});

app.get('/Roommate.html', function (req, res) {
   res.sendFile( __dirname + "/" + "Roommate.html" );
});

//Store data into MySql
app.post('/process_post', urlencodedParser, function (req, res) {
 
   res.redirect("/index.html");
 
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
           return;
          }        
   
         console.log('--------------------------INSERT----------------------------');
         //console.log('INSERT ID:',result.insertId);        
         console.log('INSERT ID:',result);        
         console.log('-----------------------------------------------------------------\n\n');  
    });
   
    connection.end();

    console.log(response);
    res.end(JSON.stringify(response));
});

function SearchID(){
  //Search
  this.select=function(callback,id){
    var  sql = 'SELECT distinct * FROM Roommate where user_id = ?';
    var  Params = [id];
      connection.query(sql,Params,function(err,result){
        if(err){console.log(err);}
          callback(result); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
  };
}
module.exports = SearchID;

function MatchID(){
  //Search
  this.select=function(callback,user){
    var  sql = 'SELECT distinct * FROM Roommate where sex = ? AND college = ? AND hall = ?';
    var  Params = [user.sex,user.college,user.hall];
      connection.query(sql,Params,function(err,result){
        if(err){console.log(err);}
          callback(result); // If return directly, it will return undefined. So we need call back function to receive the data.
      });
  };
}
module.exports = MatchID;

// Match
app.post('/check_roommate', urlencodedParser, function (req, res) {
 
  //Need to design a new page to show the result
 

  //MySql
   var connection = mysql.createConnection({     
       host     : 'localhost',       
       user     : 'root',              
       password : 'jack1998',       
       port: '3306',                   
       database: 'cup' 
     }); 
   connection.connect(); 

  //It's Ryan's jbo to get the user ID. (hhhhhhhdonotknowSID = 1155107819
  var userID=1155107819;

  ///////Use the function to get data///////
  var mqt = new SearchID();
    mqt.select(processdata,userID);
    function processdata(rdata){
      var dom = rdata;
      var SeID = new MatchID();
      SeID.select(processdata1,dom);
      function processdata1(rdata1){
        var dom1 = rdata1;
        if(dom1==null){
          res.redirect("/No_roommate.html");
        }
        else{
         res.redirect("/Yes_roommate.html");
        }
        res.send(dom1);
    }
     res.send(dom);
  }

   connection.end();

   console.log(response);
   res.end(JSON.stringify(response));
});


var server = app.listen(8081, function () {
 
  var host = server.address().address;
  var port = server.address().port;
 
  console.log("Adress is http://%s:%s", host, port);
 
});


