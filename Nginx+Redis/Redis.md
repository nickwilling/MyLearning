## Redis高级配置
### 高可用、高并发、高性能
- 高可用：（High Availability）设备可用性强，具有高可替代性，故障发生后，系统能马上恢复。【2个9-6个9(全年停机不超过32秒)】
- 高并发：（High Concurrency） 设备并发能力强，具有同时处理多种事务的能力。
  - 高并发相关常用的指标（响应时间、吞吐量、每秒查询率、并发用户数）
- 高性能：设备性能强，系统运算能力强，响应速度快。
  - 垂直扩展（把一个做好）、水平扩展（多来几个）

### 主从复制  
master-slave
一个master有很多个该资源的复制品，master用于处理写请求，slave用于处理写请求，主库只负责写数据，每次有数据更新都将更新的数据同步到所有的从数据库，而从库只负责读，可以实现“多读少写”。有以下好处：
1. 读写分离，不仅可以提高服务器的负载能力，并且可以根据读请求的规模自由增加或减少从库的数量。
2. 数据被复制成了好几份，就算有一台机器出故障，也可以使用其他机器的数据快速恢复
### 哨兵模式
主从复制的升级版：哨兵顾名思义就是监控redis系统的运行状况

Redis-Sentinel（哨兵模式）是高可用解决方案，当redis在做master-slave的高可用方案时，假如master宕机了，redis本身（以及其很多客户端）都没有实现自动进行主备切换，而 redis-sentinel 本身也是独立运行的进程，可以部署在其他与redis集群可通讯的机器中监控redis集群。
### Redis Cluster集群
**集群模式是实际使用最多的模式**

Redis Cluster是Redis分布式集群解决方案，主要解决Redis分布式方面的需求。比如，当遇到单机内存、并发和流量瓶颈的时候，Redis Cluster能起到很好的负载均衡的目的。

**为什么使用redis-cluster**
1. 为了在大流量访问下提供稳定的业务，集群化是存储的必然形态
2. 未来的发展趋势肯定是云计算和大数据的紧密结合
3. 只有分布式架构能满足要求

Redis-Cluster 至少要3(Master)+3(Slave)才能建集群。Redis-Cluster采用无中心结构（Master-Slave中Master是中心节点），每个节点都和其他所有节点连接。其中主节点提供读写操作，从节点作为备用节点，不提供请求，只作为故障转移使用。【**检测失效跟计算机网络差不多，半数以上节点检测失效才生效**】
  
## Redis优点
### 原子性
原子性是数据库的事务中的特性。在数据库事务的情景下，原子性指的是：一个事务（transaction）中的所有操作，要么全部完成，要么全部不完成，不会结束在中间某个环节。

对于Redis而言，命令的原子性指的是：一个操作的不可以再分，操作要么执行，要么不执行。（要么成功要么失败，Redis给每个命令都独立加锁，不会出
现线程安全问题）

Redis本身提供的**所有API都是原子操作**，Redis中的**事务**其实是要**保证批量操作的原子性**。
## Redis命令
Redis 命令用于在 redis 服务（redis-server）上执行操作，要在 redis 服务上执行命令需要一个 redis 客户端（redis-cli）。

- **TTL** - 以秒为单位，返回给定 key 的剩余生存时间(TTL, time to live)，如果永久不过期值就是 `-1`

- **CONFIG** 可以通过 CONFIG 命令查看或设置配置项。
  - config get
```shell
127.0.0.1:6379> CONFIG GET requirepass
1) "requirepass"
2) "12345678"
127.0.0.1:6379> CONFIG GET *
  1) "dbfilename"
  2) "dump.rdb"
  3) "requirepass"
  4) "12345678"
```
- - config set
  
```shell
redis 127.0.0.1:6379> CONFIG SET loglevel "notice"
OK
redis 127.0.0.1:6379> CONFIG GET loglevel
```

- **shutdown** 关闭redis（非强制）

