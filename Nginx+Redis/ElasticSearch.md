# ElasticStack

### 简介

包括beats、logstash、elasticsearch、kibana

<img src="/Volumes/MAC文件/MyLearning/Nginx+Redis/images/image-20200509202638186.png" alt="image-20200509202638186" style="zoom: 33%;" />

- ElasticSearch基于Java，是个开源分布式搜索引擎，它的特点有：分布式、零配置、自动发现、索引自动分片、索引副本机制、RESTful风格接口、多数据源、自动搜索负载等。
- Logstash基于java，是一个开源的用于收集、分析和存储日志的工具
- Kibana基于node.js，Kibana可以为Logstash和ElasticSearch提供的日志分析友好的Web界面，可以汇总、分析和搜索重要数据日志
- Beats时一款采集系统监控数据的代理agent，是在被监控服务器上以客户端形式运行的数据收集器的统称，可以直接把数据发送给ElasticSearch或者通过Logstash发送给ElasticSearch，然后进行后续的数据分析活动。Beats由如下组成：
  - Packetbeat：一个网络数据包分析器，用于监控、收集网络流量信息，Packetbeat嗅探服务器之间的流量，解析应用层协议，并关联到消息的处理，支持ICMP(v4 and v6)、DNS、HTTP、Mysql、PostgreSQL、Redis、MongoDB、Memcache等协议；
  - Filebeat：用于监控、收集服务器日志文件
  - Metricbeat：可定期获取外部系统的监控指标信息，可以监控、收集Apache、HAProxy、MongoDB、MySQL、Nginx、PostgreSQL、Redis、System、Zookeeper等服务；
  - Winlogbeat：用于监控、收集Windows系统的日志信息；

# ElasticSearch

## 安装ES

```shell
docker network create somenetwork 
docker pull elasticsearch:6.5.4
docker run -d --name elasticsearch --net somenetwork -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:6.5.4
#浏览器输入127.0.0.1:9200，出来一堆json就安装成功了
```

## 安装ElasticSearch-Head

**Head 是 ES 的可视化工具（管理客户端）**

```shell
docker pull mobz/elasticsearch-head:5
docker create --name elasticsearch-head -p 9100:9100 mobz/elasticsearch-head:5
docker start elasticsearch-head
#浏览器输入127.0.0.1:9100访问
```

**注意：**由于前后端分离开发，所以访问的时候会存在跨域的问题，需要在服务端做CORS的配置：

```shell
# 打开docker elastic的bash
cd config
vi elasticsearch.yml
#配置跨域设置
http.cors.enabled: true
http.cors.allow-origin: "*"
```

**或者使用chrome插件的方式安装，不需要配置跨域**

在chrome商店安装 `ElasticSearch Head`

在创建索引时浏览器报错：PUT http://localhost:9200/film 406 (Not Acceptable)

**解决：**

```
进入head安装目录的 _site/ 文件目录，如果是使用 Docker 安装，需要先进入 Docker 容器。

找到vendor.js文件并编辑，共有两处

第一处在6886行 

把内容 'application/x-www-form-urlencoded' 改成  'application/json;charset=UTF-8'

第二处在7574行 

把内容 'application/x-www-form-urlencoded' 改成  'application/json;charset=UTF-8'
在命令行中，按 esc 键，输入:n，代表跳转到第n行，如:6886，就跳转到第6886行。
```

## 基本概念

### 索引（有点像数据库的索引）

- 索引（index）是ElasticSearch对逻辑数据的逻辑存储，可以分为更小的部分
- 可以把索引看成关系型数据库的表，索引的结构是为快速有效的**全文索引**准备的，特别是它**不存储原始值**
- ElasticSearch可以把索引存放在一台机器或者分散在多台服务器上，每个索引有一或多个分片（shard），每个分片可以有多个副本（repica）

### 文档（与MongoDB一样）

- 存储在ES中的主要实体叫文档（document）。用关系型数据库来类比的话，一个文档相当于数据库表中的一行记录
- ES和MongoDB中的文档相似，都可以有不同的结构，但是ES的文档中，相同字段必须有相同类型
- 文档由多个字段组成，每个字段可能多次出现在一个文档里，这样的字段叫多值字段（multivalued）
- 每个字段的类型可以是文本、数字、日期等。字段类型也可以是复杂类型，一个字段包含其他子文档或者数组。

### 映射

所有文档写进索引之前都会先进行分析，如何将输入的文本分割为词条，哪些词条又会被过滤，这种行为叫做映射（Mapping）。一般由用户自己定义规则

### 文档类型

