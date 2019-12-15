var foo = 'bar'

function add(x,y) {
	return c + y
}

// 希望只导出add方法
// exports.add = add

//你可以认为在每个模块的最后return了这个exports
// 1. 直接另exports=add这个方法
// exports = add 这种方式不行

// 需要使用以下的方法：对这个模块的exports重新赋值
module.exports = add