## 常用命令key管理
```
keys *: 返回满足的所有键，可以模糊匹配 比如 keys abc* 代表以abc开头的所有 key
exists key ： 是否存在制定的key，存在返回1，不存在返回0
expire key second ： 设置某个key的过期时间 时间为秒
del key ： 删除某个key
ttl key ： 查看剩余时间，当key不存在时，返回-2；存在但没有设置剩余时间时（永久不过期），返回-1；否则，以秒为单位返回key的剩余生存时间
pttl key : 以毫秒为单位返回剩余生存时间
persist key ： 取消过期时间
PEXPIRE key millisecond ： 修改key 的过期时间为毫秒
select dbindex： 选择数据库 数据库为0-15 共16个数据库。设计成多个数据库实际上是为了数据安全和备份
move key dbindex ： 将当前数据中的key转移到其他数据库
randomkey ： 随即返回一个key
rename key key2 ： 重命名key
type key ： 返回key所储存的值的数据类型
echo message ： 打印命令
dbsize ： 查看数据库的key数量
info ： 查看数据库信息
config get * 实时存储收到的请求，返回相关的配置
flushdb ： 清空当前数据库
flushall ： 清空所有数据库
```

### expire key seconds 与 Exists key结合
expire 设置过期时间，exist 查询key是否存在，比如可以查询商品的优惠信息是否还存在

应用场景：
```
1、限时的优惠活动信息
2、网站数据缓存（对于一些需要定时更新的数据，例如：积分排行榜）
3、手机验证码
4、限制网站访客访问频率（例如：1分钟最多访问30次）
    1.Redis提供了TTL有效期特性
    2.对于每一个用户,在Redis记录访问次数
     -例如：key:192.168.11.12 value:39  超时时间60s
    3.用户每访问一次,对应计数器+1,超过上限(30)停止服务
    4.如果计数器超过100则认为爬虫攻击,永久加入黑名单(Redis Set保存黑名单)
    5.1分钟后key销毁,重新开始计数
```

### select 数据库index
```shell
127.0.0.1:6379> select 1
OK
127.0.0.1:6379[1]>  //选择序号为1的数据库时后面多了一个【1】
```

### key的命名建议
**如果几个key的命名符合命名规范，那么redis会将这几个key自动归为一类**
```
为什么要有命名建议？
---因为redis是非关系型数据库，数据和数据之间没有关联关系。比如说:
set name1 zhangsan
set name2 lisi
这两个数据如果命名不规范的话就不知道这两个数据是人名了。

命名规范：用：来分割
user:id:name
user:1:zhangsan
use:2:lisi
为什么使用\：(冒号来分割) 而不是其他（下划线）
user:id:name 和 user_id_name
因为在 mysql 中，表中字段的名字会使用下划线（比如t_name是姓名字段的名称），这个时候就变成了 user_id_t_name 这样就不能起到区分的作用了

```


**redis单个key允许存入512M大小**
1. key不要太长，尽量不要超过1024字节，这不仅消耗内存，而且会降低查找效率
2. key也不要太短，太短的话可读性会降低
3. 在一个项目中，key最好使用统一的命名模式，例如user：123:password；
4. key名称区分大小写



## 使用配置文件创建Redis

>注意：这里使用-v挂载配置文件的时候，首先需要在宿主机上创建redis.conf文件，
>
>touch /usr/local/docker/redis.conf
>
>这样/usr/local/docker/redis.conf 才是一个配置文件，不然/usr/local/docker/redis.conf 就是一个文件夹，是不能作为 server 的配置文件的。

还有，redis.conf里的daemonize 不能改为 yes， 这样的话docker就启动不了redis了。

```shell
docker run \
-p 6379:6379 \
--name myredis \
-v /usr/local/docker/redis.conf:/etc/redis/redis.conf \\挂载配置文件
-v /usr/local/docker/data:/data \  \\挂载数据
-d \
redis \
redis-server /etc/redis/redis.conf \
--appendonly yes

```

## NoSQL数据库的四大分类

