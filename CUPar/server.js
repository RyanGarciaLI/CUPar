/**
 *  /sever.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author:  WEI Qi        <1155107666@link.cuhk.edu.hk>
 *            ZHAO Feng     <siegfriedzhaof@gmail.com>
 *            Ryan Yuxin LI <lyxnb2333@gmail.com>
 *            Jack Xiao     <1155107819@link.cuhk.edu.hk>
 *            WEI Wang      <1155107718@link.cuhk.edu.hk>
 *  @version: 4.0
 *  @since 2019-03-19
 *  @last updated: 2019-05-04
 *
 * Here are some accounts preinstalled in the datebase for testing
 *        Test accounts     |     Password
 *     -------------------------------------------
 *          1155104321      |     zxczxc
 *          1155107777      |     zxczxc
 *          1155223344      |     zxczxc
 *     -------------------------------------------
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var engines = require('consolidate');

app.engine('html', engines.swig); 
app.set('view engine', 'html'); 
// create application/x-www-form-urlencoded coding analyze
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(urlencodedParser);
app.use(express.static('./public'));

/**
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Ryan Yuxin LI <lyxnb2333@gmail.com>
 *  @version: 2.3
 *  @since 2019-03-17
 *  @last updated: 2019-04-21
 */

// set favourite icon for the website
var favicon = require('serve-favicon');
app.use(favicon( __dirname + '/keyboarder.ico'));

// options for cookie and session
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser("CUPar"));
app.use(session({
     secret: 'CUPar is the best', 
     resave: true,  // resave session
     key: 'CUPar deserves an A',
     cookie: { maxAge: 2 * 3600 * 1000},  // expired time
     saveUninitialized: false // passport: true, session: false
}));

// apply authentication for all access request
var user = require('./models/user.js');
app.use(user.authenticate);

//invoke  router
var index =require('./routes/index');
var login = require('./routes/login');
var signup = require('./routes/signup');
var logout = require('./routes/logout');
var deleteAccount = require('./routes/deleteAccount');
var account = require('./routes/account');
var process_roommate = require('./routes/process_roommate');
var process_teammate = require('./routes/process_teammate');
var check_roommate = require('./routes/check_roommate');
var check_teammate = require('./routes/check_teammate');
var result_roommate = require('./routes/result_roommate');
var result_teammate = require('./routes/result_teammate');
var process_evaluate = require('./routes/process_evaluate');

app.use("/", index);
app.use("/login", login);
app.use('/signup', signup);
app.use('/logout', logout);
app.use('/deleteAccount', deleteAccount);
app.use('/account_page', account);
app.use('/process_roommate', process_roommate);
app.use('/process_teammate', process_teammate);
app.use('/check_roommate', check_roommate);
app.use('/check_teammate', check_teammate);
app.use('/result_roommate', result_roommate);
app.use('/result_teammate', result_teammate);
app.use('/process_evaluate', process_evaluate);

/**
* -------------------Ryan's part ends ---------------------------
*/


app.get('/Roommate', urlencodedParser, function (req, res) {
  if( !req.session.passport ){ res.redirect('/login'); }
  let user_name = req.cookies.islogin.name;
  res.render('Roommate.hbs', {
    layout: null,
    username: user_name,
    login: 1
  });
});

app.get('/Teammate', urlencodedParser, function (req, res) {
  
  if( !req.session.passport ){ res.redirect('/login'); }
  let user_name = req.cookies.islogin.name;
  res.render('Teammate.hbs', {
    layout: null,
    username: user_name,
    login: 1
  });
});

app.post('/entry', urlencodedParser, function (req, res) {
  if( !req.session.passport ){ res.redirect('/login'); }
  res.redirect('entry.html');
});


app.post('/evaluate',urlencodedParser, function (req, res) {
  if( !req.session.passport ){ res.redirect('/login'); }
  res.redirect('evaluate.html');
});


//Andy part starts
var forum = require('./routes/forum');
app.use('/forum',forum);
var post = require('./routes/post');
app.use('/post',post);
/**
* -------------------Andy's part ends ---------------------------
*/

// **************************************************
// **************************************************
// the following code is done by 
// programmer: Zhao Feng & Jack

// all these codes will interact with the front-side
var io = require('socket.io')(server);
//count the number of online users
let counter = 0;
io.on('connection', (socket) => {
  counter++;
  io.emit("online", counter);
  socket.on("greet", () => {
      socket.emit("greet", counter);
  });
  socket.on("send", (msg) => {
	  //umpty input is not allowed
      if (Object.keys(msg).length < 2) return;
      io.emit("msg", msg);
  });
  socket.on('disconnect', () => {
      counter = (counter < 0) ? 0 : counter-=1;
      io.emit("online", counter);
  });
});
// Zhao Feng part ends
// *****************************************************
// *****************************************************
app.use(function(request, response) {
  response.status(404).render("404.ejs");
});
var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Address is http://%s:%s", host, port);
  console.log("server address: ", server.address())
});


