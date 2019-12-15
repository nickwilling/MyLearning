# Node中的模块系统
使用Node编写应用程序主要就是在使用：
- EcmaScript语言
    + 和浏览器中不一样，再Node中没有BOM、DOM
- 核心模块
    + 文件操作--fs
    + http服务--http
    + url路径操作模块
    + path路径处理模块
    + os操作系统信息
- 第三方模块
    + art-template
    + 必须通过npm下载才可以使用
- 自己写的模块
    + 自己创建的文件

## 什么是模块化
- 文件作用域
- 通信规则
    + 加载 require
    + 导出 exports

## CommonJS模块规范
- 模块作用域
    + Node没有全局作用域，只有模块作用域，变量只有在本文件内有效，外部访问不到
- 使用require方法来加载模块
- 使用exports接口对象来导出模块中的成员

### 加载`require`
require方法有两个作用：
1. 加载文件模块并执行里面的代码
2. 拿到被加载文件模块导出的接口对象
语法：
```
var 自定义变量名称 = require('模块')
var fs = require('fs')
//对于自定义模块一定要加相对路径，不然就识别为核心模块了
var fooExports = require('./foo')
```

### 导出 `exports`
- Node中是模块作用域，默认文件中的所有成员只在当前文件模块有效
- 对于希望可以被其他模块访问的成员，需要把这些公开的成员都挂载到exports接口对象

在每个文件模块中都提供了一个对象exports，默认是一个空对象

你要做的就是把所有需要被外部访问的成员挂载到这个exports对象中

导出多个成员（必须在对象中通过 点 访问）：
```javascript
var foo = 'bar'
function add(x,y) {
    return c + y
}
exports.a = foo
exports.b = add
exports.c = function () {
    console.log('ccc')
}
exports.d = {
    foo: 'bar',
    a: 'abc'
}
```
导出单个成员(拿到的就是：函数、字符串)：
```javascript
module.exports = 'hello'
// 重新赋值后面会覆盖前面的
module.exports = function (x, y) {
    return x+y
}
//导出的是对象,这样就跟第一种没什么区别的
module.exports = {
    add: function (x, y) {
        return x+y
    },
    str: 'hello'
}
```

## 模块原理
在Node中，每个模块内部都有一个自己的module对象，

在module对象中，有一个成员叫exports，也是一个对象（默认是空对象）
类似这样：
```javascript
var module = {
    exports:  {

    }
}
```
**exports是module.exports的一个引用**

本来给exports加一个值要通过`module.exports.foo = 'bar'`

但是每次都module.exports写的太长了 ，为了简化操作，模块中还有这么一句代码：
```javascript
var exports = module.exports
```

谁来require谁就得到 module.exports对象
默认在代码的最后有一句：
```javascript
return module.exports
```

## 为啥给exports直接赋值不管用呢
类似以下情况
```javascript
var obj = {} 
var obj1 = obj
obj1.foo = 'bar'
obj.foo = 'hello'//obj和obj1都会指向同一个地址,所以修改哪一个都一样

//但如果obj1重新赋值了它指向的地址就变掉了
obj1 = {}
obj1.foo = 'world'
console.log(obj.foo)//是hello
```
![引用](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191204091436.png)
![重新赋值](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191204092852.png)

因为最终返回的是module.exports,所以给exports重新赋值对module.exports是不会有影响的。
**exports重新赋值以后就与module.exports指向的地址断开了联系，指向了新的地址。**

### require方法加载规则
- 路径形式的模块
    + 自己写的模块引用使用路径形式加载
    + require('./foo.js')
- 核心模块使用名字来加载
    + require('fs')
- 第三方模块使用包名来加载：查找规则
    + require('art-template')
         * 先找到当前文件所处文件目录中的node_modules 目录
         * 找到node_modules/art-template（要加载的那个包名）目录
         * 再找node_modules/art-template/package.json文件
         * 再去找到node_modules/art-template/package.json下的main属性
         * main属性中就记录了 art-template的入口模块
         * 然后加载使用这个第三方包
         * 实际上最终加载的还是文件
         * 如果没有package.json或者package.json下面的main指定的入口模块也没有
         * 那么会去自动加载index.js作为默认备选入口模块
         * 如果以上所有都没有，那么会去上一级目录重新走一遍，直到当前磁盘的根目录还找不到
         * 最后报错can not found module xxx
    + 第三方包必须使用npm来下载。
    + 不可能有一个第三方包和核心模块的名字是一样的。
    ![npm包加载规则](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191204111137.png)
![默认备选项](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191204111541.png)

**注意：我们一个项目有且只有一个node_modules,放在项目根目录中，这样的话项目中所有的子子目录中的代码都可以加载到第三方包**

### 模块查找机制:
- 优先从缓存加载
- 核心模块
- 路径形式的文件模块
- 第三方模块

![查找机制](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191204112949.png)

### 包说明文件（package.json）
建议每一个项目放入根目录下都要有一个`package.json`文件(包描述文件)

这个文件可以通过`npm init`的方式自动初始化出来。

npm install 包名就会自动在package.json里加入dependencies属性了。
```javascript
{
  "name": "code",
  "version": "0.0.1",
  "description": "这是一个测试项目",
  "main": "main.js",
  "dependencies": {
    "jquery": "^3.4.1"
  },
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "wwl",
  "license": "ISC"
}

```
**如果不小心把node_modules文件删了，就没有包依赖了，这时候如果有package.json文件，里面有包依赖的话只要运行`npm install`命令就可以自动给你下回来。**