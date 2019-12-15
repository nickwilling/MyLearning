var url = require('url')
var u = 'http://localhost:3000/pinglun?name=%E5%95%8A%E5%95%8A%E5%95%8A%E5%95%8A%E5%95%8A&message=%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6'
// 第二个参数为true时会将返回的query转化为查询对象
// 返回的pathname就是？前面的路径
var obj = url.parse(u,false)
console.log(obj)
console.log(obj.pathname)
console.log(obj.query)