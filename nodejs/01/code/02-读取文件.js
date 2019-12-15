// 在Node中如果想要进行文件操作，就必须引入fs这个核心模块

// 1.使用require方法加载fs核心模块（file-system）
var fs  = require('fs')

// 2.读取文件
// 两个参数，第一个参数就是文件路径
// 第二个参数是一个回调函数
	// 成功：
	// 	data：数据
	// 	error：null
	// 失败：
	// 	data：undefined没有数据
	// 	error 错误对象
fs.readFile('hel.txt',function(error,data){
	//读出来的文件是二进制的，可以通过toString方法转成字符串
	// console.log(error)
	// console.log(data)
	// console.log(data.toString())

	//通过判断error 
	if (error) {
		console.log('读取文件失败了')
		return
	}
	console.log(error)
	console.log(data)
	console.log(data.toString())
})

