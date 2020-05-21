**Redis 支持的五种数据类型：string（字符串），hash（哈希），list（列表），set（集合）以及zset（sorted set：有序集合）**

## String类型
String数据结构是简单的 key-value 类型，value不仅是string，也可以是数字（包括int、float和double），是包含很多种类型的特殊类型，

String类型是二进制安全的，意思是redis的string可以包含任何数据。
比如序列化的对象进行存储，比如一张图片进行二进制存储，比如一个简单的字符串，数值等等。

### String命令
```
赋值语法：
    SET KEY_NAME VALUE：（说明：多次设置name会覆盖，set命令如果key已经存储，就要覆盖旧值且无视类型）

命令：
    SETNX key value：（SET if Not eXist）如果 key1 不存在，则设值并返回 1。如果 key1 存在，则不设值并返回0；（是解决 分布式锁 方案之一，只有在指定的 key 不存在时为 key 设置指定值。）

    SETEX key seconds value:（expired）设置key的值为value，过期时间为 seconds， 时间到后key清除 

    SETRANGE key offset value: 从 key 的第 offset 位开始替换字符串
    
取值语法：
    GET KEY_NAME: 如果 key 不存在，返回nil。如果 key 存储的值不是string，返回一个错误。

    GETRANGE key start end ：截取key[start,end]，包括start和end

    GETSET key value：(返回旧值，写上新值)用于设置指定 key 的值，并返回 key 的旧值，当 key 不存在时，返回 nil

删值语法：
    DEL key [key ...] 可填入多个值一起删除，返回值数据类型

批量写：MSET key value [key value ...]
批量读：MGET key [key ...]

自增/自减：
    自增：INCR key / INCRBY key increment : 将 key 中存储的数字值增1/increment.如果 key 不存在，那么 key 的值会先被初始化为 0，然后再执行 INCR / INCRBY 操作。  

    自减：DECR key / DECRBY key decrement: 如果 key 不存在，那么 key 的值会先被初始化为 0，然后再执行 DECR / DECRBY 操作。注意：这些 key 必须是数字类型字符串，不然会出错（(error) ERR value is not an integer or out of range）。

字符串拼接： APPEND key value: 为指定的 key 在末尾追加，如果不存在，为 key 赋值

字符串长度： STRLEN key  ("-31234" 负数的 - 负号也算一位)
```

### String应用场景
1. String 通常用于保存单个字符串或 JSON 字符串数据
2. 因 String 是二进制安全的，所以可把一个图片文件的内容作为字符串存储
3. 计数器（常规 key-value 缓存应用。常规计数：微博数、粉丝数）

>INCR等指令具有原子操作（要么成功要么失败，给每个命令都独立加锁，不会出现线程安全问题）的特性，可使用 INCR、INCRBY、DECR、DECRBY等指令来实现原子计数的效果。假如，在某种场景下有 3 个客户端同时读取了mynum 的值（值为2），然后对其同时进行了加1操作，那么，最后 mynum 的值一定是5。


## Hash类型 Object（Map）
```
Hash类型是 String 类型的 field 和 value 的映射表，或者说是一个 String 集合。hash 特别适合于存储对象，相比较而言，将一个对象类型存储在 Hash 类型 要比 存储在 String 类型里占用更少的内存空间，并方便对整个对象的存储。
可将其堪称具有 key 和 value 的 map 容器，该类型非常适合于存储值对象 的信息，
比如：uname，upass，age等。该类型的数据仅占用很少的磁盘空间（相比于JSON）。
Redis 中每个 hash 可以存储 2^32次方 -1 个键值对
```

### Hash命令
```
赋值语法：
    HSET key field(字段/域) value: 为指定的KEY，设置域-值对 | 对每一个 key，一次一个域-值对加进去
    HMSET key field value [field value...] 同时将多个域-值对设置到哈希表 key 中。｜对于每个 key，一次添加多对域-值对进去 

取值语法：
    HGET key field：对每一个key，一次取一个field的值
    HMGET key field [field ...]: 对每一个key，一次可以取多个给定字段的值
    HGETALL key：返回哈希表中所有字段和值

HKEYS key :获取哈希表 key 中所有的字段名
HLEN key：获取哈希表 key 中字段的数量

删除语法：
    HDEL key field [field ...]

其他语法：
    HSETNX(SET if Not eXist) key field value :只有在字段不存在时才设置哈希表字段的值。成功返回1，失败返回0.
    HINCRBY key firld increment : 为哈希表 key 中的指定字段的整数值加上增量increment
    HINCRBYFLOAT key field increment : 为哈希表 key 中指定字段的浮点数值加上增量 increment (这里的 increment 可以是 int 也可以是 float)
    HEXISTS key field：查看哈希表 key 中指定的字段是否存在
```

