var router=require("express").Router();
var client=require("./../func/dbConnect").client;
var moment=require("moment");
var fs=require("fs");
var multer=require("multer");
var upload=multer({dest:"dict/"});
var makeData=require("./../func/makeDataField");


//-------------图书入库(单本)-------------
router.post("/addSingle",function(req,res){
    var result={
        book_id:req.body.book_id,
        book_type:req.body.book_type,
        book_name:req.body.book_name,
        publish_house:req.body.publish_house,
        year:req.body.year,
        author:req.body.author,
        price:req.body.price,
        book_number:req.body.book_number,
        total_number:req.body.book_number
    };

    client.query("select * from library where book_id='"+result.book_id+"'",function(err,data){
        if(err){
            return res.json({
                code:1,
                desc:err.toString()
            });
        }

        if(data[0]){
            for(var i in data[0]){
                if(i=='book_number' || i=='total_number') continue;
                if(data[0][i]!=result[i]){
                    return res.json({
                        code:1,
                        desc:"有信息不符合已有书籍，请检查信息是否正确!"
                    })
                }
            }
            client.query("update library set book_number=book_number+"+result.book_number+",total_number=total_number+"+result.book_number+" where book_id='"+result.book_id+"'",function(error,resp){
                if(error){
                    return res.json({
                        code:1,
                        desc:error.toString()
                    })
                }
                if(resp){
                    res.json({
                        code:0,
                        book_number:parseInt(data[0].book_number)+parseInt(result.book_number)
                    })
                }
                else{
                    res.json({
                        code:1,
                        desc:"更新书籍数目失败,添加书籍失败!"
                    })
                }
            })
        }
        else{
            var dataField=makeData.makeDataField(result);
            client.query("insert into library (book_id,book_type,book_name,publish_house,year,author,price,book_number,total_number) values ("+dataField.join(",")+")",function(error,resp){
                if(error){
                    return res.json({
                        code:1,
                        desc:error.toString()
                    })
                }
                if(resp){
                    res.json({
                        code:0,
                        book_number:result.book_number
                    })
                }
                else{
                    res.json({
                        code:1,
                        desc:"添加书籍失败!"
                    })
                }
            })
        }
    })
});

//-------------图书入库(批量)-------------
router.post('/addSeries',upload.single('dict'),function(req,res){
    var file_path=req.file.path;
    //console.log(req.file.mimetype);
    if(req.file.mimetype.indexOf("text")===-1){
        return res.json({
            code:1,
            desc:"请上传*.txt文本文件"
        });
    }
    var data=fs.readFileSync(file_path,"utf8");
    fs.unlink(file_path);
    //console.log(data);
    var book_list=data.split("\n");
    var count=0;
    var errorList=[];
    //console.log(book_list);
    for(var i=0;i<book_list.length;i++){
        (function(j){
            var item=book_list[j].replace("(","").replace(")","").split(",");
            var jsonItem={
                book_id:item[0],
                book_type:item[1],
                book_name:item[2],
                publish_house:item[3],
                year:item[4],
                author:item[5],
                price:item[6],
                book_number:item[7],
                total_number:item[7]
            };
            for (var k in jsonItem) {
                //console.log(typeof(jsonItem[k]))
                if (typeof(jsonItem[k]) === 'undefined'){
                    //console.log("Not");
                    if(count==book_list.length-1) return responseJson(res,{
                        code:1,
                        desc:"存在错误格式",
                        errorList:errorList
                    });
                    return count++;
                }
            }
            client.query("select book_id,book_number from library where book_id='"+jsonItem.book_id+"'",function(err,data){
                if(err){
                    count++;
                    if(count==book_list.length){
                        responseJson(res,{
                            code:0,
                            errorList:errorList
                        });
                    }
                    else return errorList.push(jsonItem);
                }

                if(data[0]){
                    client.query("update library set book_number=book_number+"+jsonItem.book_number+",total_number=total_number+"+jsonItem.book_number+" where book_id='"+jsonItem.book_id+"'",function(error,resp){
                        count++;
                        if(error){
                            if(count==book_list.length){
                                responseJson(res,{
                                    code:0,
                                    errorList:errorList
                                });
                            }
                            else return errorList.push(jsonItem);
                        }

                        if(resp.affectedRows){
                            if(count==book_list.length) {
                                responseJson(res,{
                                    code:0,
                                    errorList:errorList
                                });
                            }
                        }
                        else return errorList.push(jsonItem);
                    })
                }
                else{
                    var dataField=makeData.makeDataField(jsonItem);
                    client.query("insert into library (book_id,book_type,book_name,publish_house,year,author,price,book_number,total_number) values ("+dataField.join(",")+")",function(error,resp){
                        count++;
                        if(error){
                            if(count==book_list.length){
                                responseJson(res,{
                                    code:0,
                                    errorList:errorList
                                });
                            }
                            else return errorList.push(jsonItem);
                        }

                        if(resp.affectedRows){
                            if(count==book_list.length) {
                                responseJson(res,{
                                    code:0,
                                    errorList:errorList
                                });
                            }
                        }
                        else return errorList.push(jsonItem);
                    })
                }
            })
        })(i)
    }

    function responseJson(response,jsonArr){
        var jsonStr=JSON.stringify(jsonArr);
        return response.send(jsonStr);
    }
});

