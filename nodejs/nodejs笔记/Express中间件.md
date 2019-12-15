### 中间件
当请求进来，会从第一个中间件开始进行匹配
- 如果匹配，则进去处理
    + 如果请求进入中间件之后，没有调用 next 则请求会停留在当前中间件
    + 如果调用了 next 则继续向后找到第一个匹配的中间件
- 如果不匹配， 则继续判断匹配下一个中间件

中间件：处理请求的，本质就是个函数。

中间件本身是一个方法，该方法接收三个参数
- Request 请求对象
- Response 响应对象
- next 下一个中间件(就是后面的代码)

在 Express 中，对中间件有几种分类：
- 不关心请求路径和请求方法的中间件，也就是说任何请求都会进入这个中间件
    + `app.use(function (req, res, next) `
- 关心请求路径的中间件：以 /xxx 开头的路径中间件
    + `app.use('/a', function (req, res, next) {})`
    + 现在所有以/a开头的请求都会进来
- 严格匹配请求方法和请求路径的中间件（最常用）
    + app.get('/', function (req, res) {})
    + app.post('/a', function (req, res) {})

### 应用程序级别中间件
万能匹配（不关心请求路径和请求方法）：
```
app.use(function (req, res, next) {
  next()  
})
```
只要是以'/xxx/'开头的：
```js
app.use('/a', function (req, res, next) {
    next()
})
```

### 路由级别中间件
get:
```js
app.get('/', function (req, res) {
    res.send('Hello World!')
})
```
post:
```js
app.post('/', function (req, res) {
    res.send('Got a POST request')
})
```
put:
```js
app.put('/user', function (req, res) {
    res.send('Got a PUT request')
})
```
delete:
```js
app.put('/user', function (req, res) {
    res.send('Got a DELETE request at /user')
})
```

### 错误处理中间件
```js
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})
```

### 内置中间件
 - express.static
 - expres.json
 - express.urlencoded
 
 ### 第三方中间件
 网址：(http://expressjs.com/en/resources/middleware.html)
 - body-parser
 - compression
 - cookie-parser
 - morgan
 - response-time
 - serve-static
 - session

### 中间件演示
1. 没有用next()放行的中间件是不会走到下一个中间件的,中间件的顺序也很重要，因为代码是从上往下执行的，所以肯定会先执行第一个中间件
```javascript
app.use(function (req,  res, next) {
    console.log('1')
})
app.use(function (req, res, next) {
    console.log('2')
})

输出： 1
```
2. 调用了next()方法的中间件会向下继续处理
```js
app.use(function (req,  res, next) {
    console.log('1')
    next()
})

app.use(function (req, res, next) {
    console.log('2')
})
```
>输出：
1
2

**当一个请求进入一个中间件之后，如果不调用 next 则会停留在当前中间件**

**所以 next 是一个方法， 用来调用下一个中间件的。**

3. next也是会匹配的
浏览器输入`http://localhost:3000/a/b`
```js
app.use(function (req,  res, next) {
    console.log('1')
    next()
})

app.use('/a', function (req, res, next) {
    console.log(req.url)
})

app.use('/b', function (req, res, next) {
    console.log(req.url)
})
```
>输出：
>1
>/b

### 配置404处理中间件
根据前面，`app.use(function (req, res, next))` 是万能请求， 那么只要写在最后，所有没能匹配到路径的请求全部由这个中间件处理不就可以处理404了嘛
```js
var express = require('express')

var app = express()

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.post('/', function (req, res) {
    res.send('Got a POST request')
})

app.use(function (req, res, next) {
    console.log(404)
    res.send('404!')
  })

```

### 同一个请求所经过的中间件都是同一个请求对象和相应对象
我在前面一个中间件里面为`req`挂载了`foo`对象和 `body` 对象，在后面继续处理的中间件也是可以用这两个挂载的对象的。

req.body() 就是由前面的中间件处理好，给我们挂载上去的，所以我们在后面的中间件中才可以使用它。
```js
app.get('/abc', function (req, res, next) {
    console.log('abc')
    req.foo = 'bar'
    req.body = {}
    next()
})

app.get('/abc', function (req, res, next) {
    console.log(req.body)
    console.log(req.foo)
}) 
```

### 配置全局错误处理中间件
当调用 next 的时候, 如果传递了参数,则直接往后找到带有 四个参数 的应用程序级别的中间件,也就是全局错误处理中间件

当发生错误的时候, 我们可以调用 next 传递错误对象,然后就会被全局错误处理中间件匹配到并处理.
```js

app.get('/a', function (req, res, next) {
    fs.readFile('./d/sa/d', function (err, data) {
        if (err) {
        return next(err)
    }
    })
})
// 全局错误处理中间件
app.use(function (err, req, res, next) {
    //res.status(500).send(err.message)
    res.status(500).json({
        err_code: 500,
        message: err.message
    })
})
```