$(document).ready(function(){
    var input=$(".bookForm>.left input");
    var submit=$(".bookForm>.left submitBtn");
    var clear=$(".clearBtn");
    var wbox=$(".warningBox");
    var goAdd=$(".goAdd");
    var goDelete=$(".goDelete");
    var left=$(".bookForm>.left");
    var right=$(".bookForm>.right");
    var deleteBox=$(".deleteBox");
    var deleteBtn=$(".deleteBtn");

    goDelete.on("click",function(){
        left.hide();
        right.hide();
        deleteBox.show();
    });

    goAdd.on("click",function(){
        left.show();
        right.show();
        deleteBox.hide();
    });

    submit.on("click",function(e){
        e.preventDefault();
        var dataField={
            book_id:input.eq(0).val(),
            book_type:input.eq(1).val(),
            book_name:input.eq(2).val(),
            publish_house:input.eq(3).val(),
            year:input.eq(4).val(),
            author:input.eq(5).val(),
            price:input.eq(6).val(),
            book_number:input.eq(7).val()
        };
        if(!dataField.book_id) return alert("图书ID不能为空!");
        if(!dataField.book_type) return alert("图书类别不能为空!");
        if(!dataField.book_name) return alert("书名不能为空!");
        if(!dataField.publish_house) return alert("出版社不能为空!");
        if(!dataField.year) return alert("年份不能为空!");
        if(!dataField.author) return alert("作者不能为空!");
        if(!dataField.price) return alert("价格不能为空!");
        if(dataField.price<=0) return alert("价格必须大于0!");
        if(!dataField.book_number) return alert("数量不能为空!");
        if(dataField.book_number<=0) return alert("数量必须大于0!");
        $.ajax({
            url:"/action/addSingle",
            type:"POST",
            dataType:"json",
            data:dataField,
            success:function(res){
                if(res.code==0){
                    alert("图书入库成功,目前的该书的库存为:"+res.book_number)
                }
                else{
                    alert(res.desc);
                }
            },
            error:function(err){
                console.error(err);
            }
        })
    });

    clear.on("click",function(){
        input.val("");
    });

    deleteBtn.on("click",function(e){
        e.preventDefault();
        var deleteInput=deleteBox.find("input");
        var del_id=deleteInput.eq(0).val();
        var num=deleteInput.eq(1).val();

        if(!del_id) return alert("图书ID不能为空!");
        if(!num) return alert("数量不能为空!");
        if(!confirm("确定删除指定书籍吗？")) return false;

        $.ajax({
            url:"/action/delete/"+del_id+"/"+num,
            type:"DELETE",
            dataType:"json",
            success:function(res){
                if(res.code==0){
                    deleteInput.val("");
                    alert("成功删除ID["+del_id+"]的图书 "+res.count+" 本!");
                }
                else{
                    alert(res.desc);
                }
            },
            error:function(err){
                console.error(err);
            }
        })
    });

    //------drag files to upload------
    //prevent default event of navigator
    $(document).on({
        dragleave:function(e){
            e.preventDefault();
        },
        drop:function(e){
            e.preventDefault();
        },
        dragenter:function(e){
            e.preventDefault();
        },
        dragover:function(e){
            e.preventDefault();
        }
    });

    var uploadInfo=$(".uploadArea>span");
    var uploadBox=document.getElementsByClassName("uploadArea");
    uploadBox[0].addEventListener("drop",function(e){
        wbox.children().remove();
        var oldtext=uploadInfo.text();
        e.stopPropagation();
        e.preventDefault();
        var fileList= e.dataTransfer.files;
        //console.log(fileList);
        var fileSize=fileList[0].size/1024;
        //console.log(fileSize);
        if(fileList[0].type.indexOf("text") === -1) return alert("请上传*.txt文本文件!");
        if(fileSize>1024*5) return alert("文件大小不得超过5m!");
        var xhr,form;
        if(window.XMLHttpRequest){
            xhr=new XMLHttpRequest();
        }
        else{
            xhr=new ActiveXObject();
        }
        xhr.open("POST","/action/addSeries",true);
        //xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        form=new FormData();
        form.append("dict",fileList[0]);

        //watch the situation of uploading
        xhr.onprogress=watchProgress;
        xhr.upload.onprogress=watchProgress;
        function watchProgress(evt){
            var loaded=evt.loaded;
            var total=evt.total;
            var per=Math.floor(100*loaded/total);
            uploadInfo.text("已上传"+per+"%");
        }

        xhr.send(form);
        xhr.onload=function(){
            uploadInfo.text(oldtext);
        };

        xhr.onreadystatechange=function(){
            if(xhr.readyState == 4 && xhr.status==200){
                var result=JSON.parse(xhr.response);
                if(result.code==1){
                    if(result.errorList.length != 0){
                        for(var i=0;i<result.errorList.length;i++){
                            var warning=$("<p></p>");
                            warning.text("图书ID["+errList[i].book_id+"],书名\""+errList[i].book_name+"\"的记录 入库失败!");
                            wbox.append(warning);
                        }
                    }
                    return alert(result.desc);
                }
                else return alert("图书批量入库成功");
            }
        };
    })
});