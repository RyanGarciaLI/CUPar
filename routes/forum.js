var express = require('express');
var router = express.Router();
var postnum;
var datainDB = require('../plugin/forumdb');

//list all posts
router.get('/', function(req, res) {
    if( !req.session.passport ){  // if any problems, call Ryan
        res.redirect('/login');
    }
    else{
	    datainDB.displayPosts(function(result){
            postnum = result.length;
            if(result.length != 0)
		    res.render('index.ejs', { data:result,datalength:postnum });
            else
            res.render('index.ejs',{datalength:postnum});
        });
    }
});
//list the user's all post
router.get('/mypost',function(req,res){
    
    if(!req.session.passport){
        res.redirect('/login');
    }
    else{
        datainDB.displayMyPost(req.cookies.islogin.id,function(result){
            mypostnum = result.length;
            if(result.length != 0)
		    res.render('mypost.ejs',{ data:result,datalength: mypostnum });
            else
            res.render('mypost.ejs',{datalength: 0});
        });
    }
})
module.exports = router;