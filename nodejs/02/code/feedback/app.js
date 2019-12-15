// app application 应用程序
// 为了让目录结构保持统一清晰，所以约定把所有 html 文件都放到 views （视图）目录中
var http = require('http')
var fs = require('fs')
var url = require('url')
var template = require('art-template')
var comments = [
	{
		name: '张三',
		message: '今天天气不错',
		dateTime: '2019-10-16'
	},
	{
		name: '张三2',
		message: '今天天气不错',
		dateTime: '2019-10-16'
	},
	{
		name: '张三3',
		message: '今天天气不错',
		dateTime: '2019-10-16'
	},
	{
		name: '张三4',
		message: '今天天气不错',
		dateTime: '2019-10-16'
	},
	{
		name: '张三5',
		message: '今天天气不错',
		dateTime: '2019-10-16'
	}
]

http
	.createServer(function (req, res) {
		var parseObj = url.parse(req.url, true)

		// 单独获取不包含查询字符串的路径 
		var pathname = parseObj.pathname

		if (pathname === '/') {
			fs.readFile('./views/index.html', function (err, data) {
				if (err) {
					return res.end('404 Not Found')
				}
				data = template.render(data.toString(),{
					comments : comments
				})
				res.end(data)
			})
			// b.indexOf(a)检索a字符再b中首次出现的位置索引，在b里第一个字符出现索引就是0
			// 这样就把public中所有的资源都开放出去了
		} else if (pathname.indexOf('/public/') === 0) {
			// 有点会变成./public/css/main.css，没.就代表根目录
			fs.readFile('.' + pathname, function (err, data) {
				if (err) {
					return res.end('404 Not Found')
				}
				res.end(data)
			})

		} else if (pathname === '/post') {
			fs.readFile('./views/post.html', function(err, data) {
				if (err) {
					return res.end('404 Not Found')
				}
				res.end(data)
			})
		} else if (pathname === '/pinglun') {
				var date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var day = date.getDate();
				if (month < 10) {
				    month = "0" + month;
				}
				if (day < 10) {
				    day = "0" + day;
				}
				var nowDate = year + "-" + month + "-" + day;
				// 第一种方法
				// var newComment = {
				// 	name: parseObj.query.name, 
				// 	message: parseObj.query.message, 
				// 	dateTime: nowDate
				// }
				// 第二种方法,通过新建字典，向字典中追加一条记录的方式【推荐】
				var newComment = parseObj.query
				newComment.dateTime = nowDate
				comments.push(newComment)
				// comments.unshift() 往头追加
				// 如何通过服务器让客户端重定向？
				// 1.将状态码设置为302【临时重定向】，301【永久重定向】
				// 		statusCode
				// 2.在响应头中透过Location告诉客户端往哪重定向
				// 		setHeader
				// 如果客户端发现服务器的响应状态码是 302 就会自动去响应头找 Location， 然后对该地址发起新的请求
				// 所以你就能看到客户端自动跳转了。
				res.statusCode = 302
				res.setHeader('Location','/')
				res.end()
		} else {
			fs.readFile('./views/404.html', function(err, data) {
				if (err) {
					return res.end('404 Not Found')
				}
				res.end(data)
			})
		}
	})
	.listen(3000, function () {
	console.log('Server is running...')
})