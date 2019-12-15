var fs = require('fs')

// 文件路径
var dbPath = './db.json'

// 获取所有学生列表
// return []
// 需要这样调用 find(function (err, data)){}

/**
callback 中的参数：
		第一个参数是 err
			成功是 null
			错误是 错误对象
		第二个参数是 结果
			成功是 数组
			错误是 undefined
**/
exports.findAll = function (callback) {

	// 在findAll方法里面调用文件操作,因为文件操作是异步的,所以是拿不到异步操作的值的.
	fs.readFile(dbPath, 'utf8',function (err, data) {
		if (err) {
			return	callback(err)
		}
		return callback(null, JSON.parse(data).students)
	})
}

// 根据id获取某个学生
exports.findById = function (id, callback) {
	fs.readFile(dbPath, 'utf8',function (err, data) {
		if (err) {
			return	callback(err)
		}
		var stu = JSON.parse(data).students.find(function (item) {
			return item.id === parseInt(id)
		})
		return callback(null, stu)
	})
}
// 添加保存学生
exports.save = function (student, callback) {
	fs.readFile(dbPath, 'utf8',function (err, data) {
		if (err) {
			return	callback(err)
		}
		var students = JSON.parse(data).students

		// 处理id
		student.id = students[students.length - 1].id + 1

		// 把用户传递的对象保存到数组中
		students.push(student)

		// 把要保存的对象转化为字符串
		var fileDate = JSON.stringify({
			students: students
		})

		// 把字符串保存到文件中
		fs.writeFile(dbPath, fileDate, function (err) {
			if (err) {
				// 根据上面规定的回调的参数，错误就把错误对象传过去
				return callback(err)
			}
			// 成功的话错误对象是null
			// 保存文件没有读取数据，就没有data，回调函数就只有错误对象
			callback(null)

		})
	})
}

// 更新学生
exports.updateById = function (student, callback) {
		fs.readFile(dbPath, 'utf8',function (err, data) {
		if (err) {
			return	callback(err)
		}
		var students = JSON.parse(data).students

		// 修改类型，不然会存得是数字类型，更新后变成字符串类型了。要统一
		student.id = parseInt(student.id)
		student.age = parseInt(student.age)
		student.gender = parseInt(student.gender)

		var stu = students.find(function (item) {
			return item.id === parseInt(student.id)
		})

		for (var key in student ) {
			stu[key] = student[key]
		}
		
		// 把要保存的对象转化为字符串
		var fileDate = JSON.stringify({
			students: students
		})

		// 把字符串保存到文件中
		fs.writeFile(dbPath, fileDate, function (err) {
			if (err) {
				// 根据上面规定的回调的参数，错误就把错误对象传过去
				return callback(err)
			}
			// 成功的话错误对象是null
			// 保存文件没有读取数据，就没有data，回调函数就只有错误对象
			callback(null)

		})
	})
}

// 删除学生
exports.deleteById = function (id, callback) {
	fs.readFile(dbPath, 'utf8',function (err, data) {
		if (err) {
			return	callback(err)
		}
		var students = JSON.parse(data).students

		// findIndex, 专门用来找下标，遍历后返回遍历项的下标
		var deleteId = students.findIndex( function (item) {
			return item.id === parseInt(id)
		})
		// splice删除元素，第一个参数是下标，第二个参数是从这个下标开始删几个，默认全部删除
		students.splice(deleteId, 1)

		// 把要保存的对象转化为字符串
		var fileDate = JSON.stringify({
			students: students
		})

		// 把字符串保存到文件中
		fs.writeFile(dbPath, fileDate, function (err) {
			if (err) {
				// 根据上面规定的回调的参数，错误就把错误对象传过去
				return callback(err)
			}
			// 成功的话错误对象是null
			// 保存文件没有读取数据，就没有data，回调函数就只有错误对象
			callback(null)

		})
	})
}
