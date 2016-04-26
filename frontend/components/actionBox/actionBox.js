Vue.component("actionbox",{
    template:'<div class="actionBox">'
    +'<p>欢迎 {{admin}}</p>'
    +'<h4>{{title}}</h4>'
    +'<form>'
    +'<input type="text" class="form-control input-sm" placeholder="借书证ID">'
    +'<input type="text" class="form-control input-sm" placeholder="图书ID或图书名">'
    +'<button type="submit" class="btn btn btn-primary submitBtn">{{btnName}}</button>'
    +'<button type="button" class="btn btn btn-info searchBtn">查询所借书籍</button>'
    +'<a href="/logout"><button type="button" class="btn btn-default logout">登出</button></a>'
    +'</form>'
    +'</div>'
    +'<div class="resultBox"></div>',
    props:{
        'admin':String,
        'title':String,
        'btnName':String
    }
});
var isClickGetList=0;//点击查询后才能再每次借书后更新列表
new Vue({
    el:"body"
});

$(document).ready(function(){
    var searchBtn=$(".actionBox>form>.searchBtn");
    searchBtn.on("click",getBorrowList);
});

//-------------获取借书记录-------------
(function(global){
    var resultBox=$(".resultBox");
    var input = $(".actionBox>form>input");
    global.getBorrowList=function() {
        if(!isClickGetList) isClickGetList++;
        var card_id = input.eq(0).val();
        var book_name = input.eq(1).val();

        var book_list;
        if (card_id == "") {
            return alert("借书证ID不能为空!");
        }
        $.ajax({
            url: '/search/' + card_id,
            type: 'POST',
            dataType: 'json',
            data:{
                book_name:book_name
            },
            success: function (res) {
                if (res.code == 0) {
                    resultBox.children().remove();
                    book_list = res.book_list;
                    if (book_list.length == 0) return showNoResult("该借书证无借书记录!");
                    for (var i in book_list) {
                        addBorrowItem(book_list[i]);
                    }
                }
                else if (res.code == 1) {
                    console.error(res.desc);
                }
                else {
                    console.log(res.desc);
                }
            },
            error: function (err) {
                console.error(err);
            }
        });
    }
})(window);