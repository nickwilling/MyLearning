//require是一个方法
// 它的作用就是用来加载模块的
// 在Node中，模块有3中
// 	1.具名的核心模块，例如fs、http
// 	2.用户自己编写的文件模块
console.log('a start')
require('./b.js')//相对路径必须加./，不加的话默认去核心模块找了;可以不加后缀名
console.log('a end')

//Node没有全局作用域，只有模块作用域，变量只有在本文件内有效，外部访问不到
//require方法有两个作用：
//	1.加载文件模块并执行里面的代码
//	2.拿到被加载文件模块导出的接口对象
// 	在每个文件模块中都提供了一个对象exports，默认是一个空对象
// 	你要做的就是把所有需要被外部访问的成员挂载到这个exports对象中
var bExports = require('./b')
console.log(bExports)
console.log(bExports.foo)
console.log(bExports.add(1,2))//如果函数没有返回值的话打印控制会出undefined

bExports.readFile('./a.js')

