var crypto = require('crypto');

var md5 = function(str){
    return crypto.createHash('md5').update(str).digest('hex');
};

module.exports = md5;