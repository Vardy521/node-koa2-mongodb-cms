'use strict'
'use strict'
const Router=require('koa-router');
var router=new Router();
var DB=require('../../module/db');
router.get('/',async (ctx)=>{
    // ctx.body="用户管理首页";
    await ctx.render('admin/index');
});
// 改变状态
router.get('/changeStatus',async (ctx)=>{
    //  console.log(ctx.query);
    //  ctx.body={"message":'更新成功','success':true}
     var collectionName=ctx.query.collectionName;
     var attr=ctx.query.attr;
     var id=ctx.query.id;
     var data=await DB.find(collectionName,{'_id':DB.getObjectId(id)});
     console.log(data);
     if(data.length>0){
        if(data[0][attr]==1){
            var json = { /*es6 属性名表达式*/
                [attr]: 0
            };
        }else{
            var json = {
                [attr]: 1
            };
        }

        let updateResult=await DB.update(collectionName,{"_id":DB.getObjectId(id)},json);

        if(updateResult){
            ctx.body={"message":'更新成功',"success":true};
        }else{
            ctx.body={"message":"更新失败","success":false}
        }

    }else{
        ctx.body={"message":'更新失败,参数错误',"success":false};
    }
});
//删除
router.get('/delete',async (ctx)=>{
try{
     var collectionName=ctx.query.collectionName;
     var id=ctx.query.id;
     let deleteResult=await DB.remove(collectionName,{"_id":DB.getObjectId(id)});

        if(deleteResult){
            ctx.body={"message":'删除成功',"success":true};
            // ctx.redirect('/admin/articlecate');
            // 返回上一页
            ctx.redirect(ctx.state.G.prevPage);
        }else{
            ctx.body={"message":"删除失败","success":false}
        }
    }catch(err){
        ctx.redirect(ctx.state.G.prevPage);
    } 
});
// 改变排序
router.get('/changeSort',async (ctx)=>{
    //  console.log(ctx.query);
    //  ctx.body={"message":'更新成功','success':true}
     var collectionName=ctx.query.collectionName;
     var id=ctx.query.id;
     var sortValue=ctx.query.sortValue;
    //  var data=await DB.find(collectionName,{'_id':DB.getObjectId(id)});
    //  console.log(data);
        // 更新的数据
        var json={
            sort:sortValue
        };
        let updateResult=await DB.update(collectionName,{"_id":DB.getObjectId(id)},json);
        if(updateResult){
            ctx.body={"message":'更新成功',"success":true};
        }else{
            ctx.body={"message":"更新失败","success":false}
        }

});
module.exports=router.routes();