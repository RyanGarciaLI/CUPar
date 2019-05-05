var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = express.Router();
 
let counter = 0;

/*
app.get('/', (req, res) => {
    res.sendFile( __dirname + '/chat.html');
});
*/
 
io.on('connection', (socket) => {
    
    counter++;
    
    io.emit("online", counter);
 
    socket.on("greet", () => {
        socket.emit("greet", counter);
    });
 
    socket.on("send", (msg) => {
        
        if (Object.keys(msg).length < 2) return;
 
        io.emit("msg", msg);
    });
 
    socket.on('disconnect', () => {
        
        counter = (counter < 0) ? 0 : counter-=1;
        io.emit("online", counter);
    });
});

module.exports = router;
/*
http.listen(3000, () => {
    console.log("Server Started. http://localhost:3000");
});
*/