- 键值（key-value）存储数据库
  - 这一类数据库主要会用到一个哈希表，这个表中有一个特定的键和一个指针只想特定的数据。
  - 举例：Redis
- 列存储数据库
  - 这部分数据库通常是用来应对分布式存储的海量数据。键仍然存在，但是他们的特点是指向了多个列。这些列是由列家族来安排的。
  - 举例：HBase
- 文档型数据库
  - 与第一种键值存储相类似。该类型的数据模型是版本化的文档，半结构化的文档以特定的格式存储，比如JSON。文档行数据库可以看作是键值数据库的升级版，允许之间嵌套简直。而且文档型数据库比键值数据库的查询效率更高。
  - 举例：MongoDB，它的查询效率非常高，支持非常丰富的查询。但是支持的数据类型比较单一，没有Redis丰富。

- 图形（Graph）数据库
  - 举例：Neo4J

## Redis有以下三个特点

- 支持数据的持久化，可以将内存中的数据保存在磁盘中，重启的时候可以再次加载进行使用。
- 不仅仅支持简单的 key-value 类型的数据， 同时还提供 list、set、zset、hash等数据结构的存储
- 支持数据的备份，集群等高可用功能。

## docker 开启redis
```shell
\\ -d以守护进程启动 --requirepass 设密码
docker run -d --name redis -p 6379:6379 redis --requirepass "12345678"
```
## redis启动客户端
```shell
redis-cli
```
如果设了密码启动redis-cli的时候会报错：
```shell
# redis-cli
127.0.0.1:6379> set name 1994
(error) NOAUTH Authentication required.
```
解决方法：
```shell
# redis-cli
127.0.0.1:6379> auth 12345678
OK
127.0.0.1:6379> 
```

## redis中内存维护策略
### 一 为数据设置超时时间
`expire key time (以秒为单位)` --- 例如验证码，可以设置90s后过期

`setex(String key, int seconds, String value) --字符串独有的方式`

- 除了字符串有自己独有的方式设置过期时间，其他都要靠`expire`方法设置时间
- 如果没有设置过期时间，那缓存就是永不过期
- 如果设置了过期时间，时间到了key就会被销毁，如果之后又想让缓存不过期，使用persist key命令

### 采用LRU算法动态将不用的数据删除
LRU：（Least Recently Used）内存管理的一种页面置换算法，对于在内存中但又不使用的数据块（内存块）叫做LRU，操作系统会根据哪些数据属于LRU而将其移出内存而腾出空间来加载另外的数据。

- 可在配置文件中设置有关lru的配置项

## 自定义配置Redis
```shell
daemonize no -- 修改为 daemonize yes 将默认以守护进程方式启动
bind 127.0.0.1 -- 注释掉 如果绑定了本地回环地址的话就代表只有本机可以访问，外部就访问不了了。
requirepass password -- 设置数据库密码（保证服务安全/有些情况下不设定密码是无法进行远程访问的）
```
> Redis 采用的是单进程多线程的模式。当redis.conf 选项中的daemonize设置成 yes 时， 代表开启守护进程模式。在该模式下，redis 会在后台运行， 并将进程 pid 号写入至 redis.conf 选项 pidfile 设置的文件中， 此时 redis 将一直运行， 除非手动 kill 该进程。 但当 daemonize 选项设置成 no 时， 当前界面将进入 redis 的命令行界面， exit强制退出或者关闭连接工具（putty Xshell等）都会导致redis进程退出。
> 
>服务端开发的大部分应用都是采用后台运行的模式
 
 ## Redis客户端
- Jedis
- Lettuce

Lettuce和Jedis比较
- Jedis直接连接redis server，如果在多线程环境下是非线程安全的，这个时候只有使用连接池，为每个jedis实例增加物理连接
- Lettuce是基于Netty的，连接实例（StatefulRedisConnection）可以在多个线程间并发访问
- SpringBoot2以后优先使用Lettuce


## SpringBoot整合Redis
**Redis有什么命令，Jedis就有什么方法**

