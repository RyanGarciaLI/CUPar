//************************************
// Here is a router for forum homepage
// It deals with get request from forum   
// Author: WEI Wang
// Date: 21/03/2019
//************************************
var express = require('express');
var router = express.Router();
var postnum;
var datainDB = require('../plugin/forumdb');

//list all posts
router.get('/', function(req, res) {
    // ensure user has logged in, if not redirect to login page
    if( !req.session.passport ){ 
        res.redirect('/login');
    }
    else{
        // show all public in database
	    datainDB.displayPosts(function(result){
            // deal with situation that there's no public post
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
    // ensure user has logged in, if not redirect to login page
    if(!req.session.passport){
        res.redirect('/login');
    }
    else{
        // show all posts of the user
        datainDB.displayMyPost(req.cookies.islogin.id,function(result){
            // deal with situation that the user hasn't released any post
            mypostnum = result.length;
            if(result.length != 0)
		    res.render('mypost.ejs',{ data:result,datalength: mypostnum });
            else
            res.render('mypost.ejs',{datalength: 0});
        });
    }
})
module.exports = router;