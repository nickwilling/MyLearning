var fs = require('fs')

// 创建 Promise 容器 ，把异步任务写在里面，容器一开始的状态是pending
// Promise 容器一旦创建， 就开始执行里面的代码
// 承诺本身不是异步的，但是里面的任务是异步的
var p1 = new Promise(function (resolve, reject) { //p1就表示封装好的异步任务
	fs.readFile('./data/a.txt', 'utf8', function (err, data) {
		if (err) {
			// 失败了，承诺容器中的任务失败了
			// 调用reject就相当于调用了then方法的第二个参数
			reject(err) //把容器的 pending 状态变为rejected
		} else {
			// 承诺任务中的容器成功了
			// 调用 resolve 就相当于调用了then方法的第一个参数
			// 也就是说调用resolve的时候data传的什么值，下面then里面的第一个函数里的data就收到什么值
			resolve(data) //把容器的 Pending 状态改为 成功 resolved
		}
	})
})

var p2 = new Promise(function (resolve, reject) { 
	fs.readFile('./data/b.txt', 'utf8', function (err, data) {
		if (err) {
		} else {
			resolve(data) 
		}
	})
})

var p3 = new Promise(function (resolve, reject) { 
	fs.readFile('./data/c.txt', 'utf8', function (err, data) {
		if (err) {
		} else {
			resolve(data) 
		}
	})
})

// 使用promise
// p1就是那个承诺
// 当 p1 成功了， 然后（then） 做指定的操作
//then里面的 function 就是容器中的 resolve 函数
p1.
	then(function (data) {
		console.log(data)
		// 当 p1 读取成功的时候
		// 当前函数中 return 的结果就可以在后面的 then 中的 function 接收到，这里传123，下面then方法里的data就是123
		// 如果return 的不是 Promise实例，会自动封装成为一个Promise成功的实例，成功的参数就是return的参数，比如返回的是123就默认成功返回的参数是123
		// 但是如果 return 的是 Promise 对象的时候， 后续的 then 中的第一个参数会作为 p2 的 resolve，第二个参数作为p2的reject
		return p2 
	}, function (err) {
		console.log('读取文件失败了', err)
	})
	.then(function (data) {
		console.log(data)
		return p3
	})
	.then(function (data) {
		console.log(data)
	})
