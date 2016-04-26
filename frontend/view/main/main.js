$("document").ready(function(){
    var priceArea=$(".container form>.priceArea");
    var select=$(".container form>.select");
    var submitBtn=$(".container form>.submitBtn");
    var resultBox=$("#resultBox");

    $("select").select2({dropdownCssClass: 'dropdown-inverse'});

    select.on("change",function(){
        if(select.val()=='price'){
            priceArea.show();
        }
        else{
            priceArea.children("input").val("");
            priceArea.hide();
        }
    });

    submitBtn.on("click",function(e){
        e.preventDefault();
        var keywords=$(".container form>.search").val();
        var book_list;
        //console.log(select.val());
        if(select.val()=='price'){
            var min=priceArea.children("input").eq(0).val();
            var max=priceArea.children("input").eq(1).val();
            $.ajax({
                url:'/search/price/'+min+'/'+max,
                type:'POST',
                dataType:'json',
                data:{
                    book_name:keywords
                },
                success:function(res){
                    console.log(res);
                    if(res.code==0) {
                        resultBox.children().remove();
                        book_list = res.book_list;
                        if(book_list.length==0) return showNoResult("未找到匹配的书籍!");
                        for (var i in book_list) {
                            addBookItem(book_list[i]);
                        }
                    }
                    else if(res.code==1){
                        console.error(res.desc);
                    }
                    else{
                        console.log(res.desc);
                    }
                },
                error:function(err){
                    console.error(err);
                }
            })
        }
        else{
            if(keywords==""){
                return false;
            }
            $.ajax({
                url:'/search/'+select.val()+"/"+keywords,
                type:'GET',
                dataType:'json',
                success:function(res){
                    if(res.code==0){
                        resultBox.children().remove();
                        book_list=res.book_list;
                        if(book_list.length==0) return showNoResult("未找到匹配的书籍!");
                        for(var i in book_list){
                            addBookItem(book_list[i]);
                        }
                    }
                    else if(res.code==1){
                        console.error(res.desc);
                    }
                    else{
                        console.log(res.desc);//未查到结果
                    }
                },
                error:function(err){
                    console.error(err);
                }
            })
        }
    });

});

