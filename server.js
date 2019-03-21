let express = require('express');
let app = express();
let path = require('path');
let fs = require('fs');
//app.use( express.static('./public'));
app.use(express.static(__dirname + '/public'));
app.listen(8081);


let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(bodyParser.json());
app.use(urlencodedParser);

let favicon = require('serve-favicon');
app.use(favicon( __dirname + '/keyboarder.ico'));


let cookieParser = require('cookie-parser');
// let cookieSession = require('cookie-session');
let session = require('express-session');
app.use(cookieParser("CUPar"));
app.use(session({
     secret: 'CUPar is the best', 
     resave: true,  // resave session
     key: 'CUPar deserves an A',  // only for session
     cookie: { maxAge: 2 * 3600 * 1000},  // only for session
     saveUninitialized: false // passport: true, session: false
}));  // so that object req will have a attribut:session representing cookie

let user = require('./controller/userNew.js');
app.use(user.authenticate);

// //transmit {user: req.user } among all controller
// app.use( function (req, res, next){
//     res.locals.user = req.user;
//     next();
// });

//invoke  router
// var account = require('./routes/account');
var index =require('./routes/index');
var login = require('./routes/login');
var signup = require('./routes/signup');
var logout = require('./routes/logout');
app.use("/", index);
app.use("/login", login);
app.use('/signup', signup);
app.use('/logout', logout);

/*
// passport
// following declaration is for encryption password
let passport = require('passport'),
    User = require('./controller/users');/// need module: user!!!!!!!!!!!!!!!!!!!!!!
passport.use(User.createStrategy());
*/
// following configuration is for normal Passport Operation


/*
// to protect web from fake authentication
// passport can help us realize cookie
app.use(passport.initialize());
app.use(passport.session()); // check cookie and fill in req.use before user's request coming
// by 序列化 cookie 
passport.serializeUser( User.serializeUser());  
passport.deserializeUser( User.deserializeUser());
// Caution! Order is important, cookie -> session -> passport, the latter needs the front

// i don't know where the following code belongs t0, mark them 
router.post('/login', passport.authenticate('local', function(req, res){
    // if we declare this method, then we have succeed already?
    // we can redirect to index now.
    res.redirect('/');
    // or, we send respon of success
    // res.status(200).end();
    // it's up to you
}))
// in this part, we argue three parameters, the 2nd and 3rd are 级联的中间件s, 
// when the 2nd invokes next(), 3rd will be executed so that the passport will
// be verified before execution of 级联中间件, if it passes, 级联中间件 will be invoked
// else, return 401 ( Not Authenticated )


*/


/*
//cookie
// setting cookie when logging in
router.post('/login', passport.authenticate('local'), function(req,res){
    // res.cookie('authenticated', true);
    // res.status(200).end();
    req.session.authenticate = true;

    res.end();

})

// access cookie in other controler
router.get('/login', function(req, res){
    // if cookie has not been set, then redirect to log in
    // if( !req.cookie.authenticated ) return res.redirect('/account/login');
    //if( !req.session.authenticated ) return res.redirect('/account/login');
    if( !req.user ) return res.redirect('/account/login');
    // if loged in, continue other thing
    let response = {
        "sid": req.query.sid,  // {"nameInRes" : req.query.nameInReq } 
        "password": req.query.password
    };
    res.end(JSON.stringify(response));
})

router.get('/sign-up', function(req, res){
    //if( !req.user ) return res.redirect('/account/login');
    let response = {
        "sid": req.query.sid,
        "name": req.query.username,
        "password": req.query.password,
        "passwordRP":req.query.passwordRP  // repeat password
    };

    res.end(JSON.stringify(response));
})


*/






