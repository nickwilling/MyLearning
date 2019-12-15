
var http = require('http')


var server = http.createServer()

//request请求事件处理函数，需要接收两个参数：
//	Request 请求对象
// 	Response 响应对象有一个方法：write可以用来给客户端发送响应数据
// 	write可以使用多次，但是最后一定要使用end来结束响应，否则客户端会一直等待 
server.on('request',function(request,response){
	console.log('收到客户端的请求了,请求路径是： ' + request.url)
	response.write('hello')
	response.write('nodejs')
	response.end()
})


server.listen(3000,function(){
	console.log('服务器启动成功了，可以通过http://127.0.0.1:3000/来进行访问（或者localhost）')
})