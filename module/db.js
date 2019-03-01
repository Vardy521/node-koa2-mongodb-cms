'use strict'
// const Koa=require('koa');
const MongoClient=require('mongodb').MongoClient;
var ObjectID=require('mongodb').ObjectID;
var Config=require('./config');

class DB{
    static getInstance(){//单例 解决多次实例化 实例不共享的问题
        if(!DB.instance){
            DB.instance=new DB();
        }
        return DB.instance;   
    }
    constructor(){
        this.dbclient='';//
        this.connect();//实例化时连接数据库
    }
    //连接数据库
    connect(){
       return new Promise((resolve,reject)=>{
       if(!this.dbclient){//解决数据库多次连接的问题
        MongoClient.connect(Config.dbUrl,(err,client)=>{
            if(err){
                console.log(err);
                reject(err);
                return;
            }else{
                this.dbclient=client.db(Config.dbName);
                resolve(this.dbclient);
            }
        });
    }else{
                resolve(this.dbclient);
        }
      })
    }
    //查询
    find(collectionName,json){//json:查询条件
        return new Promise((resolve,reject)=>{
        this.connect().then((db)=>{
            var res=db.collection(collectionName).find(json);
            res.toArray((err,data)=>{
                if(err){
                    reject(err);
                    return;
                }else{
               // console.log(data);
                resolve(data);
                }
            })
         })
        })
    }
    //分页查询
    findPage(collectionName,json1,json2,json3){
        // DB.findPage('表',{}) //返回所有数据
        // DB.findPage('表',{},{'title':1})//只返回一列
        // DB.findPage('表',{},{'title':1},{
        //     page:2,
        //     pageSize:20
        // });//返回第二页数据
        if(arguments.length==2){//arguments.length:传入参数的个数
            var attr={};
            var skipNum=0;
            var pageSize=0;
        }else if(arguments.length==3){
            var attr=json2;
            var skipNum=0;
            var pageSize=0;
        }else if(arguments.length==4){
            var attr=json2;
            var page=json3.page || 1;
            var pageSize=json3.pageSize || 20;
            var skipNum=(page-1)*pageSize;
            if(json3.sort){
                var orderJson=json3.sort;
            }else{
                var orderJson={};
            }
        }else{
            console.log('参数错误');
        }
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                var res=db.collection(collectionName).find(json1,{fields:attr}).skip(skipNum).limit(pageSize).sort(orderJson);//sort:排序
                res.toArray((err,data)=>{
                    if(err){
                        reject(err);
                        return;
                    }else{
                   // console.log(data);
                    resolve(data);
                    }
                })
             })
        })
    }
    //统计表中数据量的方法
    count(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                var result=db.collection(collectionName).count(json);
                result.then(function(count){
                    resolve(count);
                });
            });
        })
    }
    // 插入
    insert(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).insertOne(json,(err,res)=>{
                    if(err){
                        console.log(err);
                        reject(err);
                        return;
                    }else{
                        resolve(res);
                    }
                })
            })
        })
    }
    //更新
    update(collectionName,json1,json2){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).updateOne(json1,{
                    $set:json2
                },(err,res)=>{
                    if(err){
                        reject(err);
                        return;
                    }else{
                        resolve(res);
                    }
                })
            })
        })
    }
    //删除
    remove(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).removeOne(json,(err,res)=>{
                    if(err){
                        reject(err);
                        return;
                    }else{
                        resolve(res);
                    }
                })
            })
        })
    }
    //获取数据id
    getObjectId(id){//mongodb中查询 把_id字符串转换成对象 
        return new ObjectID(id);
    }
}
//  var mydb=new DB();
// var mydb=DB.getInstance();//单例
// console.time('start');
// mydb.find('user',{}).then((data)=>{
//     //console.log(data);
//     console.timeEnd('start');
// });
// setTimeout(()=>{
//     console.time('开始1');
//     mydb.find('user',{}).then((data)=>{
//    // console.log(data);
//     console.timeEnd('开始1');
//   });
// },100)
// setTimeout(()=>{
//     console.time('开始2');
//     mydb.find('user',{}).then((data)=>{
//     //console.log(data);
//     console.timeEnd('开始2');
//   });
// },2000)

// // var mydb1=new DB();
// var mydb1=DB.getInstance();//单例
// setTimeout(()=>{
//     console.time('开始11');
//     mydb1.find('user',{}).then((data)=>{
//     //console.log(data);
//     console.timeEnd('开始11');
//   });
// },5000)
// setTimeout(()=>{
//     console.time('开始22');
//     mydb1.find('user',{}).then((data)=>{
//    // console.log(data);
//     console.timeEnd('开始22');
//   });
// },8000)

module.exports=DB.getInstance();