## MongoDB数据库的基本概念
    - 可以有多个数据库
    - 一个数据库中可以有多个集合（相当于SQL中的表）【数组】
    - 一个集合中可以有多个文档（表记录）
    - 文档结构很灵活，没有任何限制

### MongoDB的存储结构
```js
// 大括号就是MongoDB
{
    // 里面有很多不同的数据库，每个数据库也是一个对象
    qq: {
        // qq数据库里面有很多的集合（表），users数据集合就是数组
        users: [
            {name: '张三', age:25},
            {name: '张三', age:25},
            {name: '张三', age:25},
            {name: '张三', age:25},
            {name: '张三', age:25},
            ...
        ],
        products: [

        ],
        ...
    },
    taobao: {

    },
    baidu: {

    }
}
```

## 启动和关闭数据库
启动：
```shell
# mongodb 默认使用 执行 mongod 命令所处盘符根目录下的 /data/db 作为自己的数据存储目录
# 所以在第一次执行该命令之前先自己手动新建一个 /data/db 文件夹
mongod #启动mongodb服务
```

如果想要修改默认的数据存储目录，可以：
```shell
mogod --dvpath=数据存储目录路径
```
停止：
```shell
关闭开启服务的控制台
```

## 连接数据库
```shell
# 该命令默认连接本机的 MongoDB 服务
mongo
```
退出：
```shell
#在连接状态输入 exit 退出连接
exit
```

## 基本命令
- `show dbs`
    + 查看显示所有数据库
- `db`
    + 查看当前操作的数据库
- `use 数据库名称`
    + 切换到指定的数据库（如果没有会新建）
- 插入数据(是插入一个对象,没有任何限制，非常灵活)
    + `db.students.insertOne({"name": "jack"})`
    +  `db.students.insertOne({"name": "jack","age": 18})`
 - 查询表(NoSQL里没有表的概念。表就是集合collection)
    + `show collections`
- 查询数据
    + `db.students.find()`

## 在Node中如何操作MongoDB数据库
### 使用 mongoose 来操作mongoDB数据库
第三方包： `mongoose` 基于MongoDB官方的`mongodb`包再一次做了封装
网址：(mongoosejs.com)

### mongoose HelloWorld
```js
const mongoose = require('mongoose');

// 连接 MongoDB 数据库 
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

// 创建一个模型，就是在设计数据库
// MongoDB 是动态的，非常灵活，只需要在代码中设计你的数据库就可以了。
// mongoose 这个包就可以让你的设计编写过程变得非常简单
const Cat = mongoose.model('Cat', { name: String }); //第一个参数是表名，也就是集合名称，会自动生成一个小写的cats集合，第二个参数就是数据结构

// 实例化一个 Cat
const kitty = new Cat({ name: 'Zildjian' });

// 持久化保存 kitty实例
kitty.save().then(() => console.log('meow'));
```


- ### 连接数据库
```
var mongoose = require('mongoose')
1. 连接数据库，指定连接的数据库不需要存在，当你插入第一条数据之后就会被自动创建出来
mongoose.connect('mongodb://localhost/test') 
```

- ### Defining your schema
    + Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
    + Schema里面可以加约束
```js
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var blogSchema = new Schema({
    title:  {
        type: String,
        required: true
    }, 
    author: String,// String is shorthand for {type: String}
    body:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
      votes: Number,
      favs:  Number
    }
  });
```

- ### Creating a model
To use our schema definition, we need to convert our blogSchema into a Model we can work with.

第一个参数：
    - 传入一个大写名词单数字符串用来表示你的数据库名称
    - mongoose 会自动将大写名词单数的字符串 解析成 小写复数 形式的集合名称作为最终数据库里面的集合名
    - 例如这里的 `User` 最终会变成 `users` 集合名称
第二个参数：架构Schema

返回值： 模型构造函数
```js
 var Blog = mongoose.model('Blog', blogSchema);
```
- ###Constructing Documents
An instance of a model is called a document. Creating them and saving to the database is easy.

## 增删改查
### 增加一条数据
```js
var mongoose = require('mongoose')

// 1. 连接数据库，指定连接的数据库不需要存在，当你插入第一条数据之后就会被自动创建出来
mongoose.connect('mongodb://localhost/itcast')

 var Schema = mongoose.Schema;

// 2. 设计文档结构（表结构），包括约束
// 约束的目的是为了保证数据的完整性，不要有脏数据

var userSchema = new Schema({
    username: { // 后面加个对象就代表对username这个字段添加约束
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
})

// 3. 将文档结构发布为模型
var User = mongoose.model('User', userSchema)


// 新增一条数据，通过new({对象})
var admin = new User({
    username: 'admin',
    password: '12345678',
    email: 'why1234me@163.com'
})

// 持久化保存
admin.save(function (err, ret) {
    if (err) {
        console.log('存储失败')
    } else {
        console.log('保存成功')
        console.log(ret)
    }
})
```

### 查询数据
Model 的方法中包含查询条件参数的（ find findById count update ）都可以按以下两种方式执行：

- 传入 callback 参数，操作会被立即执行，查询结果被传给回调函数（ callback ）。

- `模型.find({查询条件1,查询条件2}, '查询字段1 查询字段2', 回调函数)`

find方法查出来的是满足的文档数组，findOne方法查出来的是满足查询的第一个文档。

```js
User.find({ username: 'admin', password: '12345678'},  'username password', function (err, docs) {
        if (err) {
            console.log("查询失败")
        } else {
            console.log(docs)
        }
    } )

```
find查询结果：是个数组
```shell
[
  {
    _id: 5def5e6386ca9ac838313c0b,
    username: 'admin',
    password: '12345678'
  }
]
```
- 不传 callback 参数，Query 的一个实例（一个 query 对象）被返回，这个 query 提供了构建查询器的特殊接口。
    + 查询条件
        * `var query = User.findOne({ 'username': 'admin' })`
    + 查询字段（用query对象来查询）
        * `query.select('username email')`
    + 执行查询
        * `query.exec(function (err, doc) { });`
        
findOne查询结果：是个对象
```shell
{
  _id: 5def5e6386ca9ac838313c0b,
  username: 'admin',
  email: 'why1234me@163.com'
}
```

### 删除：
- Model.remove()：

` DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.`
`Removes all documents that match conditions from the collection. To remove just the first document that matches conditions, set the single option to true.`

示例：
```js
User.remove({ username: 'user3' }, function (err) {});
```
- Model.deleteOne():

`Deletes the first document that matches conditions from the collection. Behaves like remove(), but deletes at most one document regardless of the single option.`

示例：
```js
User.deleteOne({ username: 'user2' }, function (err) { }
```

- Model.deleteMany():

>Deletes all of the documents that match conditions from the collection. Behaves like remove(), but deletes all documents that match conditions regardless of the single option.

示例：
```js
User.deleteMany({ username: 'user2' }, function (err) { }
```

### 更新
- Model.findByIdAndUpdate(id, update, callback)：根据Id更新一个
示例：
```js
User.findByIdAndUpdate('5def6d64857c1cc8644e3778', {password: '123'}, function (err, ret) { })
```
- Model.findOneAndUpdate(conditions, update, callback)