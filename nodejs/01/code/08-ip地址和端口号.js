// ip地址用来定位计算机
// 端口号用来定位具体的应用程序
// 所有需要联网的应用程序都会占用一个端口号
// 我们去浏览一个网址的时候浏览器会自动开启一个端口号来跟别人进行通信
var http = require('http')

var server = http.createServer()

server.on('request',function(req,res){
	console.log('收到请求了，路径是： ' + req.url)
	console.log('请求我的客户端的地址是： ',req.socket.remoteAddress,req.socket.remotePort)
	// res.write('hello')
	// res.write('world!')
	// res.end()

	// 上面的方式比较麻烦，一直要write，推荐使用更简单的方式，直接end的同时发送响应
	// res.end('hello world!')

	//根据不同的请求路径发送不同的响应结果
	// 1、获取请求路径
	// 	req.url获取到的是端口号之后的那一部分路径
	// 2.判断路径处理响应
	var url = req.url

	// if(url === '/'){
	// 	res.end('index page')
	// }else if(url === '/login'){
	// 	res.end('login page')
	// }else {
	// 	res.end('404 Not Found')
	// }

	if (url === '/products'){
		var products = [
		{
			name: '苹果 X',
			price: 8888
		},
		{
			name: '菠萝X',
			price: 5000
		},
		{
			name: '小辣椒',
			price: 2500
		}
		]

		// 相应内容只能是二进制数据（Buffer）或者字符串
		//数字、对象、数组、布尔值统统不行
		//JSON有两个方法：parse('[]')返回[] 和stringify([])返回'[]',会中文乱码
		res.end(JSON.stringify(products))
	}
})

// 80是默认端口号，浏览器会自动加80
server.listen(80,function(){
	console.log('服务器启动成功')
})