- 在ES中，一个索引对象可以存储很多不同用途的对象。例如，一个博客应用程序可以保存文章和评论
- 每个文档可以有不同的结构
- 不同的文档类型不能为相同的属性设置不同的类型。例如，在同一索引中的所有文档类型中，一个叫title的字段必须具有相同的类型。

## RESTful API

**使用Advanced REST Client 来模拟发送请求**

在ES中，提供了功能丰富的RESTful API的操作，包括基本的CRUD、创建索引、删除索引等操作

### 创建非结构化索引

在Lucene中，创建索引是需要定义字段名称以及字段类型的，在ES中提供了非结构化的索引，就是不需要创建索引结构即可写入数据到索引中，实际上ES底层会进行结构化操作，此操作对用户是透明的

创建空索引：

```json
# 创建空索引，下面的json要写在request的PayLoad里
PUT /haoke
{
  "settings": {
    "index": {
      "number_of_shards": "2", #分片数
      "number_of_replicas": "0" #副本数
    }
  }
}
# 返回码 200

#删除索引，不需要发请求，下面的json是收到的response的json
DELETE /haoke
#response
{
  "acknowledged": true
}
```

### 插入数据

```
url规则：
POST /{索引}/{类型}/{id}
```
<img src="/Volumes/MAC文件/MyLearning/Nginx+Redis/images/image-20200510083513202.png" alt="image-20200510083513202" style="zoom: 67%;" />

```json
#插入数据使用POST
POST /haoke/user/1001
#数据
{
	"id": 1001,
  "name": "张三",
  "age": 20,
  "sex": "男"
}
# 返回码 201 Created
# Response
{
"_index": "haoke",
"_type": "user",
"_id": "1001",
"_version": 1,
"result": "created",
"_shards": {
"total": 1,
"successful": 1,
"failed": 0
},
"_seq_no": 0,
"_primary_term": 1
}
```

说明：非结构化的索引不需要事先创建，发送请求以后直接插入数据就有一个默认索引。

注意：\_id和id不是一个东西。_id是唯一标志符，id只是一个数据字段。在url指明id插入时就是指明的url id，未指明id时为自动生成的\_id

![image-20200510083313225](/Volumes/MAC文件/MyLearning/Nginx+Redis/images/image-20200510083313225.png)

### 更新数据

在ES中，文档数据是不能更改的。但是可以通过覆盖的方式进行更新。

```json
# 更新使用PUT
PUT /haoke/user/1001
{
  "id": 1001,
  "name": "张三",
  "age": 21,
  "sex": "女"
}

# status 200 OK
{
"_index": "haoke",
"_type": "user",
"_id": "1001",
"_version": 2, #版本从1变成2
"result": "updated", # 数据已经更新
"_shards": {
"total": 1,
"successful": 1,
"failed": 0
},
"_seq_no": 1,
"_primary_term": 1
}
```

### 局部更新

文档数据是不能更新的，但是在内部会查询到这个文档数据，然后进行覆盖操作：

1. 从旧文档中检索JSON
2. 修改它
3. 删除旧文档
4. 索引新文档

```json
# 注意这里多了_update标志，并且发送的是POST请求而不是PUT
POST /haoke/user/1001/_update
{
  "doc":{
    "age":23
  }
}
```

### 删除数据

在ES中删除文档数据只需发起一个DELETE请求

如果删除的数据不存在，会响应404

```json
DELETE /haoke/user/1001

#response
{
"_index": "haoke",
"_type": "user",
"_id": "1001",
"_version": 4, # 注意，删除也是对这个文档做了修改，也会有一个version
"result": "deleted",
"_shards": {
"total": 1,
"successful": 1,
"failed": 0
},
"_seq_no": 3,
"_primary_term": 1
}
```

说明：删除一个文档也不会立即从磁盘上移除，只是被标记成已删除。ES将会在你之后添加更多索引的时候才会在后台进行删除内容的清理。

### 根据id查询数据

```json
GET /haoke/user/1001
#response
{
"_index": "haoke",
"_type": "user",
"_id": "1001",
"_version": 1,
"found": true,
"_source": {
"id": 1001,
"name": "张三",
"age": 20,
"sex": "男"
}
}
```

### 查询全部数据

```
# 默认返回10条数据
GET http://127.0.0.1:9200/haoke/user/_search
```

### 关键字搜索数据

```
# 查询年龄等于20的用户
GET /haoke/user/_search?q=age:20
```

### DSL搜索

ES提供丰富且灵活的查询语言叫做DSL查询(Query DSL)，它允许你构建更加复杂、强大的查询。DSL（Domain Specific Language 特定领域语言），以JSON请求体的形式出现。

**DSL可以使用Postman编写json请求体**

