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

User.findOne({
    username: '456'
})
.then(function (user) {
    if (user) {
        console.log('用户已存在')
    } else {
        return new User({
            username: 'aaa',
            password: '123',
            email: 'dsadsa'
        }).save()
    }
})
.then(function (ret) {
console.log('注册成功'+ret)
})