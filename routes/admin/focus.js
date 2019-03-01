'use strict'
const Router=require('koa-router');
var DB=require('../../module/db');
var router=new Router();
var tools=require('../../module/tools');

//配置上传图片
// var kmulter=require('koa-multer');
// var storage = kmulter.diskStorage({
//     destination:function (req, file, cb) {
//         cb(null, 'resource/upload');   /*配置图片上传的目录     注意：图片上传的目录必须存在*/
//     },
//     filename:function (req, file, cb) {   /*图片上传完成重命名*/
//         var fileFormat = (file.originalname).split(".");   /*获取后缀名  分割数组*/
//         cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
//     }
// });
// var myupload = kmulter({ storage: storage });

router.get('/',async (ctx)=>{
    var page=ctx.query.page || 1;
    var pageSize=3;
    var result=await DB.findPage('focus',{},{},{
        page,
        pageSize,
        sort:{
            addTime:-1
        }
    });
    var countResult=await DB.count('focus',{});
    await ctx.render('admin/focus/index',{
        list:result,
        page:page,
        totalPages:Math.ceil(countResult/pageSize)
    });
    // ctx.body="轮播图";
});
router.get('/add',async (ctx)=>{
//    ctx.body='增加轮播图';
      await ctx.render('admin/focus/add',{});
});
router.post('/doAdd',tools.multer().single('focuspic'),async (ctx)=>{
   //接收post过来的数据
  //注意在模板中设置enctype
  var title=ctx.req.body.title;
  var pic=ctx.req.file? ctx.req.file.path.substr(9):'';
  var url=ctx.req.body.focusurl;
  var sort=ctx.req.body.sort;
  var status=ctx.req.body.status;
  var addTime=tools.getTime();
//    ctx.body={
//     filename:ctx.req.file?ctx.req.file.filename:'',//返回文件名
//     body:ctx.req.body
//    };
   await DB.insert('focus',{
       title,pic,url,sort,status,addTime
   });
   ctx.redirect(ctx.state.__HOST__+'/admin/focus');
});
router.get('/edit',async (ctx)=>{
    // ctx.body='编辑轮播图';
    var id=ctx.query.id;
    var res=await DB.find('focus',{'_id':DB.getObjectId(id)});
    // console.log(res);
    await ctx.render('admin/focus/edit',{
        list:res[0],
        prevPage:ctx.state.G.prevPage
    });
});
router.post('/doEdit',tools.multer().single('focuspic'),async (ctx)=>{
    var prevPage=ctx.req.body.prevPage;
    var id=ctx.req.body.id;
    var title=ctx.req.body.title;
    var pic=ctx.req.file? ctx.req.file.path.substr(9):'';
    var url=ctx.req.body.focusurl;
    var sort=ctx.req.body.sort;
    var status=ctx.req.body.status;
    var addTime=tools.getTime();
    if(pic){
        var json={
            title,pic,url,sort,status,addTime
        }
    }else{
        var json={
            title,url,sort,status,addTime
        }
    }
    await DB.update('focus',{'_id':DB.getObjectId(id)},json);//集合、条件、数据
    if(prevPage){
       ctx.redirect(prevPage);
    }else{
       ctx.redirect(ctx.state.__HOST__+'/admin/focus');
    }
});
router.get('/delete',async (ctx)=>{
    ctx.body="删除用户";
});
module.exports=router.routes();