var fs = require('fs')

function pReadFile (filepath) {
	return  new Promise(function (resolve, reject) {
	fs.readFile(filepath, 'utf8', function (err, data) {
		if (err) {
			reject(err) 
		} else {
			resolve(data)
		}
	})
})
}

pReadFile('./data/a.txt')
.then(function (data) {
	console.log(data)
	return pReadFile('./data/b.txt')
})
.then(function (data) {
	console.log(data)
	return pReadFile('./data/c.txt')
})
.then(function (data) {
	console.log(data)
})