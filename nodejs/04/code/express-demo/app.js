var express = require('express')
var bodyParser = require('body-parser')
var app = express()

// 配置 body-parser 中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

app.get('/', function (req, res) {
	res.render('index.html',{
		comments: comments
	})
})

app.get('/post', function (req, res) {
	res.render('post.html')
})

app.use('/public/', express.static('./public/'))

// 配置使用 art-template 模板引擎
// 第一个参数表示当渲染以 .art 结尾的文件的时候, 使用 art-template 模板引擎(也可以改成html,就会变成如果渲染以html结尾的文件时,使用模板引擎)
app.engine('html', require('express-art-template'))

// Express 为 Response 响应对象提供了一个方法:  render
// render 方法默认是不可以用的, 但是如果配置了模板引擎就可以使用
// res.render('html模板名', {模板数据})
// 第一个参数不能写路径, 默认回去项目中的 views 文件目录查找改模板文件
app.get('/admin', function (req, res) {
	res.render('admin/index.html', {
		title: '管理系统'
	})
})

// app.get('/pinglun', function (req, res) {
// 	var date = new Date();
// 	var year = date.getFullYear();
// 	var month = date.getMonth() + 1;
// 	var day = date.getDate();
// 	if (month < 10) {
// 	    month = "0" + month;
// 	}
// 	if (day < 10) {
// 	    day = "0" + day;
// 	}
// 	var nowDate = year + "-" + month + "-" + day;

// 	var newComment = req.query
// 	newComment.dateTime = nowDate
// 	comments.unshift(newComment)
// 	res.redirect('/')
// })

app.post('/post', function (req, res) {
		// 1. 获取表单 POST 请求体数据
		// 2. 处理
		// 3. 发送响应
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

			var newComment = req.body
			newComment.dateTime = nowDate
			comments.unshift(newComment)
			res.redirect('/')

})

app.listen(3000, function () {
	console.log('app is running')
})

