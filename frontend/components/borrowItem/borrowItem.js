Vue.component('borrowitem',{
    template:'<div class="borrowItem">'
    +'<div class="infoBox">'
    +'<span title="{{book_id}}">{{book_id}}</span>'
    +'<span title="{{book_name}}">{{book_name}}</span>'
    +'<ul>'
    +'<li title="{{loan_time}}">借出时间：{{loan_time}}</li>'
    +'<li title="{{return_time}}">归还时间：{{return_time}}</li>'
    +'</ul>'
    +'</div>'
    +'<h5>数量<span class="book_num" title="{{number}}">{{number}}</span></h5>'
    +'<div class="cl"></div>'
    +'</div>',
    props:{
        'book_id':String,
        'book_name':String,
        'loan_time':String,
        'return_time':String,
        'number':String
    }
});

new Vue({
    el:'body'
});