var foo = 'bbb'

console.log('b.js文件被执行了')

// console.log(exports)

// 动态为对象添加成员，返回一个字典
exports.foo = 'hello'
exports.add = function (x,y,z){
	return x + y
}

exports.readFile = function(path,callbacks){
	console.log('文件路径： ', path)
}