## MongoDB

前端一般用非关系型数据库（NoSQL） 关系型数据库和非关系型数据库的差异： 1. 数据存储方式不同。 - 关系型数据天然就是表格式的，因此存储在数据表的行和列中。 - 非关系型数据天然就是分布式的，不适合存储在数据表的行和列中，而是大块组合在一起。非关系型数据通常存储在数据集中，就像文档、键值对或者图结构。 2. 扩展方式不同。 - SQL数据库是纵向扩展，为了支持更多并发量，，也就是说提高处理能力，使用速度更快速的计算机，这样处理相同的数据集就更快了。 - NoSQL数据库是横向扩展的。NoSQL数据库的扩展可以通过给资源池添加更多普通的数据库服务器(节点)来分担负载。 `横向扩展` 也叫水平扩展， 用更多的节点支撑更大量的请求，如成千上万的蚂蚁完成一项搬运工作。 `纵向扩展` 又叫垂直扩展，扩展一个点的能力支撑更大的请求。 3. 对事务性的支持不同。 SQL数据库支持对事务原子性细粒度控制，并且易于回滚事务。 虽然NoSQL数据库也可以使用事务操作，但稳定性方面没法和关系型数据库比较，所以它们真正闪亮的价值是在操作的扩展性和大数据量处理方面。

- 非关系型数据库的优势：
  - 性能：NOSQL是基于键值对的，可以想象成表中的主键和值的对应关系，而且不需要经过SQL层的解析，所以性能非常高。
  - 可扩展性：同样也是因为基于键值对，数据之间没有耦合性，所以非常容易水平扩展。 关系型数据库的优势：
- SQL的优势
  - 复杂查询：可以用SQL语句方便的在一个表以及多个表之间做非常复杂的数据查询。
  - 事务支持：使得对于安全性能很高的数据访问要求得以实现。
- 对于这两类数据库，对方的优势就是自己的弱势，反之亦然。

## each和forEach

### each 是 art-template的专属模板语法
```
{{each(开始遍历) 数组(items)}}
<li>{{ $value(value是当前遍历项item)}}</li>
{{/each(结束遍历)}} #模板引擎支持的语法， 只能在模板字符串中使用
```

### jQuery的遍历

#### jquery的each方法的作用

**1.在不兼容forEach的低版本浏览器中代替forEach**

```
$.each(数组，function)
$('div').each(function) #一般用于遍历jQuery选择器选择到的伪数组实例对象
<!-- 因为div取出来的就是数组，所以不用加数组 -->

//jquery的遍历

<script src="node_modules/jquery/dist/jquery.js"></script>
$.each(['abc', 'd', 'efg'], function (index, item) {
            console.log(index)
            console.log(item)
        })
```

**2.对jquery元素进行遍历**



比方说有5个div，怎么去遍历它

```
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
```



```
console.log($('div'))
//输出下面信息，说明$('div')返回的是伪数组，不是Array，是Object，所以没有forEach方法
jQuery.fn.init(5)
0: div
1: div
2: div
3: div
4: div
length: 5
prevObject: jQuery.fn.init [document]
__proto__: Object(0)
$('div').each(function (index, item) {
            console.log(item)
        })
```

### forEach 是 EcmaScript 5 中的一个数组遍历函数，是 JavaScript 原生支持的遍历方法, 函数有两个参数：item和index

```
;['苹果', '香蕉'].forEach(function (item) {
    console.log(item)
})

;['abc', 'd', 'efg'].forEach(function  (item, index) {
            console.log(item)
        })
```

#### 对JQuery的元素使用forEach来遍历

只要将JQuery的元素转成数组就可以了

```
;[].slice.call($('div')).forEach(function (item, index) {
            console.log(item)
        })
```



**JQuery的each方法和forEach几乎一致，只不过JQuery是function（index, item）, forEach 是function (item, index)**