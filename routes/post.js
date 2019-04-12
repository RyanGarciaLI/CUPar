var express = require('express');
var router = express.Router();
var async = require('async');

var datainDB = require('../plugin/forumdb');



router.get('/:postid.html', function(req, res) {
	
	var postid = req.params.postid || 1;
	console.log(postid);
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
		res.render('post.ejs', { data:results });
	})
	
});

router.get('/setprivate',function(req,res){
	if( !req.session.passport ){  // if any problems, call Ryan
        res.redirect('/login');
	}
	else{
		let postid = parseInt(req.query.postid);
		let status = parseInt(req.query.status);
	//post id user id
	let params = {status:status};
	console.log(params);
	datainDB.setPrivate(postid,params, function(result){

		if(result.affectedRows){
			res.send({code:0});
		}
	});
}
});

router.get('/setpublic',function(req,res){
	if( !req.session.passport ){  // if any problems, call Ryan
        res.redirect('/login');
	}
	else{
		let postid = parseInt(req.query.postid);
		let status = parseInt(req.query.status);
	//post id user id
	let params = {status:status};
	console.log(params);
	datainDB.setPublic(postid,params, function(result){

		if(result.affectedRows){
			res.send({code:0});
		}
	});
}
});

router.get('/newreply', function(req, res){
//     let user_name = req.cookies.islogin.name;// if any problems, call Ryan
//   let userID = req.cookies.islogin.sid;    // if any problems, call Ryan
    if( !req.session.passport ){  // if any problems, call Ryan
        res.redirect('/login');
    }
	else{
		    let postid = parseInt(req.query.postid);
			let content = req.query.content;
            let userID = req.cookies.islogin.id;    // if any problems, call Ryan
            let user_name = req.cookies.islogin.name;// if any problems, call Ryan
            let createtime = new Date().toString().substr(0,25);
		//post id user id
		let params = {postid:postid, uid:userID, content:content, createtime:createtime};
		console.log(params);
		datainDB.addReply(params, function(result){

            if(result.affectedRows){
				res.send({code:0, data:{rid:result.insertId ,createtime:createtime}});
			}
		});
	}
});

router.get('/newpost', function(req, res){
    if( !req.session.passport ){  // if any problems, call Ryan
        res.redirect('/login');
    }
    else{
		let title = req.query.title;
		let	content = req.query.content;
        let userID = req.cookies.islogin.id;    // if any problems, call Ryan
        let user_name = req.cookies.islogin.name;// if any problems, call Ryan
		let	createtime = new Date().toString().substr(0,25);

		let params = {uid:userID, title:title, content:content, createtime:createtime};
		//console.log(params);
		datainDB.addPost(params, function(result){

            if(result.affectedRows){
				console.log(createtime);
                res.send({code:0,data:{url:'/post/'+result.insertId+'.html', title:title, author:user_name, createtime:createtime}});
            }
		});
		
	}
});

module.exports = router;
