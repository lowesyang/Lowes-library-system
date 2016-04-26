$(document).ready(function(){
    var table=$(".cardList>table");
    var submit=$(".addCard .submitBtn");
    $("select").select2({dropdownCssClass: 'dropdown-inverse'});

    $.ajax({
        url:"/card/list",
        type:"GET",
        dataType:"json",
        success:function(res){
            //console.log(res);
            if(res.code==0) {
                var data_list = res.data_list;
                if(data_list.length!=0) {
                    addCardList(data_list);
                    $("body").on("click",".deleteLink",function(){
                        if(!confirm("确定要删除吗？")) return false;
                        var card_id=$(this).attr("data");
                        var nodeRow=$(this).parent().parent();
                        deleteCard(nodeRow,card_id);
                    })
                }
                else{
                    showNoResult("还没有任何借书证~");
                }
            }
            else{
                showNoResult(res.desc);
            }
        },
        error:function(err){
            console.error(err);
        }
    });

    submit.on("click",function(e){
        e.preventDefault();
        var input=$(".addCard>form>input");
        var type=$(".addCard>form>select").val();
        var card_id=input.eq(0).val(),
            name=input.eq(1).val(),
            company=input.eq(2).val();
        if(!type) return alert("类型不能为空");
        if(!card_id) return alert("借书证ID不能为空!");
        if(!name) return alert("姓名不能为空!");
        if(!company) return alert("单位不能为空!");
        var dataField={
            card_id:card_id,
            name:name,
            company:company,
            type:type
        };
        $.ajax({
            url:"/card/add",
            type:"POST",
            dataType:"json",
            data:dataField,
            success:function(res){
                //console.log(res);
                if(res.code==0){
                    //console.log(dataField);
                    addCardItem(dataField);
                    new Vue({
                        el:"#cardList"
                    });
                    input.val("");
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

    function addCardItem(item){
        var rowItem=$("<rowitem></rowitem>");
        rowItem.attr({
            'card_id':item.card_id,
            'name':item.name,
            'company':item.company,
            'type':item.type
        });
        table.append(rowItem);
    }

    function addCardList(arr){
        for(var i in arr){
            addCardItem(arr[i]);
        }
        new Vue({
            el:"#cardList"
        })
    }

    function deleteCard(node,card_id){
        $.ajax({
            url:"/card/delete/"+card_id,
            type:"DELETE",
            success:function(res){
                if(res.code==0){
                    node.remove();
                }
                else{
                    alert(res.desc);
                }
            }
        })
    }

    function showNoResult(text){
        var warning=$("<span></span>");
        warning.addClass("noResult");
        warning.text(text);
        table.children("tbody").append(warning);
    }
});
