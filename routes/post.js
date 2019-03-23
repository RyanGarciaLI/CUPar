var express = require('express');
var router = express.Router();
var async = require('async');

var datainDB = require('../plugin/database');
//add a new reply
router.get('/addPost',function(req,res){
    if( !req.session.passport ){
        console.log('welcome');
        res.json({code:1, msg:'please log in'});
        res.redirect('/login');
    }
    else{
        var postType = req.query.postType,
            content = req.query.content,
            name = req.cookies.islogin.name,
            createtime = parseInt(Date.now()/1000);

        var paras = {name:name,postType:postType,content:content,createtime:createtime};

        datainDB.addPost(paras,function(result){
            if(result.affectedRows){
				res.json({code:0, msg:'add successfully', data:{url:'/list/'+result.insertId+'.html', postType:postType, author:req.cookies.islogin.name, createtime:createtime}});
			}else{
				res.json({code:2, msg:'topic addition failed,please retry'});
			}
        });
    }
})

//list all posts
router.get('/Post', function(req, res, next) {
	datainDB.getPosts(function(result){
		res.render('Post', { data:result }); 
	})
});
module.exports = router;