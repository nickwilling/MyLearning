var express = require('express')

var app = express()

app.get('/abc', function (req, res, next) {
	console.log('abc')
	req.foo = 'bar'
	req.body = {}
	next()
})

app.get('/abc', function (req, res, next) {
	console.log(req.body)
	console.log(req.foo)
}) 

app.listen(3000, function () {
	console.log('app is running at port 3000.')
})