创建的是maven项目

1.首先在 pom 文件中添加 redis 依赖
```xml
 <dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
 </dependency>
```
2.在spring配置文件中配置 redis 的信息
```yml
server:
  port: 8080

spring:
  redis:
    host: 127.0.0.1
    password: 12345678
    port: 6379
    jedis:
      pool:
        max-idle: 6
        max-active: 10
        min-idle: 2
    timeout: 2000
```
3.配置Jedis配置文件
```java
package com.ecnu.wwl.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CachingConfigurerSupport;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

@Configuration //相当于一个XML文件，spring支持0xml
public class JedisConfig extends CachingConfigurerSupport {
    private Logger logger = LoggerFactory.getLogger(JedisConfig.class);

    //从配置文件中读取数据
    @Value("${spring.redis.host}")
    private String host;

    @Value("${spring.redis.port}")
    private int port;

    @Value("${spring.redis.timeout}")
    private int timeout;

    @Value("${spring.redis.password}")
    private String password;

    @Value("${spring.redis.jedis.pool.max-active}")
    private int maxActive;

    @Value("${spring.redis.jedis.pool.max-idle}")
    private int maxIdle;

    @Value("${spring.redis.jedis.pool.min-idle}")
    private int minIdle;




    @Bean //Spring IOC <bean id="jedisPool" class="...JedisPool">
    public JedisPool jedisPool(){
       //JedisPool的配置文件大家都是一样的，但是Jedis是连接redis的，大家的配置都不一样，所以需要自己写一个Jedis配置文件
        JedisPoolConfig jedisPoolConfig = new JedisPoolConfig(); 
        jedisPoolConfig.setMaxIdle(maxIdle);
        jedisPoolConfig.setMaxTotal(maxActive);
        jedisPoolConfig.setMinIdle(minIdle);
        JedisPool jedisPool = new JedisPool(jedisPoolConfig,host,port,timeout,password);

        logger.info("JedisPool注入成功！");
        logger.info("redis地址：" + host + ":" + port);
        return  jedisPool;
    }

}
```
4.在测试包里测试Jedis的连接
```java
package com.ecnu.wwl;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import redis.clients.jedis.JedisPool;

@SpringBootTest
class BootRedisApplicationTests {
    // 做Jedis测试
    @Autowired
    private JedisPool jedisPool;
    @Test
    void contextLoads() {
        System.out.println(jedisPool);
    }

}

```
5.可以在日志文件里看到JedisPool注入成功
```shell
2020-04-17 10:19:09.352  INFO 2986 --- [           main] com.ecnu.wwl.config.JedisConfig          : JedisPool注入成功！
2020-04-17 10:19:09.352  INFO 2986 --- [           main] com.ecnu.wwl.config.JedisConfig          : redis地址：127.0.0.9:6379
```

