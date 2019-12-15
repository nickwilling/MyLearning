var http = require('http')
var fs = require('fs')

var server = http.createServer()

// Apache服务器软件，这个软件默认有一个 www 目录，所有存放在 www 目录中的资源都可以通过网址来浏览

var wwwDir = 'C:/app/www'
var index = '/index.html'

server.on('request', function (req, res) {
	var url = req.url
	var filePath = ''
	if (url === '/') {
		filePath = wwwDir + index
	}else{
		filePath = wwwDir + url
	}
	
	console.log(filePath)
	fs.readFile(filePath, function (err,data) {
		if (err) {
			return res.end('404 Not Found')
		}
		res.end(data)
	})
})

server.listen(3000, function () {
	console.log('Server is running...')
})