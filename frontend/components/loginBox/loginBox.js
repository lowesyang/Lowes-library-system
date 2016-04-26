Vue.component("loginbox",{
    template:'<div class="loginBox">'
    +'<h4>管理员登录</h4>'
    +'<form>'
    +'<input type="text" class="form-control input-sm" placeholder="管理员ID">'
    +'<input type="password" class="form-control input-sm" placeholder="密码">'
    +'<button type="submit" class="btn btn btn-primary btn-wide submitBtn">登录</button>'
    +'</form>'
    +'</div>'
});

new Vue({
    el:"body"
});

$(document).ready(function(){
    var loginBtn=$(".loginBox .submitBtn");
    var loginInput=$(".loginBox input");
    loginBtn.on("click",function(e){
        e.preventDefault();
        var adminID=loginInput.eq(0).val();
        if(!adminID) return alert("管理员ID不能为空");
        var psword=loginInput.eq(1).val();
        if(!psword) return alert("密码不能为空");
        $.ajax({
            url:"/login",
            type:"POST",
            dataType:"json",
            data:{
                userName:adminID,
                psword:psword
            },
            success:function(res){
                if(res.code==0){
                    window.location.reload();
                }
                else{
                    console.log(res.desc)
                }
            },
            error:function(err){
                console.error(err);
            }
        })
    });
})