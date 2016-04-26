var router=require("express").Router();
var client=require("./../func/dbConnect").client;
var makeData=require("./../func/makeDataField");

router.get("/list",function(req,res){
    var data_list;

    client.query("select * from library_card",function(err,data){
        if(err){
            return res.json({
                code:1,
                desc:err.toString()
            })
        }
        if(data){
            data_list=data;
            res.json({
                code:0,
                data_list:data_list
            })
        }
        else{
            res.json({
                code:1,
                desc:"获取借书证失败,请稍后重试!"
            })
        }
    })
});

router.post("/add",function(req,res){
    var result={
        card_id:req.body.card_id,
        name:req.body.name,
        company:req.body.company,
        type:req.body.type
    };

    client.query("select card_id from library_card where card_id='"+result.card_id+"'",function(err,data){
        if(err){
            return res.json({
                code:1,
                desc:err.toString()
            });
        }
        var resp;
        //console.log(data);
        if(data[0] && (resp=data[0]) && resp.card_id===result.card_id){
            res.json({
                code:1,
                desc:"该借书证已存在!"
            })
        }
        else{
            var dataField=makeData.makeDataField(result);
            client.query("insert into library_card (card_id,name,company,type) values ("+dataField.join(",")+")",function(error,response){
                if(error){
                    return res.json({
                        code:1,
                        desc:error.toString()
                    });
                }
                //console.log(response)
                if(response.affectedRows) {
                    res.json({
                        code: 0
                    })
                }
                else{
                    res.json({
                        code:1,
                        desc:"添加借书证失败!"
                    })
                }
            })
        }
    })
});

router.delete("/delete/:card_id",function(req,res){
    var result={
        card_id:req.params.card_id
    };

    client.query("delete from library_card where card_id='"+result.card_id+"'",function(err,data){
        if(err){
            var desc=err.toString();
            if(desc.indexOf("a foreign key constraint")>=0){
                return res.json({
                    code:1,
                    desc:"该借书证有书籍尚未归还!"
                });
            }
            return res.json({
                code:1,
                desc:desc
            });
        }
        if(data.affectedRows){
            res.json({
                code:0
            })
        }
        else{
            res.json({
                code:1,
                desc:"删除借书证失败!"
            })
        }
    })
});

module.exports=router;