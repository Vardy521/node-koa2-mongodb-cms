'use strict'
const Router=require('koa-router');
const tools=require('../../module/tools');
const DB=require('../../module/db');
var svgCaptcha=require('svg-captcha');
var router=new Router();
router.get('/',async (ctx)=>{
    // ctx.body="用户管理首页";
     await ctx.render('admin/login');
});
router.get('/add',async (ctx)=>{
    ctx.body="增加用户";
});
router.get('/edit',async (ctx)=>{
    ctx.body="编辑用信息";
});
router.get('/delete',async (ctx)=>{
    ctx.body="删除用户";
});
//
router.post('/doLogin',async (ctx)=>{
    console.log(ctx.request.body);
    let username=ctx.request.body.username;
    let password=ctx.request.body.password;
    let code=ctx.request.body.code;
    // 1、验证用户名、密码是否合法
    if(code.toLocaleLowerCase()==ctx.session.code.toLocaleLowerCase()){
        //严格点的后台也要验证输入的用户密码验证码是否合法
        var result=await DB.find('admin',{'username':username,'password':tools.md5(password)})
        if(result.length>0){
            console.log('成功');
            ctx.session.userinfo=result[0];

            //更新用户表  改变用户登录时间
            await DB.update('admin',{'_id':DB.getObjectId(result[0]._id)},{
                last_time:new Date()
            });

            ctx.redirect(ctx.state.__HOST__+'/admin');
        }else{
            // console.log('失败');
            ctx.render('admin/error',{
                message:'用户名或密码错误',
                redirect:ctx.state.__HOST__+'/admin/login'
            });
        }
    }else{
        ctx.render('admin/error',{
            message:'验证码错误',
            redirect:ctx.state.__HOST__+'/admin/login'
        });
    }
    // 2、和数据库匹配
    // 3、登录成功后把用户信息写入session
});
// 验证码
router.get('/code',async (ctx)=>{
    // ctx.body='验证码';
    var captcha = svgCaptcha.create({
        //设置验证码样式
        size:4,
        fontSize:50,
        width:100,
        height:40,
        background:"#ccc"
    });
    // 设置响应头
    ctx.response.type='image/svg+xml';
    // 保存生成的验证码
    ctx.session.code=captcha.text;// ctx.session.code?????????
    // 加法验证
    // var captcha = svgCaptcha.createMathExpr({
    //     //设置验证码样式
    //     size:4,
    //     fontSize:50,
    //     width:100,
    //     height:40,
    //     background:"#888"
    // });
    // req.session.captcha = captcha.text;
    console.log(captcha.text);  
    // res.type('svg');
    // // res.status(200).send(captcha.data);
    ctx.body=captcha.data;
});
// 退出登录
router.get('/loginOut',async (ctx)=>{
    ctx.session.userinfo=null;
    ctx.redirect(ctx.state.__HOST__+'/admin/login');
})
module.exports=router.routes();