### Jedis操作String类型
1.先设计User的service接口（传入什么类型，返回什么类型）
```java
package com.ecnu.wwl;

public interface UserService {
    /*
    * Redis String 类型
    * 需求：用户输入一个key
    * 先判断Redis中是否存在该数据
    * 如果存在，在Redis中进行查询并返回
    * 如果不存在，在MySQL数据库查询，将结果赋给Redis并返回。（因为Redis的存在就是为了减轻数据库的压力）
    * Redis支持高并发，数据库不支持高并发
    * 所以将数据库中常用的数据查出来放到redis中就可以实现查询的高并发
    * */
    public String getString(String key);
}

```
2.创建接口的实现类
```java
package com.ecnu.wwl.service.impl;

import com.ecnu.wwl.service.UserService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

@Service
@Log //和 private Logger logger = LoggerFactory.getLogger(JedisConfig.class);代码作用一样，用来打印日志信息
public class UserServiceImpl implements UserService {
    /*
     * Redis String 类型
     * 需求：用户输入一个key
     * 先判断Redis中是否存在该数据
     * 如果存在，在Redis中进行查询并返回
     * 如果不存在，在MySQL数据库查询，将结果赋给Redis并返回
     */
    @Autowired
    private JedisPool jedisPool; //Jedid连接池

    @Override
    public String getString(String key) {
        String val = "";
        //1、通过jedisPool获得jedis连接信息,连接开启了
        Jedis jedis = jedisPool.getResource();
        //2、判断 key 是否存在: redis命令---exists key
        if (jedis.exists(key)) {
            log.info("查询Redis中的数据");
            val = jedis.get(key);
        }else{
            //3、如果不存在，在MySQL数据库查询
            val = "南京路"; //代表MySQL查出来的值是val
            log.info("查询的是MySQL数据库"+val);
            //将MySQL数据库中查出来的值赋给redis
            jedis.set(key,val);
        }
//        4、关闭数据库连接
        jedis.close();
        return val;

    }
}
```
3.在test中做测试
```java
    @Autowired
    private UserService userSerice;
    /*
    *模拟Jedis操作Redis String类型的数据
    * */
    @Test
    void t1(){
        String result = userService.getString("namekkk");
        System.out.println(result);
    }
```
4.每次对redis操作都要开启连接池，使用完成后要关闭连接池，虽然redis有什么命令，jedis就有什么方法，但是有时候我们的需求不是直接符合命令的，这时候就可以将这些常用的操作封装到工具类
- 工具类
```java
package com.ecnu.wwl.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

@Component //把普通的类通过注解的方式放入spring容器管理，需要的时候autowired一下就能给我这个类
public class JedisUtil {
    @Autowired
    private JedisPool jedisPool;
//    获得Jedis对象
    public Jedis getJedis(){
        return jedisPool.getResource();
    }
//    关闭Jedis连接
    public void closeJedis(Jedis jedis){
        if (jedis!=null)    jedis.close();
    }

    public long calTimeHour(int time) {
        return time*60*60;
    }
}

```
- 使用方式
```java
@Autowired
    private JedisUtil jedisUtil;
    public void expireStr(String key,String value){
        int time = 28;
        Jedis jedis = jedisUtil.getJedis();
        jedis.set(key, value);//默认永久有效
//        比方说设置 28小时过期 那么expire的参数是以秒为单位的，这样就可以在工具类里定义一个计算秒的函数。
        jedis.expire(key, (int) jedisUtil.calTimeHour(time));
        jedis.close();
    }
```

### Jedis操作Hash类型


## springBoot整合redis--lettuce
lettuce是RedisTemplate模版，是对Jedis等做了进一步的封装。jedis连接池的开始和关闭以及工具类都不用写了

1、依赖
```xml
<!--默认是lettuce客户端-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <!--redis依赖commons-pool 这个依赖一定要添加-->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-pool2</artifactId>
        </dependency>
```
2、配置文件
```yml
server:
  port: 8080
spring:
  redis:
    port: 6379
    password: 12345678
    host: 127.0.0.1
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
        max-wait: 1000
      shutdown-timeout: 100

```

3、Redis配置类（模板）
- jdbcTemplate--->对JDBC进行进一步封装
- redisTemplate--->对redis进行了进一步的封装（以前的redisTemplate封装的是jedis）
  - redisTemplate会自动读取配置文件里redis的配置信息不需要自己手动获取
