var router=require("express").Router();
var client=require("./../func/dbConnect").client;
var md5=require("md5");

router.post('/login',function(req,res){
    var result= {
        userName: req.body.userName,
        password: md5(req.body.psword)
    };

    client.query("select admin_id,admin_pswd from admin where admin_id='"+result.userName+"'",function(err,data){
        if(err){
            return res.json({
                code:1,
                desc:err.toString()
            });
        }
        var resp;
        //console.log(data);
        if((resp=data[0]) && resp.admin_pswd===result.password){
            req.session.login=true;
            req.session.userName=resp.admin_id;
            res.json({
                code:0
            })
        }
        else{
            res.json({
                code:1,
                desc:"用户名或密码错误"
            })
        }
    })
});

router.get('/logout',function(req,res){
    req.session.login=false;
    req.session.userName=null;
    res.redirect("/borrow");
});

module.exports=router;