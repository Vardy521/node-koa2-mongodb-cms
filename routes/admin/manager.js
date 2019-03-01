'use strict'
const Router=require('koa-router');
var DB=require('../../module/db');
var router=new Router();
var tools=require('../../module/tools');
router.get('/',async (ctx)=>{
    var result=await DB.find('admin',{});
    console.log(result);
    // ctx.body="用户管理首页";
    await ctx.render('admin/manager/index',{
        list:result
    });
});
router.get('/add',async (ctx)=>{
    // ctx.body="增加用户";
    await ctx.render('admin/manager/add');
});
router.post('/doAdd',async (ctx)=>{
    // ctx.body="新增成功";
    
    // console.log(ctx.request.body);

    // 
    //1、获取表单提交的数据
    var username=ctx.request.body.username;
    var password=ctx.request.body.password;
    var rpassword=ctx.request.body.rpassword;
    // 2、验证表单数据是否合法
    if(!/^\w{4,20}/.test(username)){//密码长度要>4小于20

        await ctx.render('admin/error',{
            message:'用户名不合法',
            redirect:ctx.state.__HOST__+'/admin/manager/add'
        })
    }else if(password!=rpassword || password.length<6){
        await ctx.render('admin/error',{
            message:'两次输入密码不一致或者密码长度小于6位',
            redirect:ctx.state.__HOST__+'/admin/manager/add'
        })
    }else{
        // 3、在数据库查询当前要增加的管理员是否存在
        var result=await DB.find('admin',{'username':username});
        if(result.length>0){
            await ctx.render('admin/error',{
                message:'该管理员已存在',
                redirect:ctx.state.__HOST__+'/admin/manager/add'
            })
        }else{
            // 4、增加管理员
            var addResult=await DB.insert('admin',{'username':username,'password':tools.md5(password),'status':1,'last_time':''});
            if(addResult){
                ctx.redirect(ctx.state.__HOST__+'/admin/manager');
            }
        }
    }

    
});
router.get('/edit',async (ctx)=>{
    // ctx.body="编辑用信息";
    var id=ctx.query.id;
    var result=await DB.find('admin',{'_id':DB.getObjectId(id)});
    if(result){
        ctx.render('admin/manager/edit',{
            list:result[0]
        });
    }
});
router.post('/doEdit',async (ctx)=>{
    // console.log(ctx.request.body);
    // ctx.body='编辑';
     //1、获取表单提交的数据
     try{
        var username=ctx.request.body.username;
        var password=ctx.request.body.password;
        var rpassword=ctx.request.body.rpassword;
        var id=ctx.request.body.id;
       // 2、验证表单数据是否合法
       if(password!=''){//密码不为空则判断
            if(!/^\w{4,20}/.test(username)){//密码长度要>4小于20
        
                await ctx.render('admin/error',{
                    message:'用户名不合法',
                    redirect:ctx.state.__HOST__+'/admin/manager/add'
                })
            }else if(password!=rpassword || password.length<6){
                await ctx.render('admin/error',{
                    message:'两次输入密码不一致或者密码长度小于6位',
                    redirect:ctx.state.__HOST__+'/admin/manager/edit?id='+id
                })
            }else{
                // 更新密码
                var updateResult=await DB.update('admin',{'_id':DB.getObjectId(id)},{'password':tools.md5(password)});
                // var updateResult=await DB.update('admin',{"_id":DB.getObjectId(id)},{"password":tools.md5(password)});
                ctx.redirect(ctx.state.__HOST__+'/admin/manager');
            }
        }else{//密码为空则保留原密码
                ctx.redirect(ctx.state.__HOST__+'/admin/manager');
        }
    }catch(err){
        await ctx.render('admin/error',{
            message:err,
            redirect:ctx.state.__HOST__+'/admin/manager'
        })
    }
});
router.get('/delete',async (ctx)=>{
    ctx.body="删除用户";
});
module.exports=router.routes();