```
编写缓存配置类RedisConfig用于调优缓存默认配置，RedisTemplate<String,Object>的类型兼容性更高
```
- 新建RedisConfig类
```java
package com.ecnu.wwl.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.cache.RedisCacheWriter;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.lang.reflect.Method;

@Configuration
public class RedisConfig extends CachingConfigurerSupport {

   /*
   * 自定义缓存key的生成策略，默认的生成策略是看不懂的（乱码）。
   * 通过Spring 的依赖注入特性进行自定义的配置注入并且此类是一个配置类可以更多程度的自定义配置
   * */
   @Bean
   @Override
   public KeyGenerator keyGenerator() {
       return new KeyGenerator() {
           @Override
           public Object generate(Object target, Method method, Object... params) {
               StringBuilder sb = new StringBuilder();
               sb.append(target.getClass().getName());
               for (Object obj : params){
                   sb.append(obj.toString());
               }
               return sb.toString();
           }
       };
   }

       /*
       * 缓存配置管理器
       * */
   @Bean
   public CacheManager cacheManager(LettuceConnectionFactory factory){
       //以锁写入的方式创建RedisCachewriter对象
       RedisCacheWriter writer = RedisCacheWriter.lockingRedisCacheWriter(factory);
       //创建默认缓存配置对象
       RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig();
       RedisCacheManager cacheManager = new RedisCacheManager(writer,config);
       return cacheManager;
   }


    //    上面这些都可以不要，只要template
    @Bean
    public RedisTemplate<String,Object> redisTemplate(LettuceConnectionFactory factory){
        RedisTemplate<String,Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
//        下面是配置key和value序列化的配置。
//        因为默认模版的序列化采用的是jdkSerial，存到数据库里会乱码
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);

        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
//        在使用注解@Bean返回RedisTemplate的时候，同时配置hashKey与hashValue的序列化方式。
//        key采用String的序列化方式
        template.setKeySerializer(stringRedisSerializer);
//        value采用jackson序列化方式
        template.setValueSerializer(jackson2JsonRedisSerializer);

//        hash的key也采用String
        template.setHashKeySerializer(stringRedisSerializer);
//        hash的value采用jackson
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }
}

```
4、RedisTemplate操作String类型
```java
redisTemplate.opsForValue().hasKey() // exists
redisTemplate.opsForValue().get(key) //get key
redisTemplate.opsForValue().set(key,val); // set key value
```

5、RedisTemplate操作Hash类型
```java
//        @Param h 就是用户实体 user，就是存的hash的key
//        @Param o 就是主键 id，就是hash的key
User u = new User();
redisTemplate.opsForHash().get("user",id);
    /*
    * @Param h 用户实体(hash) 是user存在数据库里的key就是user，是student存在数据库里的key就是student
    * @Param hk 用户主键（hash-key） id 是存在数据库的hash数据类型的key
    * @Param hv 整个对象 (hash-value) 是hash数据类型的value，是一个对象
    * */
redisTemplate.opsForHash().put("user",id,u);
```

6、优化redisTemplate
- 问题1:如果存的是hash类型的话对于不同的对象就要填入不同的字符串，像下面的情形就需要写很多重复的 key 的值
```java
redisTemplate.opsForHash().get("user",id);
redisTemplate.opsForHash().put("user",id,u);
```
解决方案1：声明一个工具类定义各种name
```java
public interface KeyNameUtil {
  String USER = "user";
  Stromg STUDENT = "student";
}
```
使用
```java
redisTemplate.opsForHash().get(KeyNameUtil.USER,id);
redisTemplate.opsForHash().put(KeyNameUtil.STUDENT,id,s);
```
解决方案2: 在实体bean声明里声明一个方法获取name
```java
public class User implements Serializable {
  public static String getKeyName(){ //static 关键字就是只会执行一次，不会重复执行，而且可以通过类名访问
    return "user";
  }
}
public class Student implements Serializable {
  public static String getKeyName(){
    return "student";
  }
}
```
使用
````java
redisTemplate.opsForHash().get(User.getKeyName(),id);
redisTemplate.opsForHash().put(Student.getKeyName(),id,s);
```
- 问题2:强制类型转换问题
- 问题3:redisTemplate.opsForHash(),每次都写这样一长串
答：因为redisTemplate.opsForXXX()返回类型都是ValueOperations<K,V>，通过注入操作类这个bean并指定范型来操作
```
//    ValueOperations<String, String> string = redisTemplate.opsForValue();
    @Resource(name = "redisTemplate") //跟 配置文件定义的 redisTemplate方法 名字一样，因为@Resource是按名字搜索装配的
    private ValueOperations<String, String> string;
```


