//你可以使用Node非常轻松的构建一个Web服务器
//在Node中专门提供了一个核心模块http，用来帮助你创建编写服务器

// 1.加载http核心模块
var http = require('http')

//2. 使用http.createServer()方法创建一个Web服务器
var server = http.createServer()

// 3.服务器要干嘛？
//注册request请求事件
//当客户端请求过来，就会自动触发服务器的request事件，然后执行第二个参数：回调处理函数
server.on('request',function(){
	console.log('收到客户端的请求了')

})

//4.绑定端口号，启动服务器（凡是涉及到网络通信的都一定有端口号）
//最简单的http服务
server.listen(3000,function(){
	//当服务器启动成功会执行这个函数，打印一个启动成功的日志信息
	// 启动成功后会占用cmd，等待客户端的请求，cmd一关掉这个服务器就关了
	console.log('服务器启动成功了，可以通过http://127.0.0.1:3000/来进行访问（或者localhost）')
})