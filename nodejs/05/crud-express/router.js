var fs = require('fs')
var Student = require('./student')

// 这种方法不好
// module.exports = function (app) {
// 	app.get('/', function (req, res) {
// 	// 因为直接读取的文件是以二进制的方式读取的
// 	// utf8将读取到的文件按utf8编码,转成我们能认识的字符
// 	// 也可使用data.toString()
// 	fs.readFile('./db.json','utf8',  function (err, data) {
// 		if (err) {
// 			return res.status(500).send('Server error.')
// 		}
// 		res.render('index.html', {
// 			fruits: JSON.parse(data).fruits,
// 			students: JSON.parse(data).students
// 			})
		 
// 	})
// })
// }

// express 提供了一种专门来包装路由的方法
var express = require('express')
// 1. 创建一个路由容器
var router = express.Router()

// 2 . 把路由都挂载到 router 路由容器里
router.get('/students', function (req, res) {
	// 因为直接读取的文件是以二进制的方式读取的
	// utf8将读取到的文件按utf8编码,转成我们能认识的字符
	// 也可使用data.toString()
// 	fs.readFile('./db.json','utf8',  function (err, data) {
// 		if (err) {
// 			return res.status(500).send('Server error.')
// 		}
// 		res.render('index.html', {
// 			fruits: JSON.parse(data).fruits,
// 			students: JSON.parse(data).students

// 		})
// })

	Student.find(function (err, students) {
		if (err) {
			return res.status(500).send('Server error.')
		}
		res.render('index.html', {
			fruits: [
				'苹果',
				'香蕉',
				'橘子'
			],
			students: students

		})
	})

})
router.get('/students/new', function (req, res) {
	res.render('new.html')
})

router.post('/students/new', function (req, res) {

	new Student(req.body).save(function (err) {
		if (err) {
			return res.status(500).send('Server error.')
		}
		// 3. 发送响应
		res.redirect('/students')
	})
})


router.get('/students/edit', function (req, res) {

	Student.findById(req.query.id, function (err, student) {
		if (err) {
			return res.status(500).send('Server error.')
		}
		res.render('edit.html',{
			student: student
		})
	})
	
})

router.post('/students/edit', function (req, res) {
	console.log(req.body)
	Student.findByIdAndUpdate(req.body.id, req.body, function (err) {
		if (err) {
			return res.status(500).send('Server error.')
		}
		// 3. 发送响应
		res.redirect('/students')
	})
})

router.get('/students/delete', function (req, res) {
	Student.findByIdAndRemove(req.query.id, function(err) {
	if (err) {
		return res.status(500).send('Server error.')
	}
	// 3. 发送响应
	res.redirect('/students')	
	})
})

//  3. 把router导出
module.exports = router