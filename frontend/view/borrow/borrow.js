$(document).ready(function(){
    var actionBtn=$(".actionBox .submitBtn");
    var actionInput=$(".actionBox input");

    actionBtn.on("click",function(e){
        e.preventDefault();
        var cardID=actionInput.eq(0).val();
        if(!cardID) return alert("借书证ID不能为空");
        var bookID=actionInput.eq(1).val();
        if(!bookID) return alert("图书ID不能为空");
        $.ajax({
            url:"/action/borrow",
            type:"POST",
            dataType:"json",
            data:{
                book_id:bookID,
                card_id:cardID
            },
            success:function(res){
                if(res.code==0){
                    actionInput.eq(1).val("");
                    if(isClickGetList) getBorrowList();
                }
                alert(res.desc);
            },
            error:function(err){
                console.error(err);
            }
        })
    });

});