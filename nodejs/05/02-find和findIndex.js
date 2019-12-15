var users = [
    {id:1, name: '张三'},
    {id:2, name: '张三'},
    {id:3, name: '张三'},
    {id:4, name: '张三'}
]

// 函数作为参数
// 传条件函数
Array.prototype.myFind = function (conditionFunc) {
    // 相当于这里有一句这个代码：
    //conditionFunc = function (item, index) { return item.id===4}
    
    for (var i = 0; i < this.length; i++) {

        // 每循环一次要执行一次条件函数, 如果有一次执行返回的是ture就执行下面的代码
        if (conditionFunc(this[i], i)) {
            // 如果为true，就返回this[i]，遍历完都没有就是undefined
            return this[i]
        }
    }
}

Array.prototype.myEach = function(myFunc) {
	for (var i = 0; i < this.length; i++) {
		myFunc(this[i], i)
	}
}

var result = users.myFind(function (item, index) {
// 返回一个条件
    return item.id ===4
})

console.log(result)

users.myEach(function (item, index) {
	console.log(item)
})

;['abc', 'd', 'efg'].myEach(function  (item, index) {
            console.log(item)
        })