let mysql = require('mysql');
let config = require('./config');

let connection = mysql.createConnection(config);

// insert statement, divide statement into two parts
let stmt = `INSERT INTO account(SID,name,password,gender,state) VALUES ?`
let sql = [
    [1155107874, 'LI Yuxin', 123456, 'M', '1'],
    [1234567890, 'Garcia', 654321, 'F', 0]
];

// execute the insert statement, no type function here
connection.query(stmt, [sql], (err, results, fields) => {
    if(err){
        return console.error(err.message);
    }

    // get inserted rows
    console.log('Row inserted:' + results.affectedRows);
});

// close the database connection
connection.end();