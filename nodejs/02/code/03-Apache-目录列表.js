var http = require('http')
var fs = require('fs')

var server = http.createServer()

var wwwDir = 'C:/app/www'
var index = '/index.html'

server.on('request', function (req, res) {
	var url = req.url
	fs.readFile('./template.html', function (err, data) {
		if (err) {
			return res.end('404 Not Found')
		}
		// 1.如何得到wwwDir目录列表中的文件名和目录名
		// 	  fs.readdir
		// 2.如何将得到的文件名和目录名替换到template.html中
		//    模板引擎
		fs.readdir(wwwDir, function (err, files) {
			if (err) {
				return res.end('Can Not Found www dir')
			}
			
		})
		res.end(data)
	})
})

server.listen(3000, function () {
	console.log('Server is running...')
})