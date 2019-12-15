// 函数是一种数据类型
// 既可以当参数
// 

function add(x, y, callback) {

	setTimeout(function () {
		var ret = x + y
		callback(ret) //用callback传值ret
	},1000)

}

add(10, 20, function (ret) {
	console.log(ret)
})
