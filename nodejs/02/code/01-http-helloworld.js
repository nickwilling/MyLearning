var http = require('http')
var fs = require('fs')

var server = http.createServer()

// Apache服务器软件，这个软件默认有一个 www 目录，所有存放在 www 目录中的资源都可以通过网址来浏览

var wwwDir = 'C:/app/www'

server.on('request', function (req, res) {
	var url = req.url
	if (url === '/') {
		fs.readFile(wwwDir + '/index.ml', function (err, data) {

			if (err) {
        // 如果读取文件出错的话直接返回就不会往下执行了，不然后面的ssss还是会打印的。
				return res.end('404 Not Found.') 
			}
			console.log('sssss')
			res.end(data)
			console.log('bbbsss')
		})
	}else if (url === '/a.txt') {
		fs.readFile(wwwDir + '/a.txt', function (err, data) {

      if (err) {
        return res.end('404 Not Found.') 
      }
      res.end(data)
    })
	
  }else if (url === '/apple/login.html') {
      fs.readFile(wwwDir + '/apple/login.html', function (err, data) {

          if (err) {
            return res.end('404 Not Found.') 
          }
          res.end(data)
  })
  }
})

server.listen(3000, function () {
	console.log('Server is running...')
})