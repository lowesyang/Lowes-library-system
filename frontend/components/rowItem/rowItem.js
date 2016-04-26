Vue.component("rowitem",{
    template:'<tr>'
    +'<td>{{card_id}}</td>'
    +'<td>{{name}}</td>'
    +'<td>{{company}}</td>'
    +'<td>{{type}}</td>'
    +'<td><button class="btn btn-danger deleteLink" data="{{card_id}}">删除</button></td>'
    +'</tr>',
    props:{
        'card_id':String,
        'name':String,
        'company':String,
        'type':String
    }
});

new Vue({
    el:"#cardList"
});