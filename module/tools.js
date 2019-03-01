'use strict'
var md5=require('md5');
var kmulter=require('koa-multer');
let tools={
    md5(str){
        return md5(str);
    },
    cateToList(data){
        // console.log(data);
        // 1、获取一级分类
        var firstArr=[];
        for(var i=0;i<data.length;i++){
            if(data[i].pid==0){
                firstArr.push(data[i]);
            }
        }
        // console.log(firstArr);
        // 2、获取二级分类
        for(var i=0;i<firstArr.length;i++){
            firstArr[i].list=[];
            //遍历所有数据 看哪个数据的pid等于当前数据的id
            for(var j=0;j<data.length;j++){
                if(data[j].pid==firstArr[i]._id){
                    firstArr[i].list.push(data[j]);
                }
            }
        }
        // console.log(firstArr);
        return firstArr;
    },
    getTime(){
        return new Date();
    },
    // 上传图片
    multer(){
        //配置上传图片
            var storage = kmulter.diskStorage({
                destination:function (req, file, cb) {
                    cb(null, 'resource/upload');   /*配置图片上传的目录     注意：图片上传的目录必须存在*/
                },
                filename:function (req, file, cb) {   /*图片上传完成重命名*/
                    var fileFormat = (file.originalname).split(".");   /*获取后缀名  分割数组*/
                    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
                }
            });
            var myupload = kmulter({ storage: storage });
            return myupload;
    }
}
module.exports=tools;