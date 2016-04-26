var router=require("express").Router();
var client=require("./../func/dbConnect").client;
var moment=require("moment");

//----------根据特定字段来查询（除价格外)----------
router.get('/:_type/:book_info',function(req,res){
    var type=req.params._type;
    var book_list;
    var book_info=req.params.book_info;
    client.query("select * from library where "+type +" like '%"+book_info+"%'",function(err,data){
        if(err){
            return res.json({
                code:1,
                desc:err.toString()
            });
        }

        if(data){
            book_list=data;
            res.json({
                code:0,
                book_list:book_list
            });
        }
        else{
            res.json({
                code:2,
                desc:"服务器连接失败！"
            })
        }
    })
});

//----------根据价格区间来查询----------
router.post('/price/:_min/:_max',function(req,res){
    var min=req.params._min;
    var max=req.params._max;
    var book_name=req.body.book_name;
    var book_list;

    client.query("select * from library where price<"+max+" and price>"+min+" and book_name like '%"+book_name+"%'",function(err,data){
        if(err){
            return res.json({
                code:1,
                desc:err.toString()
            });
        }
        if(data){
            book_list=data;
            res.json({
                code:0,
                book_list:book_list
            });
        }
        else{
            res.json({
                code:2,
                desc:"服务器连接失败!"
            })
        }
    })
});

//-------------根据借书证卡号（与图书名）查询-------------
router.post("/:card_id",function(req,res){
    var card_id=req.params.card_id;
    var book_name=req.body.book_name;
    var book_list;

    client.query("select a.book_id,book_name,card_id,loan_time,return_time,number from (select *,count(book_id) as number from lend_records group by book_id,card_id) as a,library as b " +
        "where a.book_id=b.book_id"+" and card_id='"+card_id+"' "+
        "and book_name like '%"+book_name+"%'",function(err,data){
        if(err){
            return res.json({
                code:1,
                desc:err.toString()
            });
        }
        if(data){
            book_list=data;
            for(var i in book_list){
                book_list[i].loan_time=moment(book_list[i].loan_time).format("YYYY-MM-DD");
                book_list[i].return_time=moment(book_list[i].return_time).format("YYYY-MM-DD");
            }
            //console.log(book_list)
            res.json({
                code:0,
                book_list:book_list
            });
        }
        else{
            res.json({
                code:2,
                desc:"服务器连接失败!"
            });
        }
    })
});

module.exports=router;

