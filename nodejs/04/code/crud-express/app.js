var express = require('express')
var router = require('./router')
var bodyParser = require('body-parser')

var app = express()

app.use('/node_modules/', express.static('./node_modules/'))
app.use('/public/', express.static('./public/'))

app.engine('html', require('express-art-template'))

// 配置模板引擎和 body-parser 一定要在 app.use(router) 挂载路由之前[中间件的概念]
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 把路由容器挂载到 app 服务中
app.use(router)

// 配置一个处理 404 的中间件
app.use(function (req, res) {
	res.render('404.html')
})

// 配置一个全局错误处理中间件
app.use(function (err, req, res, next) {
	res.status(500).json({
		err_code: 500,
		message: err.message
	})
})

app.listen(3000, function () {
	console.log('running 3000...')
})  