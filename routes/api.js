'use strict'
const Router=require('koa-router');
var router=new Router();
var DB=require('./../module/db');
router.get('/',async (ctx)=>{
    ctx.body='api接口';
});
router.get('/catelist',async (ctx)=>{
    var result=await DB.find('articlecate',{},{
    });
    // console.log(result);
    ctx.body={
        result:result
    }
});
router.get('/newslist',async (ctx)=>{
    var page=ctx.query.page;
    var pageSize=3;
    var result=await DB.findPage('article',{},{'_id':1,'title':1},{
        page,
        pageSize
    });
    ctx.body={
        result
    }
});
//添加到购物车:增加数据操作
router.post('/addCart',async (ctx)=>{
    //接收客户端提交的数据:增加
    console.log(ctx.request.body);
    ctx.body={
        success:true,
        message:'增加购物车'
    }
});
router.put('/editCart',async (ctx)=>{
    //接收客户端提交的数据:修改
    console.log(ctx.request.body);
    ctx.body={
        success:true,
        message:'修改购物车'
    }
});
router.delete('/removeCart',async (ctx)=>{
    //接收客户端提交的数据:删除
    console.log(ctx.query);
    ctx.body={
        success:true,
        message:'删除购物车'
    }
});
module.exports=router.routes();