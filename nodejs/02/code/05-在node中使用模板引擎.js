// art-template
// 1.在需要使用的文件模块中加载 art-template
// 2.查文档，使用模板引擎的API
var fs = require('fs')
var template = require('art-template')

// 这里不是浏览器
// template('script 标签 id', {对象})

// var tplStr = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
// 	<meta charset="utf-8">
// 	<title>Document</title>
// </head>
// <body>
// 	<p>大家好，我叫： {{ name }}</p>
// 	<p>我今年 {{ age }} 岁了</p>
// 	<h1>我来自 {{ province }}</h1>
// 	<p>我喜欢： {{each hobbies}} {{ $value }} {{/each}}</p>
// </body>
// </html>
// `

fs.readFile('./tpl.html',function (err, data) {
	if (err) {
		return console.log('读取文件失败')
	}
	// 模板引擎的render方法接收的是字符串
	var ret = template.render(data.toString(), {
	name: 'Jack',
	age: 18,
	province: '北京市',
	hobbies: [
	'写代码' ,
	'唱歌',
	'打游戏'
	],
	title: '个人信息'
})
	console.log(ret)
})
