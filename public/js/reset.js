//************************************
// Here is a script for password reset 
// and send email to users
// Author: Ryan Garcia Yuxin LI
// Date: 10/04/2019
//************************************

// get info from website
function getSID(){
    // get info from website and corresponding validation
    let sid = $('#sid').val() ;    
    if( !checkSid( sid ) ){
        alert("student id is invalid");
        return;
    }
    
    // unable to send code frequently
    $("#sendcode").attr("disabled", true);
    // send email
    let email = $('#sid').val() + '@link.cuhk.edu.hk';
    let info = {
        email : email,
        sid : sid
    };

    $.post("/login/reset/email", info, function(res){
        // send successfully
        if( res == '001'){ 
            $("#bt").attr("disabled", false);
        } // send unsuccessfully
        else if ( res == '000'){
            alert("send code failure, check your student id and click the button to send it again");
        } // has registed
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


function timing(){
    let time = 60;
    var mytime = setInterval( function(){
        time--;
        $("#sendcode").attr("value", time);
        if( time === 0 ){
            clearInterval(mytime);
            $("#sendcode").attr("value","send")
            $("#sendcode").attr("disabled", false);
        }
    }, 1000);
}

