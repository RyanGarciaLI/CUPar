var http = require('http');
var querystring = require('querystring');
var multiparty = require('multiparty');
var form = new multiparty.Form();  //the module to analyse the data in formData
//var url = require('url');
//var MongoClient = require('mongodb').MongoClient;
//var mongodburl = "mongodb://localhost:27017/";

var server = http.createServer(function(requset,respone){
	var data;
    
    requset.on('data',function(a){
     	data = querystring.parse(decodeURIComponent(a));
     	console.log('Real_data：',data);
    });
    
    /*
	//send formData
    form.parse(requset, function (err, a) {
       console.log("a");
       data = a;
    });
    */

	requset.on('end',function(a){
		console.log('succeed in access!');
	 	connect(data);
	    respone.end(JSON.stringify({statua:200 , msg:'succeed in request!' , data:{ data }}));
	});
	// respone.setHeader('Access-Control-Allow-Origin','*');  //解决跨域问题
    respone.writeHead(200,{'Content-Type':'application/json;chatset=utf-8'});
    
}).listen(8080,"localhost",function(){console.log("I am listening!");});  

function connect(params){
    MongoClient.connect(mongodburl,{useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("account");
        var myobj = { email:params.email,username: params.username, password: params.password };
        dbo.collection("account").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("Insertion is successful!");
            db.close();
        });
    });
}