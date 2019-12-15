var express = require('express')

//创建服务器应用程序
// 也就是原来的 http.createServer()
var app = express()

// 当服务器受到 get 请求 / 的时候，执行回调处理函数。
// http是server.on('request', function (req, res) {
	// res.end()
// })
app.get('/', function (req, res) {
	res.send('hello express!')
})

app.get('/about', function (req, res) {
	res.send('关于我')
})

app.get('/pinglun', function (req, res) {
	// 如何让art-template 结合 Express 来使用
	// res.render('文件名', {模板对象})
})


// 提供静态资源服务
// 只要这样做了，你就可以直接通过 /public/xx的方式访问public目录中的所有资源了
app.use('/public/', express.static('./public/'))

// 相当于server.listen()
app.listen(3000,  function () {
	console.log('app is running at port 3000,')
})