//************************************
// Here is a script for verifying input 
// and send email to users
// Author: Ryan Garcia Yuxin LI
// Date: 05/04/2019
//************************************

// get info from website
function getInfo(){
    // get info from website and corresponding validation
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

    let password = $('#password').val();
    let passwordRP = $('#re-password').val();
    if( !checkPwdLen( password )){
        alert("password must be equal or larger than 6 and equal or less than 20!");
        return;
    }
    if( !checkPwdVal( password, passwordRP)){
        alert("Twice inputs are different, please confirm your password!");
        return;
    }
    
    // unable to send code frequently
    $("#sendcode").attr("disabled", true);
    // send email
    let email = $('#sid').val() + '@link.cuhk.edu.hk';
    let info = {
        email : email,
        username : username,
        sid : sid,
    };

    $.post("/signup/email", info, function(res){
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
            //$('body').html(data);
        }
    }, "text");
    // wait for 60s
    timing();
}


function checkSid( id ){
    if ( id.length !== 10 || id[0] != 1 || id[1] != 1 || id[2] != 5 || id[3] != 5 ){
        // $(obj).css("border-color","red"); // no change
        return false;
    } 
    else{
        // $(obj).css("border-color", "green"); // no change
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

function timing(){
    let time = 60;
    var mytime = setInterval( function(){
        time--;
        $("#sendcode").attr("value","Please wait for " + time);
        if( time === 0 ){
            clearInterval(mytime);
            $("#sendcode").attr("value","Send code again")
            $("#sendcode").attr("disabled", false);
        }
    }, 1000);
}

// create random code
var createSixNum = function(){
    let num = "";
    for( let i = 0; i < 6; i++){
        num += Math.floor( Math.random()*10);
    }
    return num;
};