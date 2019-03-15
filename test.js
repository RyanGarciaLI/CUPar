var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url,{useNewUrlParser: true}, function(err, db) {
    if (err) throw err;
    var dbo = db.db("account");
    var myobj = { email:"1234567890@qq.com",username: "abc", password: "12345678" };
    dbo.collection("account").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("Insertion is successful!");
        db.close();
    });
});