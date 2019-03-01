'use strict'
const Router=require('koa-router');
var router=new Router();
var url=require('url');

// 配置中间件获取url地址
router.use(async (ctx,next)=>{
    
    // 模板引擎配置全局变量
    ctx.state.__HOST__="http://"+ctx.request.header.host;
    var path=url.parse(ctx.request.url).pathname.substring(1);
    var splitUrl=path.split('/');
        // 配置全局信息
    ctx.state.G={//全局G变量
        url:splitUrl,
        userinfo:ctx.session.userinfo,
        prevPage:ctx.request.headers['referer']//记录上一页地址
    }
    // 权限判断
    if(ctx.session.userinfo){
        // 登录，继续向下匹配路由
        await next();
    }else{
        // 没有登录，跳转到登录界面
        if(path=='admin/login' || path=='admin/login/doLogin' || path=='admin/login/code'){
            await next();
            // console.log('dd')
        }else{
            ctx.redirect('/admin/login');
            // console.log('d99999999999999999999d')
        }
        // ctx.redirect('/admin/login');
        // console.log(ctx);      
    }
    //  await next();
});


// router.get('/',async (ctx)=>{
//     // ctx.body='后台管理首页';
//     await ctx.render('admin/index');
// });
// 引入模块
var index=require('./admin/index');
var login=require('./admin/login');
var user=require('./admin/user');
var manager=require('./admin/manager');
var articlecate=require('./admin/articlecate');
var article=require('./admin/article');
var focus=require('./admin/focus');
var link=require('./admin/link');
var nav=require('./admin/nav');
var setting=require('./admin/setting');
var ueditor=require('koa2-ueditor');

router.use(index);//后台首页
router.use('/login',login);
router.use('/user',user);
router.use('/manager',manager);
router.use('/articlecate',articlecate);
router.use('/article',article);
router.use('/focus',focus);
router.use('/link',link);
router.use('/nav',nav);
router.use('/setting',setting)


// 需要传一个数组：静态目录和 UEditor 配置对象
// 比如要修改上传图片的类型、保存路径
router.all('/editor/controller', ueditor(['resource', {
	"imageAllowFiles": [".png", ".jpg", ".jpeg"],
	"imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))

module.exports=router.routes();