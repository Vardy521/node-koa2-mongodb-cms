'use strict'
const Router=require('koa-router');
var DB=require('../../module/db');
var router=new Router();
var tools=require('../../module/tools');

router.get('/',async (ctx)=>{ 
    // ctx.body="系统设置";
    var result=await DB.find('setting',{});
    console.log(result);
    ctx.render('admin/setting/index',{
        list:result[0]
    });
});
router.post('/doSave',tools.multer().single('logo'),async (ctx)=>{
    var id=ctx.req.body.id;
    var title=ctx.req.body.title;
    var keyword=ctx.req.body.keyword;
    var description=ctx.req.body.description;
    var logo=ctx.req.file? ctx.req.file.path.substr(9):'';
    var icp=ctx.req.body.icp;
    var contact_qq=ctx.req.body.contact_qq;
    var addr=ctx.req.body.addr;
    var status=ctx.req.body.status;
    if(logo){
        var json={
            title,keyword,description,logo,icp,contact_qq,addr,status
        };
    }else{
        var json={
            title,keyword,description,icp,contact_qq,addr,status
        };
    }
    // var result=await DB.update('setting',{'_id':DB.getObjectId(id)},json);
    var result=await DB.update('setting',{},json);//因为只有一条数据并且是更新所有数据，所以中间的{'_id':DB.getObjectId(id)}查询条件可以不设置
    if(result){
        console.log('设置成功');
        ctx.redirect(ctx.state.__HOST__+'/admin/setting');
    }else{
        console.log('设置出错,请检查');
    }
})
module.exports=router.routes();