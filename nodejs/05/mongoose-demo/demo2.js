var mongoose = require('mongoose')

// 1. 连接数据库，指定连接的数据库不需要存在，当你插入第一条数据之后就会被自动创建出来
mongoose.connect('mongodb://localhost/itcast')

 var Schema = mongoose.Schema;

// 2. 设计文档结构（表结构），包括约束
// 约束的目的是为了保证数据的完整性，不要有脏数据

var userSchema = new Schema({
	username: { // 后面加个对象就代表对username这个字段添加约束
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String
	}
})

// 3. 将文档结构发布为模型
var User = mongoose.model('User', userSchema)


// 新增一条数据，通过new({对象})
// var admin = new User({
// 	username: 'admin',
// 	password: '12345678',
// 	email: 'why1234me@163.com'
// })

// 持久化保存
// admin.save(function (err, ret) {
// 	if (err) {
// 		console.log('存储失败')
// 	} else {
// 		console.log('保存成功')
// 		console.log(ret)
// 	}
// })

// 查询

User.find({ username: 'admin', password: '12345678' },  'username password', function (err, docs) {
		if (err) {
			console.log("查询失败")
		} else {
			console.log(docs)
		}
	} )

var query = User.findOne({ username: 'admin', password: '12345678' })
query.select('username email')
query.exec(function (err, user) {
	if (err) {
		console.log('查询失败')
	} else {
		console.log(user)
	}
})

// User.remove({ username: 'user3' }, function (err) {
// 	if (err) console.log('删除失败')
// 	else console.log('删除成功')
// });

// User.deleteOne({ username: 'user2' }, function (err) {
// 	if (err) console.log('删除失败')
// 	else console.log('删除成功')
// });

// User.findByIdAndUpdate('5def6d64857c1cc8644e3778', {password: '123'}, function (err, ret) {
// 	if (err) {
// 		console.log('更新失败')
// 	} else {
// 		console.log(ret)
// 	}
// })

User.findOneAndUpdate({username: 'admin'}, {password: '123444'}, function (err, ret) {
	if (err) {
		console.log('更新失败')
	} else {
		console.log(ret)
	}
})