```json
POST /haoke/user/_search
# Get请求无法设置请求体，所以发起POST请求
{
  "query": {
  	"match": {
  		"age": 21
  	}
  }
}
#查询年龄大于30岁的男性用户
{
  "query": {
  	"bool": {
  		"filter": { # 过滤年龄
  			"range": {
  				"age": {
  					"gt": 10
  				}
  			}
  		},
  		"must": { # 必须满足
  			"match": {
  				"sex": "男"
  			}
  		}
  	}
  }
}
```

### 全文搜索、高亮显示、聚合

```json
{
  "query": {
  	"match": {
  		"name": "张三 李四"
  	}
  },
  	"highlight": { # 高亮显示
  		"fields": {
  			"name": {}
  		}
  	}
}
```

在ES中，支持聚合操作，类似SQL中的 group by操作。

```json
{
  "aggs": {
    "all_interests": {
      "terms": {
        "field": "age"
      }
    }
  }
}
#response
    "aggregations": {
        "all_interests": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
                {
                    "key": 20,
                    "doc_count": 1
                }
            ]
    
```

## 核心详解

### 文档

一个文档不只有数据。还包含了元数据（metadata）--关于文档的信息。三个必须的元数据节点是：

- _index: 文档存储的地方(索引库)

  - 索引(index)：类似于关系型数据库中的 “数据库” ---是存储和索引相关联数据的地方。
  - 事实上数据被存储和索引在**分片(shard)**中，索引只是一个把一个或多个分片分组在一起的逻辑空间【haoke这个索引库就是由两个分片组成的，数据存储在分片中】，但是我们不用担心分片。对于应用程序而言，文档存储在索引(index)中。

  ![image-20200510101317111](/Volumes/MAC文件/MyLearning/Nginx+Redis/images/image-20200510101317111.png)

- _type: 文档代表的对象的类

  - 在关系型数据库中，我们经常将相同类的对象存储在一个表里，因为它们有着相同的结构。同理，ES也使用相同 **类型(Type)**的文档表示相同的“事物”，因为它们的数据结构也是相同的。
  - 每个类型(type)都有自己的映射(mapping)或者结构定义，就像传统数据库表中的列一样。所有**类型下的文档**被存储在同一个**索引**下，但是类型的**映射(mapping)**会告诉ES不同的文档如何被索引
  - _type的名字可以是大写或者小写，不能包含下划线或者逗号。

- _id: 文档的唯一标识

  - id仅仅是一个字符串，它与_index和\_type组合时，就可以在ES中唯一标识一个文档。当创建一个文档时，你可以自定义\_id，也可以让ES帮你自动生成(32位长度)

```json
{
"_index": "haoke",
"_type": "user",
"_id": "1001",
"_version": 1,
"found": true,
"_source": { # source:数据
"id": 1001,
"name": "张三",
"age": 20,
"sex": "男"
}
}
```

### 查询响应

#### pretty

可以在url后面添加pretty参数，使得返回的 raw json 数据得到美化

```
http://127.0.0.1:9200/haoke/user/1001?pretty
```

#### 指定响应字段

在响应的数据中，如果我们不需要全部的字段，可以指定某些需要的字段进行返回

```
# 还是会返回元数据
http://127.0.0.1:9200/haoke/user/1001?_source=id,name&pretty
```

#### 不返回元数据

仅返回原始数据

```
GET http://127.0.0.1:9200/haoke/user/1001/_source?pretty
```

#### 返回原始数据中的指定字段

```
GET http://127.0.0.1:9200/haoke/user/1001/_source?_source=id,name&pretty
```

### 判断文档是否存在

如果存在状态码(Status)返回200 OK，不用去解析body

如果不存在返回 404 Not Found

```
HEAD /haoke/user/1005
```

### 批量操作

#### 批量查询

如果不存在doc会返回 "found":false

```json
POST http://127.0.0.1:9200/haoke/user/_mget
{
	"ids": ["mHZQ_HEBUGVc44YmIByu",1001]
}
```

#### _bulk操作

ES中批量插入、修改、删除操作都是通过_bulk的api完成的。

请求格式如下：

```
{action: {metadata}}\n
{request body}	\n
{action: {metadata}}\n
{request body}	\n
...
```

批量插入数据

```json
POST http://127.0.0.1:9200/haoke/user/_bulk #直接http://127.0.0.1:9200/_bulk也可以
{"create": {"_index":"haoke","_type":"user","_id":2001}}
{"id": 2001,"name": "name1","age": 20,"sex": "男"}
{"create": {"_index":"haoke","_type":"user","_id":2002}}
{"id": 2002,"name": "name2","age": 20,"sex": "男"}
{"create": {"_index":"haoke","_type":"user","_id":2003}}
{"id": 2003,"name": "name3","age": 20,"sex": "男"} #注意最后一行要有回车

```

