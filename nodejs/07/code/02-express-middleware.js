var express = require('express')

var app = express()

// 中间件：处理请求的，本质就是个函数

// 任何请求都会进入的中间件
app.use(function (req,  res, next) {
	console.log('1')
	next()
})

// app.use('/a', function (req, res, next) {
// 	console.log(req.url)
// })

// app.use('/b', function (req, res, next) {
// 	console.log(req.url)
// })

app.use(function (req, res, next) {
    console.log(404)
    res.send('404!')
  })

app.listen(3000, function () {
	console.log('app is running at port 3000.')
})