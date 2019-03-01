'use strict'
const Router=require('koa-router');
var DB=require('../../module/db');
var router=new Router();
var tools=require('../../module/tools');

router.get('/',async (ctx)=>{
    var page=ctx.query.page || 1;
    var pageSize=10;
    var result=await DB.findPage('nav',{},{},{
        page,
        pageSize,
        sort:{
            addTime:-1
        }
    });
    var countResult=await DB.count('nav',{});
    await ctx.render('admin/nav/index',{
        list:result,
        page:page,
        totalPages:Math.ceil(countResult/pageSize)//Math.ceil:向上取整
    });
    // ctx.body="轮播图";
});
router.get('/add',async (ctx)=>{
//    ctx.body='增加轮播图';
      await ctx.render('admin/nav/add',{});
});
router.post('/doAdd',async (ctx)=>{
   //接收post过来的数据
  var title=ctx.request.body.title; //直接接受数据，不需要提交图片的 要用ctx.request.body.***,如果有图片提交的，用到tools.multer().single('linkpic')方法的，可以用简写ctx.req.body.***
  var url=ctx.request.body.url;
  var sort=ctx.request.body.sort;
  var status=ctx.request.body.status;
  var addTime=tools.getTime();
   await DB.insert('nav',{
       title,url,sort,status,addTime
   });
   ctx.redirect(ctx.state.__HOST__+'/admin/nav');
});
router.get('/edit',async (ctx)=>{
    // ctx.body='编辑轮播图';
    var id=ctx.query.id;
    var res=await DB.find('nav',{'_id':DB.getObjectId(id)});
    // console.log(res);
    await ctx.render('admin/nav/edit',{
        list:res[0],
        prevPage:ctx.state.G.prevPage
    });
});
router.post('/doEdit',async (ctx)=>{
    var prevPage=ctx.request.body.prevPage;
    var id=ctx.request.body.id;
    var title=ctx.request.body.title;
    var url=ctx.request.body.url;
    var sort=ctx.request.body.sort;
    var status=ctx.request.body.status;
    var addTime=tools.getTime();
     var json={
            title,url,sort,status,addTime
     };  
    await DB.update('nav',{'_id':DB.getObjectId(id)},json);//集合、条件、数据
    if(prevPage){
       ctx.redirect(prevPage);
    }else{
       ctx.redirect(ctx.state.__HOST__+'/admin/nav');
    }
});
router.get('/delete',async (ctx)=>{
    ctx.body="删除用户";
});
module.exports=router.routes();