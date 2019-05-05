/**
 *  /plugin/encryption.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Ryan Yuxin LI <lyxnb2333@gmail.com>
 *  @version: 1.0
 *  @since 2019-03-19
 *  @last updated: 2019-04-21
 */
`
The encryption plugin is able to apply MD5 hashing function to encrypt a string with any length
into 32-digit string.
`
var crypto = require('crypto');

var md5 = function(str){
    return crypto.createHash('md5').update(str).digest('hex');
};

module.exports = md5;