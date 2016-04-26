Vue.component('lowesnavbar',{
    template:'<div class="banner">'
    +'<a href="/index" class="logo">Lowes Library System</a>'
    +'<ul>'
    +'<li><a href="/index">搜索图书</a></li>'
    +'<li><a href="/borrow">借阅</a></li>'
    +'<li><a href="/return">归还</a></li>'
    +'<li><a href="/cardpage">借书证管理</a></li>'
    +'<li><a href="/bookmng">图书管理</a></li>'
    +'</ul>'
    +'</div>'
});

new Vue({
    el:"body"
});