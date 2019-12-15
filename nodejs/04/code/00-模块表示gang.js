var fs = require('fs')

fs.readFile('data/a.txt', function (err, data) {
	if (err) {
		return console.log('读取失败')
	}
	console.log(data.toString())
})

require('./data/foo.js')('hello')

console.log('world!')