## Express
### helloworld
```javascript
var express = require('express')

//创建服务器应用程序
// 也就是原来的 http.createServer()
var app = express()

// 当服务器受到 get 请求 / 的时候，执行回调处理函数。
// http是server.on('request', function (req, res) {
    // res.end()
// })
app.get('/', function (req, res) {
    res.send('hello express!')
})

// 相当于server.listen()
app.listen(3000,  function () {
    console.log('app is running at port 3000,')
})
```
### 基本路由
路由其实就是一张表，这个表里面有具体的映射关系。

这张表里面记录了
- 请求方法
- 请求路径
- 请求的处理函数
![路由表](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191204201114.png)
- http
```javascript
var http = require('http')

var server = http.createServer()

server.on('request',function(req,res){
    var url = req.url
    if(url === '/'){
     res.end('index page')
    }
})

// 80是默认端口号，浏览器会自动加80
server.listen(80,function(){
    console.log('服务器启动成功')
})
```
- express
```javascript
//路由，一个映射关系：当你以 Get 请求 / 的时候，执行对应的处理函数。
app.get('/', function (req, res) {
    res.send('hello express!')
})
//路由： 当你以Post 请求 / 的时候，执行对应的处理函数。
app.post('/'， function (req, res) {
    res.send('Got a Post request!')
})
```

###静态资源服务
- express
```javascript
// 只要这样做了，你就可以直接通过 /public/xx的方式访问public目录中的所有资源了
//访问方式:localhost:3000/public/img/a.png
app.use('/public/', express.static('./public/'))//第一个参数是url,第二个参数是文件路径

// 当省略第一个参数的时候， 则可以通过 省略 第一个参数 的方式来访问
//访问方式:localhost:3000/img/a.png,简化路径的操作,可以少写一个/public
app.use(express.static('./public/'))

// 这样写也可以
app.use('/static', express.static('public'))
```
- http
```javascript
// 第二个参数为true时会将返回的query转化为查询对象
var parseObj = url.parse(req.url, true)
// 单独获取不包含查询字符串的路径 
var pathname = parseObj.pathname

// b.indexOf(a)检索a字符再b中首次出现的位置索引，在b里第一个字符出现索引就是0
// 这样就把public中所有的资源都开放出去了
else if (pathname.indexOf('/public/') === 0) {
            // 有点会变成./public/css/main.css，没.就代表根目录
            fs.readFile('.' + pathname, function (err, data) {
                if (err) {
                    return res.end('404 Not Found')
                }
                res.end(data)
            })

        }
```

### 查询字符串
- Express
```
/about?foo=bar
app.get('/about', function (req, res) {
    console.log(req.query)
})
//输出：{foo: 'bar'}
```

- http+url
```javascript
var obj = url.parse(u,true)//为true将查询字符串解析为查询对象，false返回的query直接就是查询字符串
console.log(obj.query)
//输出：{foo: 'bar'}
```

### url模块
```javascript
var url = require('url')
var u = 'http://localhost:3000/pinglun?name=%E5%95%8A%E5%95%8A%E5%95%8A%E5%95%8A%E5%95%8A&message=%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6'
// 第二个参数为true时会将返回的query转化为查询对象
// 返回的pathname就是？前面的路径
var obj = url.parse(u,true)
console.log(obj)
console.log(obj.pathname)
console.log(obj.query)
```
![](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191204164024.png)

## 在Express中配置使用`art-template`模板引擎
[art-template - GitHub仓库](https://github.com/aui/art-template)
[art-template - 官网](https://aui.github.io/art-template/)
Install:
```shell
npm install --save art-template
npm install --save express-art-template
```

配置
```javascript
// 配置使用 art-template 模板引擎
// 第一个参数表示当渲染以 .art 结尾的文件的时候, 使用 art-template 模板引擎(也可以改成html,就会变成如果渲染以html结尾的文件时,使用模板引擎)
app.engine('art', require('express-art-template'))
});
```

渲染
```javascript
// Express 为 Response 响应对象提供了一个方法:  render
// render 方法默认是不可以用的, 但是如果配置了模板引擎就可以使用
// res.render('html模板名', {模板数据})
// 第一个参数不能写路径, 默认回去项目中的 views 文件目录查找改模板文件
app.get('/admin', function (req, res) {
    res.render('admin/index.html', {
        title: '管理系统'
    })
})
```
### 在Express中获取表单GET请求体数据
```
req.query
```
### 在Express中获取表单post请求体数据
如果使用post发请求的话请求头里的Content-Type是: application/x-www-form-urlencoded,请求体就是表单数据

使用get发请求请求头里面没有Content-Type

get与post的区别:

get请求方式参数是在url后，而post请求方式的参数是在request body中。因此两者获取参数的方式也大不一样。

在地址栏属地址敲回车发出的请求都是get请求, post请求只有提交表单或者用ajax发POST请求.

post请求在headers下的form data里,req.query获取不到. 因为req.query是把url split得到的.

在Express中没有内置获取表单POST请求体的API,需要使用一个第三方包: `body-parser`[middleware:中间件]
安装:
```
npm install --save body-parser
```
配置:
```javascript
var express = require('express')

var bodyParser = require('body-parser')

var app = express()

// 配置 body-parser,只要加入这个配置, req请求对象就会多出来一个属性: body
// 也就是说,你可以直接通过 req.body 来获取表单 POST 请求体数据了
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
```
使用
```javascript
app.use(function (req,res) {
    res.setHeader('Content-Type', 'text/plain')
    res.write('you posted: \n')
    \\ 可以通过 req.body 来获取表单 POST 请求体数据
    res.end(JSON.stringify(req.body, null, 2))
    })
```