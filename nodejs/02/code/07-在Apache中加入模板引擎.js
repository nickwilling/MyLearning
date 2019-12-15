var http = require('http')
var fs = require('fs')
var template =require('art-template')

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
			// 这里只需要使用模板引擎解析替换data中的模板字符串就可以了
			// 数据就是files
			// 然后去template.html去编写你的模板语法就可以了

			// 这个东西就叫服务端渲染
			var htmlStr = template.render(data.toString(),{
				title: '的目录',
				files: files
			})

			res.end(htmlStr)
		})
	})
})

server.listen(3000, function () {
	console.log('Server is running...')
})