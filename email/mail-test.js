var nodemailer = require('nodemailer');

var config = {
        service: 'gmail',
        auth: {
            user: 'ryangarcia2333@gmail.com',
            pass: 'lyxnb2333'
        }
    };
    
var transporter = nodemailer.createTransport(config);


var mail = {

    from: 'Michael LYU <ryangarcia2333@gmail.com>',
    subject: 'CUPar is the best project in CSCI3100 software engineering',
    //to: '<1155107874@link.cuhk.edu.hk>,<1155107824@link.cuhk.edu.hk>,<1155107666@link.cuhk.edu.hk>,<1155107718@link.cuhk.edu.hk>,<1155107819@link.cuhk.edu.hk>',
    to: 'lyxnb2333@126.com',
    // cc:'lyxnb2333@126.com',
    html: 
`<pre style="font-family:calibri;font-size:17px">
Dear students in group one, 
    
    I am glad to inform your guys: Your group project, CUPar, regarding helping CUHK students find their partners, will get full mark in my course. And I will give each of your an A.

Best wishes
Michael LYU
</pre> 
            `
};

// 发送邮件
transporter.sendMail(mail, function(error, info){
    if(error) return console.log(error);
    console.log('mail sent:', info.response);
});