批量删除：

由于delete没有请求体，所以action的下一行直接就是一个action

```json
POST http://127.0.0.1:9200/_bulk #由于已经指定了metadata，所以url不用指定index和type就能操作
{"delete": {"_index":"haoke","_type":"user","_id":2001}}
{"delete": {"_index":"haoke","_type":"user","_id":2002}}
{"delete": {"_index":"haoke","_type":"user","_id":2003}}
```

### 分页

和SQL使用LIMIT关键字返回只有一页的结果一样，ES接受from和size参数：

```
size: 结果数，默认10
from：跳过开始的结果数，默认0
```

如果你想每页显示5个结果，页码从1到3，请求如下

```json
GET /_search?size=5
GET /_search?size=5&from=5
GET /_search?size=5&from=10 
http://127.0.0.1:9200/haoke/user/_search?size=1&from=2
```

在集群系统中深度分页

假设在一个有5个主分片的索引中搜索。当我们请求结果的第一页（1-10）时，每个分片产生自己最顶端10个结果然后返回给请求节点（requesting node），它再排序这些所有的50个结果以选出顶端的10个结果。

现在假设我们请求第1000页，结果10001-10010。工作方式都相同，不同的是每个分页都必须产生顶端的10010个结果。然后请求节点排序这50050个结果并丢弃掉前50040个。

可以看到分布式系统中，排序结果的花费随着分页的深入而成倍增长。这也是为什么网络搜索引擎中任何语句不能返回多于1000个结果的原因。

### 映射

前面我们创建的索引以及插入数据，都是由ES进行自动判断类型，有时我们需要明确字段类型，否则自动判断的类型和实际需求是不相符的。

自动判断的规则如下：

| JSON type                       | Field type |
| ------------------------------- | ---------- |
| Boolean: true of false          | "boolean"  |
| Whole number: 123               | "long"     |
| Floating point: 123.45          | "double"   |
| String,valid date: "2014-09-15" | "date"     |
| String: "foo bar"               | "String"   |

ES中支持的类型如下：

| 类型           | 表示的数据类型             |
| -------------- | -------------------------- |
| String         | string, text, keyword      |
| Whole number   | byte, short, integer, long |
| Floating point | float,double               |
| Boolean        | boolean                    |
| Date           | date                       |

- String 类型在旧版本使用较多，从5.x开始不再支持string，由text和keyword类型代替
- text类型[做分词]，当一个字段是要被全文搜索的，比如Email内容、产品描述，应该使用text类型。设置text类型后，字段内容会被分析，在生成倒排索引以前，字符串会被分析器分成一个一个词项。text类型的字段不用于排序，很少用于聚合
- keyword类型[不做分词]适用于索引结构化的字段，比如email地址、主机名、状态码和标签。如果字段需要进行过滤（比如查找已发布博客中status属性为published的文章）、排序、聚合。keyword类型的字段只能通过精确值搜索到。

#### 创建明确类型的索引

```json
PUT /itcast
{
	"settings": {
    "index": {
      "number_of_shards": "2",
      "number_of_replicas": "0"
    }
  },
  "mappings": {
    "person": {
      "properties": {
        "name": {
          "type": "text"
        },
        "age": {
          "type": "integer"
        },
        "mail": {
          "type": "keyword"
        },
        "hobby": {
          "type": "text"
        }
      }
    }
  }
}
```

查看映射

```
GET /itcast/_mapping
```

#### 插入数据

```json
{"index": {"_index":"itcast","_type":"person"}}
{"name": "张三","age": 20,"mail": "111@qq.com","hobby": "羽毛球、乒乓球、足球"}
{"index": {"_index":"itcast","_type":"person"}}
{"name": "李四","age": 21,"mail": "222@qq.com","hobby": "羽毛球、乒乓球、足球、篮球"}
{"index": {"_index":"itcast","_type":"person"}}
{"name": "王五","age": 22,"mail": "333@qq.com","hobby": "羽毛球、篮球、游泳、听音乐"}
{"index": {"_index":"itcast","_type":"person"}}
{"name": "赵六","age": 23,"mail": "444@qq.com","hobby": "跑步、游泳"}
{"index": {"_index":"itcast","_type":"person"}}
{"name": "孙七","age": 24,"mail": "555@qq.com","hobby": "听音乐、看电影"}
```

#### 测试搜索

```json
POST /itcast/person/_search
{
  "query": {
    "match": {
      "hobby": "音乐"
    }
  }
}
```

### 结构化查询

