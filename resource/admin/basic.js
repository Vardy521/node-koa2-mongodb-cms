'use strict'
var app={
    // 更改状态
    toggle:function(el,collectionName,attr,id){
        $.get('/admin/changeStatus',{collectionName:collectionName,attr:attr,id:id},function(data) {//ajax请求 前后台交互
            if (data.success) {
                if (el.src.indexOf('yes') != -1) {
                    el.src = '/admin/images/no.gif';
                } else {
                    el.src = '/admin/images/yes.gif';
                }
            }
        })
    },
    // 删除
    confirmDelete:function(){
        $('.delete').click(function(){
            var flag=confirm('确定要删除吗');
            return flag;
        });
    },
    changeSort:function(el,collectionName,id){
        var sortValue=el.value;
        $.get('/admin/changeSort',{collectionName:collectionName,id:id,sortValue:sortValue},function(data) {//ajax请求 前后台交互
            console.log(data);
        })
    }
}
$(function(){
    app.confirmDelete();
});