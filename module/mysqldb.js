// mysql
const mysql=require('mysql');
// 创建连接
function getConnect(){
        var connection = mysql.createConnection({
            host: 'localhost',
            port:3308,
            user:'root',
            password:'123456',
            database:'koacms'
        });
        connection.connect();
        return connection;
    }
    //查询
    function find(sql,params=null){
        // 获取数据库连接对象
        var connection=getConnect();
        
        return new Promise((resolve,reject)=>{
             // 执行sql语句
            connection.query(sql,params,function (error, results, fields) {
                if (error) throw error;
                resolve(results);
                // console.log(results);
            });
        })
        connection.end();  //关闭连接
    }
    function add(sql,params=null){
        // 获取数据库连接对象
        var connection=getConnect();
        
        return new Promise((resolve,reject)=>{
             // 执行sql语句
            connection.query(sql,params,function (error, results, fields) {
                if (error) throw error;
                resolve(results);
                // console.log(results);
            });
        })
        connection.end();  //关闭连接
    }
    function update(sql,params=null){
        // 获取数据库连接对象
        var connection=getConnect();
        
        return new Promise((resolve,reject)=>{
             // 执行sql语句
            connection.query(sql,params,function (error, results, fields) {
                if (error) throw error;
                resolve(results);
                // console.log(results);
            });
        })
        connection.end();  //关闭连接
    }
    module.exports={
        find,
        add,
        update,

        // count,
        // insert,
        // update,
        // remove
    }