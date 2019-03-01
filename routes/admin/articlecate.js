'use strict'
const Router=require('koa-router');
var DB=require('../../module/db');
var router=new Router();
var tools=require('../../module/tools');
router.get('/',async (ctx)=>{
    ctx.body="分类";
    var result=await DB.find('articlecate',{});
    var clist=tools.cateToList(result);//格式化数据，将数据库中的数据格式转换成下面注释掉的obj格式
    // console.log(clist);
    await ctx.render('admin/articlecate/index',{
        list:clist
    });
    // console.log(result);
    // var  obj=[
    //     {
    //         'title':'高管',
    //         'list':[
    //             {
    //               title:'滴管1'
    //             },
    //             {
    //                 title:'滴管2'
    //               }
    //         ]
    //     },
    //     {
    //         'title':'校长',
    //         'list':[
    //             {
    //                 title:'学生1'
    //             },
    //             {
    //                 title:'学生2'
    //               }
    //         ]
    //     }
    // ];
});
router.get('/add',async (ctx)=>{
    // 获取一级分类
    var result=await DB.find('articlecate',{'pid':'0'});
    // console.log(result);
    await ctx.render('admin/articlecate/add',{
        catelist:result
    });
});
router.post('/doAdd',async (ctx)=>{
    //  console.log(ctx.request.body);
    var addData=ctx.request.body;
    var result=await DB.insert('articlecate',addData);
    ctx.redirect(ctx.state.__HOST__+'/admin/articlecate');
    // if(result.ok){
    //     ctx.redirect(ctx.state.__HOST__+'/admin/articlecate');
    // }else{
    //     console.log('失败');
    // }
});
router.get('/edit',async (ctx)=>{
    // ctx.body="编辑用信息";
    var id=ctx.query.id;
    var result=await DB.find('articlecate',{'_id':DB.getObjectId(id)});
    var result1=await DB.find('articlecate',{'pid':'0'});
    // console.log(result);
    if(result && result1){
        ctx.render('admin/articlecate/edit',{
            list:result[0],
            catelist:result1
        });
    }
});
router.post('/doEdit',async (ctx)=>{
  var editData=ctx.request.body;
  var id=editData.id;
  var title=editData.title;
  var keyword=editData.keywords;
  var description=editData.description;
  var status=editData.status;
  var pid=editData.pid;

  var result=await DB.update('articlecate',{'_id':DB.getObjectId(id)},{
      title,
      keyword,
      description,
      pid
  });
  if(result){
      ctx.redirect(ctx.state.__HOST__+'/admin/articlecate');
  }
});
router.get('/delete',async (ctx)=>{
    ctx.body="删除用户";
});
module.exports=router.routes();