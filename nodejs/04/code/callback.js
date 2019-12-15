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

console.log('hello world!')