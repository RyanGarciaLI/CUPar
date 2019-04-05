var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'cupar'
});

connection.connect( function(err) {
    if (err)
    {
        console.log( 'connection error');
        return console.error('error: ' + err.messge);
    }

    var createTodos = `create table if not exists account(
                                    id int primary key auto_increment,
                                    SID int(10) not null,
                                    name varchar(25) not null default 'Anynomous',
                                    password varchar(64) not null,
                                    gender char(1) default 'F',
                                    state int(1) not null default '0',
                                    code varchar(6) 
                                    )`;

    connection.query( createTodos, function(err, result, fields){
        if(err){
            console.log(err.message);
        }
    });

    connection.end( function(err){
        if(err){
            return console.log(err.message);
        }
    });
                        
});