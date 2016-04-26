(function(global){

    //-------------添加书籍记录单项-------------
    global.addBookItem=function(data){
        var bookItem=$("<bookitem></bookitem>");
        bookItem.attr({
            'book_id':data.book_id,
            'book_type':data.book_type,
            'book_name':data.book_name,
            'publish':data.publish_house,
            'year':data.year,
            'author':data.author,
            'price':data.price,
            'number':data.book_number,
            'total':data.total_number
        });
        $(".resultBox").append(bookItem);
        new Vue({
            el:'body'
        })
    };

    //-------------添加借书记录单项-------------
    global.addBorrowItem=function(data){
        var borrwoItem=$("<borrowitem></borrowitem>");
        borrwoItem.attr({
            'book_id':data.book_id,
            'book_name':data.book_name,
            'loan_time':data.loan_time,
            'return_time':data.return_time,
            'number':data.number
        });
        $(".resultBox").append(borrwoItem);
        new Vue({
            el:'body'
        })
    };

    //-------------无结果反馈-------------
    global.showNoResult = function(text){
        var warning=$("<span></span>");
        warning.addClass("noResult");
        warning.text(text);
        $(".resultBox").append(warning);
    };

})(window);