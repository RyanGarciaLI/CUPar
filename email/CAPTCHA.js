var mailer = require('./mailer');

var captcha = function( name, sid, code){
    var mail = {
        from: '"CUPar" <ryangarcia2333@gmail.com>',
        subject: 'Welcome to CUPar, my friends',
        to: sid + '@link.cuhk.edu.hk',
html: 
`<pre style="font-family:calibri;font-size:17px">
Dear `+ name + `:
        
    Welcome to CUPar! This is CUPar server~ We are looking forward to your so long.
    Here is your code for verfication,  ` + code + `
    Please type it into the form for completing your registration.
    Thanks.
    
Best Regards
CU Par 
</pre> `
    }
    mailer(mail);
}

module.exports = captcha;