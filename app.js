'use strict'
const Koa=require('koa');
const Router=require('koa-router');
const artTemp=require('koa-art-template');
const path=require('path');
const kstatic=require('koa-static');
const　session=require('koa-session');
const bodyParser=require('koa-bodyparser');
const sd=require('silly-datetime');
const kmulter=require('koa-multer');
var k2cors=require('koa2-cors');
var app=new Koa();
var router=new Router();
// const stringify = require('json-array-stream')
const jsonp = require('koa-jsonp')

//mysql数据库
const mydb=require('./module/mysqldb');
// mydb.find('select * from user');

//配置post提交的中间件
app.use(bodyParser());

//配置后台允许跨域  允许后台跨域后安全性如何解决:签名验证
app.use(jsonp());//只能跨域获取数据

app.use(k2cors());//可以post、get数据


// 文件上传
// app.use(kmulter({dest:'./uploads/'}));

// 配置模板引擎
artTemp(app,{
    root:path.join(__dirname,'views'),
    extname:'.html',
    debug:process.env.NODE_ENV!='production',
    // dateFormat:dateFormat=function(value){
    //     return sd.format(value,'YYYY-MM-DD HH:mm')//扩展模板里面的方法
    // }
});
//配置session中间件
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',
    maxAge: 864000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true,   /*每次请求都重新设置session*/
    renew: false,
};
app.use(session(CONFIG, app));

// app.use(kstatic('.'));//这样配置不安全，因为任何文件包括app.js都能随意访问

//配置静态资源(css、js之类)路径
app.use(kstatic(__dirname+'/resource'));

// 引入模块
var admin=require('./routes/admin.js');
var index=require('./routes/index.js');
var api=require('./routes/api');

router.use('/admin',admin);
router.use('/api',api);
router.use(index);
router.get('/',async (ctx)=>{
    var sql='select * from user';
    var result=await mydb.find(sql);
    // console.log(result);
    await ctx.render('index',{
        list:result
    });
});
router.get('/add',async (ctx)=>{
    var username='大码码';
    var password='55555';
    
    var sql=`insert into user (username,password) values (?,?)`;
    var params=[username,password];

    // var sql=`insert into user (username,password) values ('你大哈','heheje')`;
    var result=await mydb.add(sql,params);
    // console.log(result);
   ctx.redirect('/');
});
router.get('/edit',async (ctx)=>{
    var username='改改改狗狗狗狗狗哥哥';
    var password='55555';
    
    var sql='update user set username=? where id=7';
    var params=[username];
    var result=await mydb.find(sql,params);
    // console.log(result);
   ctx.redirect('/');
});
router.get('/delete',async (ctx)=>{
    var username='小妈马66666666666666666666';
    var password='55555';
    
    var sql='delete from user where id=7';
    // var params=[username];
    var result=await mydb.find(sql);
    // console.log(result);
   ctx.redirect('/');
});

app.use(router.routes()).use(router.allowedMethods());//开启路由

app.listen(8888);





