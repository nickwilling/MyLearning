// 当你采用无分号的代码风格的时候，只要注意以下情况就不会有问题了：
// 	当一行代码是以：
	// 	(
	//	[
	// 	`
	// 开头的时候，则在前面补上一个分号以避免一些语法错误。不要不在上一行行末。
	// 所以你会发现在一些第三方的代码中能看到一上来就以一个；开头。
	// 有些人也喜欢玩一些花哨的东西比方说加！、&、~等
function say() {
	console.log('hello world!')
}

// TypeError: say(...) is not a function
say()

// 1.JavaScript中的匿名函数定义 function (a,b) { }
// 个人常用的直接执行匿名函数的方式
	// (匿名函数)();【推荐使用】 (匿名函数() );
;(function () {
	console.log('hello')
})()

;(function () {
	console.log('world')
}())

// 2.数组遍历
;['苹果', '香蕉'].forEach(function (item) {
	console.log(item)
})

// 3.` 是 EcmaScript 6 中新增的一种字符串包裹方式， 叫做： 模板字符串
// 它支持换行和非常方便的凭借变量

var foo = 
`
大家好                     床前明月光
hello
world
哈哈啊
`

console.log(foo)

;`hello`.toString()
