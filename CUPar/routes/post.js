//************************************************
// Here is a router for post page
// It deals with get request about individual post   
// Author: WEI Wang
// Date: 21/03/2019
//************************************************
var express = require('express');
var router = express.Router();
var async = require('async');
var datainDB = require('../plugin/forumdb');
// show each post and its comments
router.get('/:postid.html', function(req, res) {
	// extract postid from url
	var postid = req.params.postid || 1;
	// console.log(postid);
	// asynchronously process get post content and its comments
	async.parallel([
		function(callback){
			datainDB.getPost(postid, function(result){
				callback(null, result[0]);
			})
		},
		function(callback){
			datainDB.getReply(postid, function(result){
				callback(null, result);
			})
		},
	], function(err, results){
		// send the outcome from database to frontend and render the interface
		res.render('post.ejs', { data:results });
	})
	
});

// set the post to private
router.get('/setprivate',function(req,res){
	// ensure user has logged in, if not redirect to login page
	if( !req.session.passport ){
        res.redirect('/login');
	}
	else{
		// get the parameters sent from frontend request
		let postid = parseInt(req.query.postid);
		let status = parseInt(req.query.status);
		let params = {status:status};
	// console.log(params);
		// send the params to backend and process
	datainDB.setPrivate(postid,params, function(result){
		// send the operation outcome to frontend
		if(result.affectedRows){
			res.send({code:0});
		}
	});
}
});

router.get('/setpublic',function(req,res){
	// ensure user has logged in, if not redirect to login page
	if( !req.session.passport ){
        res.redirect('/login');
	}
	else{
		// get the parameters sent from frontend request
		let postid = parseInt(req.query.postid);
		let status = parseInt(req.query.status);
		let params = {status:status};
	// console.log(params);
		// send the params to backend and process
	datainDB.setPublic(postid,params, function(result){
		// send the operation outcome to frontend
		if(result.affectedRows){
			res.send({code:0});
		}
	});
}
});

router.get('/newreply', function(req, res){
	// ensure user has logged in, if not redirect to login page
    if( !req.session.passport ){
        res.redirect('/login');
    }
	else{
			// get the parameters sent from frontend request
		    let postid = parseInt(req.query.postid);
			let content = req.query.content;
            let userID = req.cookies.islogin.id;
            let user_name = req.cookies.islogin.name;
            let createtime = new Date().toString().substr(0,25);
			let params = {postid:postid, uid:userID, content:content, createtime:createtime};
		//console.log(params);
		// send the params to backend and process
		datainDB.addReply(params, function(result){
			// send the operation outcome to frontend
            if(result.affectedRows){
				res.send({code:0, data:{rid:result.insertId ,createtime:createtime}});
			}
		});
	}
});

router.get('/newpost', function(req, res){
	// ensure user has logged in, if not redirect to login page
    if( !req.session.passport ){
        res.redirect('/login');
    }
    else{
		// get the parameters sent from frontend request
		let title = req.query.title;
		let	content = req.query.content;
        let userID = req.cookies.islogin.id;
        let user_name = req.cookies.islogin.name;
		let	createtime = new Date().toString().substr(0,25);
		let params = {uid:userID, title:title, content:content, createtime:createtime};
		//console.log(params);
		// send the params to backend and process
		datainDB.addPost(params, function(result){
			// send the operation outcome to frontend
            if(result.affectedRows){
				console.log(createtime);
                res.send({code:0,data:{url:'/post/'+result.insertId+'.html', title:title, author:user_name, createtime:createtime}});
            }
		});
	}
});

module.exports = router;
