'use strict'
const Router=require('koa-router');
var router=new Router();
var url=require('url');
const DB=require('../module/db');


//获取每个页面的公共数据，如导航
router.use(async (ctx,next)=>{
    var pathname=url.parse(ctx.request.url).pathname;
    // console.log(pathname);
    // 导航
    // console.time('start');
    var navResult=await DB.findPage('nav',{},{},{
        sort:{
            sort:1
        }
    });
    // 系统设置
    var setting=await DB.find('setting',{});
    // 模板引擎配置全局的变量
    ctx.state.nav=navResult;
    ctx.state.pathname=pathname;
    ctx.state.setting=setting[0];
    await next();
});


router.get('/',async (ctx)=>{
    // ctx.body='前端首页';
    // 轮播图
    var focusResult=await DB.findPage('focus',{$or:[{'status':'1'},{'status':1}]},{},{//status'1' 或 status=1
        sort:{
            sort:1
        }
    });
    //友情链接
    var links=await DB.findPage('link',{$or:[{'status':'1'},{'status':1}]},{},{//status'1' 或 status=1
        sort:{
            sort:1
        }
    });
    // console.timeEnd('start');
    // console.log(navResult);
    ctx.render('web/index',{
        focus:focusResult,
        links:links
    });
});
router.get('/news',async (ctx)=>{
    // ctx.body='新闻';
    var pid=ctx.query.pid;
    var page=ctx.query.page || 1;
    var pageSize=2;

    //获取新闻分类下的子分类
    var cateResult=await DB.find('articlecate',{'pid':'5c6e0922c0fef02aa8371e31'});

    // ctx.state.setting.sitetitle=cateResult[0].title;
    ctx.state.setting.keyword=cateResult[0].keywords;
    ctx.state.setting.description=cateResult[0].description;

    // console.log(cateResult);
    if(pid){
        var cateDResult=await DB.find('articlecate',{'_id':DB.getObjectId(pid)});
        ctx.state.setting.sitetitle=cateDResult[0].title;
        // console.log(cateDResult);
        var newsLIst=await DB.findPage('article',{'pid':pid},{},{
            page,
            pageSize
        });
        var articleNum=await DB.count('article',{'pid':pid});
    }else{
        ctx.state.setting.sitetitle='新闻资讯';
        // console.log(ctx.state.setting.sitetitle);
        var subCaseArr=[];
        for(var i=0;i<cateResult.length;i++){
            subCaseArr.push(cateResult[i]._id.toString());
        }
        var articleNum=await DB.count('article',{'pid':{$in:subCaseArr}});
        var newsLIst=await DB.findPage('article',{'pid':{$in:subCaseArr}},{},{
            page,
            pageSize
        });
    }
    // console.log(articleNum);
    ctx.render('web/news',{
        cateList:cateResult,
        articleList:newsLIst,
        pid:pid,
        page:page,
        totalPages:Math.ceil(articleNum/pageSize)
    });
});
router.get('/service',async (ctx)=>{
    // ctx.body='服务';
    var serviceResult=await DB.find('article',{'pid':'5c6e0a7ec0fef02aa8371e34'});

    //要在渲染页面之前设置标题、关键字、描述
    ctx.state.setting.sitetitle='个人网站-服务';
    ctx.state.setting.keyword='个人、网站、展示、官网、Node.js、MongoDB、服务、服务内容';
    ctx.state.setting.description='服务内容简单描述';
    // console.log(serviceResult);
    ctx.render('web/service',{
        serviceList:serviceResult
    });
});
router.get('/info/:id',async (ctx)=>{
    // console.log(ctx.params);
    // ctx.render('web/info');
    var id=ctx.params.id;
    var info=await DB.find('article',{'_id':DB.getObjectId(id)},{});

    //1、根据文章获取文章分类信息
    // 2、根据文章分类信息去导航表查找当前分类信息的url
    // 3、把url复制给pathname

    // 获取当前文章的分类信息
    var cateResult=await DB.find('articlecate',{'_id':DB.getObjectId(info[0].pid)});
     // 在导航表查找当前分类对应的url信息
    if(cateResult[0].pid=='0'){//父分类（最顶级分类）
        var navResult=await DB.find('nav',{'title':cateResult[0].title});
    }else{//子分类
        // 找到当前分类的父分类
        var parentResult=await DB.find('articlecate',{'_id':DB.getObjectId(cateResult[0].pid)});
        var navResult=await DB.find('nav',{$or:[{'title':cateResult[0].title},{'title':parentResult[0].title}]});
    }
    // console.log(cateResult);
    // console.log(navResult);
    // 把url赋值给pathname
    if(navResult.length>0){
       ctx.state.pathname=navResult[0].url;
    }else{
        ctx.state.pathname='/';
    }

    ctx.render('web/info',{
        info:info[0]
    });
    // console.log(info);
})
router.get('/about',async (ctx)=>{
    // ctx.body='关于我们';
    ctx.render('web/about');
});
router.get('/contact',async (ctx)=>{
    // ctx.body='联系我们';
    ctx.render('web/connect');
});
router.get('/case',async (ctx)=>{
    var cid=ctx.query.cid;
    var page=ctx.query.page || 1;
    var pageSize=2;

    var caseResult=await DB.find('articlecate',{'pid':'5c6e08abc0fef02aa8371e2c'});

    if(cid){//如果有分类则查询该分类下的数据
        var articleList=await DB.findPage('article',{'pid':cid},{},{
            page,pageSize
        });
        var articleNum=await DB.count('article',{'pid':cid});
    }else{//获取所有分类的数据
        var subCaseArr=[];
        for(var i=0;i<caseResult.length;i++){
        subCaseArr.push(caseResult[i]._id.toString());
        }
    // console.log(subCaseArr);
       var articleNum=await DB.count('article',{'pid':{$in:subCaseArr}});
       var articleList=await DB.findPage('article',{'pid':{$in:subCaseArr}},{},{
           page,pageSize
       });
    // console.log(articleList);
    }
    // 循环子分类获取所有子分类下的数据 
    ctx.render('web/case',{
        caselist:caseResult,
        articlelist:articleList,
        cid:cid,
        page:page,
        totalPages:Math.ceil(articleNum/pageSize)
    });
});
module.exports=router.routes();