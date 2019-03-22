$(function(){
    $('#register-sub').on('click',function(){
        var info = $('form').serialize();
        $.ajax({
            type:"get",
            url:"http://127.0.0.1:8081",
            data:info,
            success:function(response,status,xhr){
                alert(response);
                localStorage.name = $('input[name="name"]').val();
            }
        });
        return false;
    });
    
    $('#login-sub').on('click',function(){
        return false;
    });
});