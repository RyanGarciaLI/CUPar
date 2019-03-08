var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url,{useNewUrlParser: true}, function(err, db) {
    if (err) throw err;
    var dbo = db.db("account");
    dbo.collection("account"). find({}).toArray(function(err, result) { // 返回集合中所有数据
        if (err) throw err;
        console.log(result);
        db.close();
    });
});