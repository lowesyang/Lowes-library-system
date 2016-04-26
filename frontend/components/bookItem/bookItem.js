Vue.component('bookitem',{
    template:'<div class="bookItem">'
    +'<div class="infoBox">'
    +'<span title="{{book_id}}">{{book_id}}</span>'
    +'<span title="{{book_name}}">{{book_name}}</span>'
    +'<ul>'
    +'<li title="{{book_type}}">类别: {{book_type}}</li>'
    +'<li title="{{publish}}">出版社: {{publish}}</li>'
    +'<li title="{{author}}">作者: {{author}}</li>'
    +'</ul>'
    +'<ul>'
    +'<li title="{{year}}">年份: {{year}}</li>'
    +'<li title="{{price}}">价格: {{price}}</li>'
    +'<li title="{{total}}">总藏书量: {{total}}</li>'
    +'</ul>'
    +'</div>'
    +'<h5>库存<span class="book_num" title="{{number}}">{{number}}</span></h5>'
    +'<div class="cl"></div>'
    +'</div>',
    props:{
        'book_id':String,
        'book_type':String,
        'book_name':String,
        'publish':String,
        'year':String,
        'author':String,
        'price':String,
        'total':String,
        'number':String
    }
});

new Vue({
    el:'body'
});