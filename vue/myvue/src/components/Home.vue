<template>
    <div id="home">
        <button @click="getData()">请求数据</button><br /><br /><br />
        <button @click="addData()">增加数据</button><br /><br /><br />
        <button @click="setData()">修改数据</button><br /><br /><br />
        <button @click="deleteData()">删除数据</button><br />
    </div>
</template>
<script>
  export default{
        data(){
            return {

                msg:'我是一个首页组件msg',
                flag:true,
                list:[]
            }
        },
        methods:{

            getData(){
                    //请求数据

                    var api='http://localhost:8888/api/newslist?page=1';


                    this.$http.jsonp(api).then((response)=>{
                        console.log(response);

                        //注意this指向
                        this.list=response.body.result;
                    },function(err){

                            console.log(err);

                    })

            },
            addData(){
                    //请求数据

                    var api='http://localhost:8888/api/addCart';

                    this.$http.post(api,{
                        "title":"小炒肉111",
                        "price":"201",
                        "num":1
                    }).then((response)=>{
                        console.log(response);
                    },function(err){
                          console.log(err);

                    })

            },
            setData(){
                    //请求数据

                    var api='http://localhost:8888/api/editCart';

                    this.$http.put(api,{
                        "title":"拆采光好查",
                        "price":"201",
                        "num":1
                    }).then((response)=>{
                        console.log(response);
                    },function(err){
                          console.log(err);

                    })

            },
            deleteData(){
                    //请求数据

                    var api='http://localhost:8888/api/removeCart?id=111111';


                    this.$http.delete(api).then((response)=>{
                        console.log(response);

                        //注意this指向
                        this.list=response.body.result;
                    },function(err){

                            console.log(err);

                    })

            },
        },
        
           
        mounted(){  /*生命周期函数*/

                this.getData();

        }
       

    }
</script>