### 应用场景
Hash的应用场景：（用于存储一个用户信息**对象**数据）
1. 常用于存储一个对象
2. 为什么不用 string 存储一个对象？
```
user id name age
--> 存的时候将对象转成JSON字符串
set user:1 {"id":1,"name":"lisi",score:"20"}
--> 取的时候将JSON转成对象 
--> 修改的时候对对象进行修改
--> 再将修改的对象转成JSON字符串
不用hash的话有两种方式来存储
2. 用户对象信息有多少成员就存多少个key-value对,再将用户id+对应属性名(user:1:id)作为唯一标志来取得对应属性值
set user:1:id 1
set user:1:name lisi
set user:1:score 22
 
```


**hash 是最接近关系型数据库结构的数据类型，可以将数据库一条记录或者程序中一个对象转换成 hashmap 存放在 redis 中。**

**Redis 中的 hash 实际是内部存储的 value 为一个 HashMap**


## List类型
类似于Java中的LinkedList，是一个双向链表的结构(双端队列)可以通过相关的操作进行集合头部或者尾部添加和删除元素，既可以作为
栈又可以作为队列

有两个指针，分别指向集合的头部和尾部，可每次可以在列表的头部或者尾部插入数据(可以往左插入或删除，也可以往右插入或删除)

### 常用命令
```
赋值：
    LPUSH key value [value...]:将一个或多个值插入到列表的头部（往左侧添加）【如果列表不存在，新建并插入】
    RPUSH key value [value...]：将一个或多个值添加到列表的尾部（往右侧添加）
    LPUSHX(eXist) key value: 将一个值插入到已存在的列表头部，如果列表不存在，则不插入
    LPUSHX: key value:插入到已存在的列表尾部
取值：
    LLEN key:获取列表长度
    LINDEX key index：通过索引获取列表中的元素
    LRANGE key start stop：获取列表指定范围内的元素(0为第一个元素，-1为最后一个元素)
删除：
    LPOP key：移出并获取列表的第一个元素（从左侧删除）
    RPOP key：移出并获取列表的最后一个元素（从右侧删除）

    BLPOP key [key ...] timeout 移出并获取列表的第一个元素，如果列表没有元素会阻塞（block）列表知道等待超时或发现可弹出元素为止
    BRPOP key [key ...] timeout 移出并获取列表的最后一个元素，如果列表没有元素会阻塞列表知道等待超时或发现可弹出元素为止
    实例：
    //这个时候我没有list3这个列表，操作会被挂起，知道我用另一个终端往list3里插入一个元素，第一个终端会将这个元素删除并返回值和等待时间，不然等超时后返回nil
    127.0.0.1:6379> blpop list3 100 
        1) "list3"
        2) "123"
        (75.98s)
    127.0.0.1:6379> blpop list3 10
        (nil)
        (10.09s)
    
    LTRIM key start stop：左闭右闭[start,stop]对一个列表进行修剪（trim），就是说，让列表只保留指定区域内的元素，不在指定区域内的元素会被删除

修改：
    LSET key index value：通过索引设置列表元素的值
    LINSERT key BEFORE|AFTER wrold value:在列表的元素前或者后插入元素 描述：将值value插入到列表key当中，位于找到的第一个world这个值之前或者之后

高级命令：
    RPOPLPUSH source destination：移出列表的最后一个元素，并将该元素添加到另一个列表并返回
    示例描述：
        RPOPLPUSH a1 a2: a1的最后元素移到a2的左侧
        RPOPLPUSH a1 a1: 循环列表，将最后元素移到最左侧

    BRPOPLPUSH source destination timeout：从列表中弹出一个值，将弹出的元素插入到另一个列表中并返回它；如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止
        
```
### 应用场景
常应用于：
1. 对数据量大的集合数据删减
   1. 列表数据显示、关注列表、粉丝列表、留言评价等……分页、热点新闻（TOP5）等
   2. 利用LRANGE还可以很方便的实现分页的功能在博客系统中，每片博文的评论也可以存入一个单独的list中
2. 任务队列
   1. list通常用来实现一个消息队列，而且可以确保先后顺序，不必像mySQL那样还需要通过orderBy进行排序
```
任务队列介绍（生产者和消费者模式）：
    在处理Web客户端发送的命令请求时，某些操作的执行时间可能比我们预期的更长一下，通过将执行任务的相关信息放入任务队列里面，并在之后对队列进行处理，用户可以推迟执行那些需要一段时间才能完成的操作，这种工作交给任务处理器来执行的做法被称为任务队列（task queue）。

RPOPLPUSH source destination
移出列表的最后一个元素，并将该元素添加到另一个列表并返回
```
### 案例1
```
比如：获取最新5条首页新闻，获取最新的评论列表，获取最后登录的10个用户，获取最近7天的活跃用户数或作为队列来使用。
```

### 案例2:任务队列
```
1、 用户系统登录注册短信实名认证等
2、 订单系统的下单流程等
```

