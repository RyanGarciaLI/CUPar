let mysql = require('mysql');
let config = require('./config');
let connection = mysql.createConnection(config);

let sql = `INSERT INTO account(SID,name, password, gender, state)
            VALUES(1155999999, 'Garcia', 0123456789, 'F', 0)`;

connection.query(sql);

connection.end();