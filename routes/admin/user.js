'use strict'
const Router=require('koa-router');
var router=new Router();
router.get('/',async (ctx)=>{
    // ctx.body="用户管理首页";
    await ctx.render('admin/user/index');
});
router.get('/add',async (ctx)=>{
    // ctx.body="增加用户";
    await ctx.render('admin/user/add');
});
router.get('/edit',async (ctx)=>{
    ctx.body="编辑用信息";
});
router.get('/delete',async (ctx)=>{
    ctx.body="删除用户";
});
module.exports=router.routes();