## set类型
### 命令
```
赋值：
    SADD key member [member ...]：向集合添加一个或多个成员

取值：
    //cardinality（number of set）
    SCARD key：获取集合的成员数
    SMEMBERS key：返回集合中的所有成员
    SISMEMBER key member：判断 member 元素是否是集合 key 的成员（开发中验证是否存在判断）
    SRANDMEMBER key [count]：返回集合中一个或多个随机数

删除：
    SREM key member [member...]：移除集合中一个或多个成员
    SPOP key [count]：移除并返回集合中的一个随机元素
    SMOVE source destination member：将 member 元素从 source 集合移动到 destination 集合

差集：
    SDIFF key [key...]：返回给定所有集合的差集
    SDIFFSTORE destination key [key ...]：返回给定所有集合的差集并存储在 destination 中
交集：
    SINTER key [key...]：返回给定所有集合的交集
    SINTERSTORE destination key [key...]：返回给定所有集合的交集并存储在 destination 中
并集： 
    SUNION key [key...]：返回给定所有集合的并集
    SUNIONSTORE destination key [key...]：返回给定所有集合的并集并存储在 destination 中
```

### 应用场景
常应用于：对两个集合间的数据【计算】进行交集、并集、差集运算
1. 利用集合操作，可以取不同兴趣圈子的交集以非常方便的实现如共同关注、共同喜好、二度好友等功能。对上面的所有集合操作，你还可以使用不同的命令选择将结果返回给客户端还是存储到一个新的集合中。
2. 利用唯一性，可以统计访问网站的所有独立ip、存取当天【或某天】的活跃用户列表。

案例1
- 判断用户名是否存在

案例2
- 抽奖活动
- 现有员工10个。一等奖1名。二等奖2名、三等奖3名。用redis实现

案例3
- 有两组数据，求两组数据的交并补

## ZSET
有序集合（Sorted Set）
1. Redis有序集合和集合一样也是string类型元素的集合，且不允许重复的成员
2. 不同的是每个元素都会关联一个double类型的分数（score）。redis正是通过分数来为集合中的成员进行从小到大的排序。
3. 有序集合的成员是唯一的，但分数（score）却可以重复
4. Redis 的 ZSET 是有序、且不重复

```
赋值：
    ZADD key [NX|XX] [CH] [INCR] score member [score member...]：向有序集合添加一个或多个成员，或者更新已存在成员的分数
    zadd zset1 95 java 90 h5 80 mysql 60 redis ---> redis、mysql、h5、java
    zadd zset1 50 java(把java的分数改为50分，排名降低了) --->java、redis、mysql、h5

取值：
    ZCARD key：获取有序集合的成员数
    ZCOUNT key min max：计算在有序集合中指定区间分数的成员数
    ZRANK key member：返回有序集合中指定成员的索引
    ZRANGE：key start stop [WITHSCORES]：通过索引区间返回有序集合成指定区间内的成员（低到高）
    ZREVRANGE：key start stop [WITHSCORES]：通过索引区间返回有序集合成指定区间内的成员（高到低）
        示例：127.0.0.1:6379> zrange zset1  0 -1 WITHSCORES
                            1) "java"
                            2) "50"
                            3) "redis"
                            4) "60"
                            5) "mysql"
                            6) "80"
                            7) "h5"
                            8) "90"

    ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT]：通过分数返回有序集合指定区间内的成员
    127.0.0.1:6379> zrangebyscore zset1 60 90 withscores //分数从小到大
                    1) "redis"
                    2) "60"
                    3) "mysql"
                    4) "80"
                    5) "h5"
                    6) "90"
    ZREVRANGEBYSCORE key min max [WITHSCORES] [LIMIT]：通过分数返回有序集合指定区间内的成员
    127.0.0.1:6379> zrevrangebyscore zset1 90 60 withscores //分数从大到小
                    1) "h5"
                    2) "90"
                    3) "mysql"
                    4) "80"
                    5) "redis"
                    6) "60"

删除：
    DEL key ：移除集合
    ZREM key member [member...]：移除有序集合中一个或多个元素
    ZREMRANGEBYRANK key start stop：[start,stop闭区间]移除有序集合中给定的排名区间的所有成员（第一名是0，低到高排序）
    ZREMRANGEBYSCORE key min max：[start,stop闭区间]移除有序集合中给定分数区间的所有成员
    ZINCRBY key increment member：增加member元素的分数increment分，返回值是更改后的分数

```

### 应用场景
常应用于排行榜

销量排名、积分排名等
>1、比如Twitter 的 public timeline 可以以发表时间作为score来存储，这样获取时就是自动按时间排好序的。
>
>2、比如一个存储全班同学成绩的Sorted Set，其集合value可以是同学的学号，而score就可以是其考试得分，这样在数据插入集合的时候就进行了天然的排序
>
>3、还可以用SortedSet来做带权重的队列，比如普通消息的score为1，重要消息的score为2，这样工作线程就可以选择按score的倒序来获取工作任务，让重要的
>工作优先执行。

案例1:
>积分、成绩、等等排行榜

学员成绩排行榜
```
需求1:在zset中插入10名同学成绩
需求2:按成绩高到低，查处前三名同学的成绩信息
需求3:查询成绩在60-80分之间的同学的成绩信息
```
