/**
 *  /public/js/entering.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Ryan Yuxin LI <lyxnb2333@gmail.com>
 *  @version: 1.0
 *  @since 2019-04-05
 *  @last updated: 2019-04-21
 */

 `
 This JavaScript script is able to verify the input of the user and
 invoke back end to send email to the user.
 `

// get info from website
function getInfo(){
    
    // get info from website and verify them
    let sid = $('#sid').val() ;    
    if( !checkSid( sid ) ){
        alert("student id is invalid");
        return;
    }

    let username = $('#username').val();
    if( !checkUsername( username )){
        alert("username must be nonempty and equal to or less than 25 !");
        return;
    }

    // let password = $('#password').val();
    // let passwordRP = $('#re-password').val();
    // if( !checkPwdLen( password )){
    //     alert("password must be equal or larger than 6 and equal or less than 20!");
    //     return;
    // }
    // if( !checkPwdVal( password, passwordRP)){
    //     alert("Twice inputs are different, please confirm your password!");
    //     return;
    // }

    $("#sendcode").attr("disabled", true);  // unable to send code frequently
    // send email
    let email = $('#sid').val() + '@link.cuhk.edu.hk';
    let info = {
        email : email,
        username : username,
        sid : sid
    };  // email option

    $.post("/signup/email", info, function(res){    // send post request to the back end to send email
        // send successfully
        if( res == '001'){ 
            $("#bt").attr("disabled", false);
        } // send unsuccessfully
        else if ( res == '000'){
            alert("send code failure, check your student id and click the button to send it again");
        } // has registed
        else if (res == '002'){
            alert("You have registed already, please log in!");
        } 
        else if (res == '403'){
            alert("The information you enter doesn't match database, try again");
        }
    }, "text");
    // wait for 60s
    timing();
}

// a series of functions for verification
function checkSid( id ){
    if ( id.length !== 10 || id[0] != 1 || id[1] != 1 || id[2] != 5 || id[3] != 5 ){
        return false;
    } 
    else{
        return true;
    }
}

function checkUsername( username){
    if( username.length === 0 || username.length > 25 ){
        return false;
    }
    return true;
}

function checkPwdLen( password){
    if( password.length < 6 || password.length > 20 ){
        return false;
    }
    return true;
}

function checkPwdVal( password, passwordRP){
    if( password != passwordRP ){
        return false;
    }
    return true;
}

// a timing function to let the button able after 1 min
function timing(){
    let time = 60;
    var mytime = setInterval( function(){
        time--;
        $("#sendcode").attr("value",time);
        if( time === 0 ){
            clearInterval(mytime);
            $("#sendcode").attr("value","Send")
            $("#sendcode").attr("disabled", false);
        }
    }, 1000);
}
