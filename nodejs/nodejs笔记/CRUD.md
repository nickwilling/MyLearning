[bootstrap官方说明文档](https://www.bootcss.com/)

[bootstrap基本模板](https://v3.bootcss.com/getting-started/#template)

### 读取json
从文件读取到的数据一定是字符串,需要使用JSON.parse()成对象.

utf8是将二进制文件以utf8编码读取,出来的是字符串,也可以使用data.toString()
```javascript
fs.readFile('./db.json','utf8',  function (err, data) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('index.html', {
            fruits: JSON.parse(data).fruits,
            students: JSON.parse(data).students
            })
         
    })
```

### 路由设计
| 请求方法 | 请求路径        | get参数 | post参数                       | 备注             |
| -------- | :-------------- | :------ | :----------------------------- | ---------------- |
| GET      | /students       |         |                                | 渲染首页         |
| GET      | /students/new   |         |                                | 渲染添加学生页面 |
| POST     | /students/new   |         | name、age、gender、hobbies     | 处理添加学生请求 |
| GET      | /students/edit  | id      |                                | 渲染编辑页面     |
| POST     | /students/edit  |         | id、name、age、gender、hobbies | 处理编辑请求     |
| GET      | /student/delete | id      |                                | 处理删除请求     |

### 路由模块的提取
**方法1:**
- router.js:
```javascript
module.exports = function (app) {
    app.get('/', function (req, res) {
    })
})
```
- app.js
```javascript
var express = require('express')
var router = require('./router')

var app = express()

app.use('/node_modules/', express.static('./node_modules/'))
app.use('/public/', express.static('./public/'))

app.engine('html', require('express-art-template'))

router(app)

app.listen(3000, function () {
    console.log('running 3000...')
})  
```
**方法2:使用express框架**

- router.js
```javascript
// express 提供了一种专门来包装路由的方法
var express = require('express')
// 1. 创建一个路由容器
var router = express.Router()

// 2 . 把路由都挂载到 router 路由容器里
router.get('/', function (req, res) {
    // 因为直接读取的文件是以二进制的方式读取的
    // utf8将读取到的文件按utf8编码,转成我们能认识的字符
    // 也可使用data.toString()
    fs.readFile('./db.json','utf8',  function (err, data) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('index.html', {
            fruits: JSON.parse(data).fruits,
            students: JSON.parse(data).students

        })
})
})

//  3. 把router导出
module.exports = router
```
- app.js
```
var express = require('express')
var router = require('./router')

var app = express()

app.use('/node_modules/', express.static('./node_modules/'))
app.use('/public/', express.static('./public/'))

app.engine('html', require('express-art-template'))

// 把路由容器挂载到 app 服务中
app.use(router)

app.listen(3000, function () {
    console.log('running 3000...')
})  
```

### app.js 入口模块的作用
- 创建服务
- 做一些服务相关的配置
    + 模板引擎
    + body-parser解析表单 post 请求体
    + 提供静态资源服务
- 挂载路由
- 监听端口启动服务

### router.js 路由模块的作用
- 处理路由
- 根据不同的请求方法和请求路径设计不同的请求函数

## 数据操作文件模块(student.js封装对student数据库进行的操作)
往文件中写东西的方法:
    - 先读取出来,转成对象
    - 往对象中push数据
    - 再转成字符串写进文件

### 回调函数:获取异步操作的结果
下面的代码运行fn是得不到data的,因为设定了一个定时器,定时器是异步的, 隔1秒才会给data赋值,所以运行会返回空值[]

当js引擎的event 队列空闲时才会去执行队列里等待的setTimeout的回调函数，第二个参数仅仅表示最少的时间 而非确切的时间。就算为0，只要对列里还有程序要执行就不会执行异步操作。
```javascript
function fn() {
    var data = ""
    setTimeout(function () {
        data = 'hello'
    }, 1000)

    return data
}

// 调用 fn, 得到内部的data
console.log(fn())
```
如果需要获取一个函数中异步操作的结果, 则必须通过回调函数来获取.
```javascript
// 将回调函数作为参数类型传递
function fn(callback) {
// var callback = function (data) { console.log(data)}

    var data = ""
    setTimeout(function () {
        data = 'hello'
        // 当定时器执行到的时候callback
        callback(data)
    }, 1000)

    return data
}

// 调用 fn, 得到内部的data

// 如果需要获取一个函数中异步操作的结果, 则必须通过回调函数来获取.
fn (function (data) {
    console.log(data)
})
```
#### 回调函数，上层定义下层调，先定义好，等要用到了再掉
![回调函数](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191205201240.png)

### 使用回调函数查询学生列表
根据下面的代码：
callback 中的参数：
        第一个参数是 err
            成功是 null
            错误是 错误对象
        第二个参数是 结果
            成功是 数组
            错误是 undefined
```javascript
exports.findAll = function (callback) {

    // 在findAll方法里面调用文件操作,因为文件操作是异步的,所以是拿不到异步操作的值的.
    fs.readFile(dbPath, 'utf8' function (err, data) {
        if (err) {
            return  callback(err)
        }
        return callback(null, JSON.parse(data).students)
    })
}
```
需要这样调用
```javascript
    Student.findAll(function (err, students) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('index.html', {
            fruits: [
                '苹果',
                '香蕉',
                '橘子'
            ],
            students: students

        })
    })
```

## updataById
find(function)
- EcmaScript 6 中的一个数组方法：
- 需要接受一个函数作为参数
- find 也会遍历，从第一个开始遍历到所有的，当某个遍历项符合`item.id === student.id`的时候 find 会中止遍历，同时返回遍历项 item

示例：
```
var arr = [10, 5, 20]
arr.find(function (item) { return item === 5 })
返回：5
```

更新的方法
1. 一个个改
    - stu.name = student.name
    - stu.age = student.age
2. 通过循环改
```
for (var key in student) {
    stu[key] = student[key]
}
```

### 从数组删除方法
splice删除元素，第一个参数是下标，第二个参数是从这个下标开始删几个，默认全部删除
示例：
```javascript
var arr = [5, 10, 29, 34]
->undefined

arr.splice(1,1)
->Array [ 10 ]

arr
->Array(3) [ 5, 29, 34 ]
```
```
students.splice(deleteId, 1)
```