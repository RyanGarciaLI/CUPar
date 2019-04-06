//************************************
// Here is a plugin for encrypt the 
// password with md5 hash function. 
// Just use pwd=md5(pwd) to encrypt
// Author: Ryan Garcia Yuxin LI
// Date: 21/03/2019
//************************************
var crypto = require('crypto');

var md5 = function(str){
    return crypto.createHash('md5').update(str).digest('hex');
};

module.exports = md5;