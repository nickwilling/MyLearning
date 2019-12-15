var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/itcast')

var Schema = mongoose.Schema;

// 直接导出模型构造函数
module.exports = mongoose.model('Student', new Schema({
	name:{
		type: String,
		required: true
	},
	gender: {
		type: Number,
		enum: [0, 1],// 加枚举，限定取值
		default: 0
	},
	age:{
		type: Number
	},
	hobbies:{
		type: String
	}
}))

