### 无法保证顺序的代码
```js
var fs = require('fs')

fs.readFile('./data/a.txt', 'utf8', function (err, data) {
    if (err) throw err
    console.log(data)
})

fs.readFile('./data/b.txt', 'utf8', function (err, data) {
    if (err) throw err
    console.log(data)
})

fs.readFile('./data/c.txt', 'utf8', function (err, data) {
    if (err) throw err
    console.log(data)
})
```

### 现在想要实现顺序访问，a-->b-->c
通过回调嵌套的方式来确保访问顺序, a读完了以后再去读b，b读完了以后再去掉c
```js
var fs = require('fs')

fs.readFile('./data/a.txt', 'utf8', function (err, data) {
    if (err) throw err
    console.log(data)

    fs.readFile('./data/b.txt', 'utf8', function (err, data) {
    if (err) throw err
    console.log(data)

    fs.readFile('./data/c.txt', 'utf8', function (err, data) {
    if (err) throw err
    console.log(data)

})
})
})
```

## Promise可以解决回调地狱

![promise的结构图](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191210215914.png)
promise是一个构造函数 

![promise代码图示](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191210222735.png)

### then的链式调用
如果return 的不是 Promise实例，会自动封装成为一个Promise成功的实例，以实现链式调用。第一个成功函数的参数就是return的返回的值，比如返回的是123就默认成功返回的参数是123。应该是`p.then(function (123) {}, function(err){})` 因为data都有值了，所以肯定是调用成功了。

如果return的是Promise实例 p2，后面的then就相当于是`p2.then(function (data) {}, function(err){})`了
![](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191210225608.png)

## 封装promise版本的readFile
```js
var fs = require('fs')

function pReadFile (filepath) {
    return  new Promise(function (resolve, reject) {
    fs.readFile(filepath, 'utf8', function (err, data) {
        if (err) {
            reject(err) 
        } else {
            resolve(data)
        }
    })
})
}

pReadFile('./data/a.txt')
.then(function (data) {
    console.log(data)
    return pReadFile('./data/b.txt')
})
.then(function (data) {
    console.log(data)
    return pReadFile('./data/c.txt')
})
.then(function (data) {
    console.log(data)
})
```

## Promise的应用场景
![](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191211104433.png)

```html
  <form action="00-js中的一等公民函数.js" id="user_form">
  </form>
  <script type="text/template" id="tpl">
    <div>
      <label for="">用户名</label>
      <input type="text" value="{{ user.username }}">
    </div>
    <div>
      <label for="">年龄</label>
      <input type="text" value="{{ user.age }}">
    </div>
    <div>
      <label for="">职业</label>
      <select name="" id="">
        {{ each jobs }} {{ if user.job === $value.id }}
        <option value="{{ $value.id }}" selected>{{ $value.name }}</option>
        {{ else }}
        <option value="{{ $value.id }}">{{ $value.name }}</option>
        {{ /if }} {{ /each }}
      </select>
    </div>
  </script>
```

```js
var data = {} //为了拿到里面的user和jobs两个对象
    // jquery封装好了promise
    $.get('http://127.0.0.1:3000/users/4')
      .then(function (user) {
        data.user = user
        return $.get('http://127.0.0.1:3000/jobs')
      })
      .then(function (jobs) {
        data.jobs = jobs
        var htmlStr = template('tpl', data)
        document.querySelector('#user_form').innerHTML = htmlStr
      })
```

## 封装即支持Promise也支持callback的ajax方法
```js
function pGet(url, callback) {
  return new Promise(function (resolve, reject) {
    var oReq = new XMLHttpRequest()
    // 当请求加载成功之后要调用指定的函数
    oReq.onload = function () {
      // 我现在需要得到这里的 oReq.responseText
      // callback && callback() ： 在判断 && 表达式时， 只有第一个为真才执行第二个；也就是说如果没传callback就不会执行callback()
      callback && callback(JSON.parse(oReq.responseText))
      resolve(JSON.parse(oReq.responseText))
    }
    oReq.onerror = function (err) {
      reject(err)
    }
    oReq.open("get", url, true)
    oReq.send()
  })
}
```

###  使用callback调用pGet
```js
 pGet('http://127.0.0.1:3000/users/4', function (data) {
      console.log(data)
    })
```
### 使用promise调用pGet
```js
pGet('http://127.0.0.1:3000/users/4')
  .then(function (data) {
    console.log(data)
  })
```

## Mongoose所有的API都支持promise
注册用户的时候先查，如果有这个用户了就注册失败，如果没有的话注册一个新用户，注册成功了还可以做别的事情：
```js
User.findOne({
    username: '456'
})
.then(function (user) {
    if (user) {
        console.log('用户已存在')
    } else {
        return new User({
            username: 'aaa',
            password: '123',
            email: 'dsadsa'
        }).save() //此时注册成功的callback可以在下面的promise里访问
    }
})
.then(function (ret) {
console.log('注册成功'+ret)
})
```

### catch
catch()方法和then()方法一样，都会返回一个新的Promise对象，它主要用于捕获异步操作时出现的异常。因此，我们通常省略then()方法的第二个参数，把错误处理控制权转交给其后面的catch()函数，如下：
```js
var promise3 = new Promise(function(resolve, reject) {
 setTimeout(function() {
  reject('reject');
 }, 2000);
});
 
promise3.then(function(data) {
 console.log('这里是fulfilled状态'); // 这里不会触发
 // ...
}).catch(function(err) {
 // 最后的catch()方法可以捕获在这一条Promise链上的异常
 console.log('出错：' + err); // 出错：reject
});
```