//-------------删除图书(单本)-------------
router.delete("/delete/:book_id/:book_number",function(req,res){
    var result={
        book_id:req.params.book_id,
        book_number:req.params.book_number
    };

    client.query("select book_number,total_number from library where book_id='"+result.book_id+"'",function(err,data){
        if(err){
            return res.json({
                code:1,
                desc:err.toString()
            });
        }

        if(data[0]){
            var book_num=data[0].book_number;
            var total_num=data[0].total_number;
            if(book_num==0 || ((book_num-result.book_number)<0 && book_num<total_num)){
                return res.json({
                    code:1,
                    desc:"该书正在外借，无法删除"
                })
            }
            else{
                book_num=data[0].book_number - result.book_number;
                if(book_num < 0){
                    book_num = 0;
                    total_num-=data[0].book_number;
                }
                else{
                    total_num=data[0].total_number - result.book_number;
                }
                if(total_num < 0){
                    total_num = 0;
                }
                if(total_num!=0) {
                    client.query("update library set book_number="+book_num+",total_number="+total_num+" where book_id='"+result.book_id+"'", function (error, resp) {
                        if(error){
                            return res.json({
                                code:1,
                                desc:error.toString()
                            })
                        }

                        if(resp.affectedRows){
                            res.json({
                                code:0,
                                count:data[0].total_number-total_num
                            })
                        }
                        else{
                            res.json({
                                code:1,
                                desc:"删除书籍失败!"
                            })
                        }
                    });
                }
                else{
                    client.query("delete from library where book_id='"+result.book_id+"'",function(error,resp){
                        if(error){
                            return resp.json({
                                code:1,
                                desc:error.toString()
                            })
                        }

                        if(resp.affectedRows){
                            res.json({
                                code:0,
                                count:data[0].total_number-total_num
                            })
                        }
                        else{
                            res.json({
                                code:1,
                                desc:"删除书籍失败!"
                            })
                        }
                    })
                }
            }
        }
        else res.json({
            code:1,
            desc:"没查找到指定书籍!"
        })
    })

});

//-------------输入书号借书-------------
router.post("/borrow",function(req,res){
    var result={
        book_id:req.body.book_id,
        card_id:req.body.card_id
    };

    client.query("select card_id from library_card where card_id='"+result.card_id+"'",function(errr,response){
        if(errr){
            return res.json({
                code:1,
                desc:errr.toString()
            })
        }
        if(response){
            client.query("select book_number from library where book_id='" + result.book_id + "'", function (err, data) {
                if (err) {
                    return res.json({
                        code: 1,
                        desc: err.toString()
                    });
                }
                if (data[0]) {
                    var num = data[0].book_number;
                    if (num == 0) {
                        res.json({
                            code: 1,
                            desc: "该书已无库存!"
                        })
                    }
                    else {
                        num--;
                        client.query("update library set book_number=" + num + " where book_id='" + result.book_id + "'", function (error, resp) {
                            if (error) {
                                return res.json({
                                    code: 1,
                                    desc: error.toString()
                                });
                            }
                            if (resp.affectedRows) {
                                var post = ["'" + result.book_id + "'", "'" + result.card_id + "'", "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'", "'" + moment().add(2, 'months').format("YYYY-MM-DD HH:mm:ss") + "'", "'" + req.session.userName + "'"];
                                client.query("insert into lend_records (book_id,card_id,loan_time,return_time,admin_id) values (" + post.join(",") + ")", function (errorr, respp) {
                                    if (errorr) {
                                        return res.json({
                                            code: 1,
                                            desc: errorr.toString()
                                        });
                                    }
                                    if (respp) {
                                        res.json({
                                            code: 0,
                                            desc: "借书成功!",

                                        });
                                    }
                                    else {
                                        res.json({
                                            code: 1,
                                            desc: "借书失败!"
                                        })
                                    }
                                })
                            }
                            else {
                                res.json({
                                    code: 1,
                                    desc: "借书失败!"
                                })
                            }
                        });
                    }
                }
                else {
                    res.json({
                        code: 1,
                        desc: "该书籍不存在"
                    })
                }
            })
        }
        else{
            res.json({
                code:1,
                desc:"该借书证不存在"
            })
        }
    })
});

//-------------输入书号还书-------------
router.post("/return",function(req,res){
    var result={
        book_id:req.body.book_id,
        card_id:req.body.card_id
    };
    client.query("select card_id from library_card where card_id='"+result.card_id+"'",function(errr,response){
        if(errr){
            return res.json({
                code:1,
                desc:errr.toString()
            })
        }
        if(response[0]){
            client.query("delete from lend_records where book_id='" + result.book_id + "' and card_id='" + result.card_id + "' limit 1", function (err, data) {
                if (err) {
                    return res.json({
                        code: 1,
                        desc: err.toString()
                    });
                }
                if (data.affectedRows) {
                    client.query("update library set book_number=book_number+1 where book_id='" + result.book_id + "'", function (error, resp) {
                        if (error) {
                            return res.json({
                                code: 1,
                                desc: error.toSource()
                            });
                        }
                        if (resp.affectedRows) {
                            res.json({
                                code: 0,
                                desc: "还书成功"
                            })
                        }
                        else {
                            res.json({
                                code: 1,
                                desc: "还书失败!"
                            })
                        }
                    })
                }
                else {
                    res.json({
                        code: 1,
                        desc: "借书记录不存在!"
                    })
                }
            })
        }
        else{
            res.json({
                code:1,
                desc:"该借书证不存在"
            })
        }
})
});

module.exports=router;