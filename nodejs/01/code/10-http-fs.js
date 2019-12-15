// Content-Type：
//	服务器最好把每次响应的数据类型是什么内容类型都告诉客户端，而且要正确的告诉
// 	不同的资源对应的Content-Type都是不一样的
// 	对于文本资源的数据，最好都加上编码，目的是为了防止中文解析乱码的问题
//通过网络发送文件：
// 	发送的并不是文件，本质上来讲发送的是文件的内容
// 	当浏览器受到服务器响应的内容之后，就会根据服务器的Content-Type进行对应的解析处理
var http = require('http')
var fs = require('fs')

var server = http.createServer()

server.on('request', function (req,res) {
	// index.html
	var url = req.url

	if(url === '/') {
	//我们要发送的还是在文件中的内容
	fs.readFile('./resource/index.html', function (error,data) {
		
		if (error) {
		res.setHeader('Content-Type', 'text/plain;charset=utf-8')
		return res.end('404 Not Found!')
		}
		res.setHeader('Content-Type', 'text/html;charset=utf-8')
		//data本来就是二进制数据，不用转成String
		res.end(data)
	})
	
	}else if(url === '/a') {
		fs.readFile('./resource/image.jpg', function (err,data) {
			if (err) {
				res.setHeader('Content-Type', 'text/plain;charset=utf-8')
				res.end('文件读取失败，请稍后再试')
			}
			// 图片不需要指定编码，一般说的编码是字符编码
			res.setHeader('Content-Type', 'image/jpeg')
			res.end(data)
		})
	}

})

server.listen(3000, function () {
	console.log('Server is running')
})