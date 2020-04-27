# Mybatis框架
三层架构：
- 表现层：用于展示数据
- 业务层：用于处理业务需求
- 持久层：和数据库交互

## 配置log4j.properties
```xml
log4j.rootLogger=debug, stdout, R

log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout

log4j.appender.stdout.layout.ConversionPattern=%5p - %m%n

log4j.appender.R=org.apache.log4j.RollingFileAppender
log4j.appender.R.File=firestorm.log

log4j.appender.R.MaxFileSize=100KB
log4j.appender.R.MaxBackupIndex=1

log4j.appender.R.layout=org.apache.log4j.PatternLayout
log4j.appender.R.layout.ConversionPattern=%p %t %c - %m%n

log4j.logger.com.codefutures=DEBUG
```

## 持久层技术解决方案
- JDBC技术：
  - Connection
  - PreparedStatement
  - ResultSet
- Spring的JdbcTemplate：
  - Spring中对jdbc技术的简单封装
- Apache的DBUtils：
  - 和Spring的JbdcTemplate很像，也是对jdbc的简单封装

但是以上这些都不是框架。其中：
- jdbc是规范
- Spring的JdbcTemplate和Apache的DBUtils都只是工具类

## MyBatis框架概述
- mybatis是一个基于java的持久层框架，它内部封装了jdbc，使开发者只需要关注sql语句本身，而不需要花费精力去加载驱动、创建连接、创建statement等繁杂的过程。
- mybatis通过xml或者注解的方式将要执行的各种statement配置起来，并通过java对象和statement中sql的动态参数进行映射生成最终执行的sql语句，最后由mybatis框架执行sql并将结果映射为java对象并返回。
- 采用ORM思想解决了实体和数据库映射的问题，对jdbc进行了封装。屏蔽了jdbc api底层访问细节，可使我们不用与jdbc api打交道就可以完成对数据库的持久化操作。

## MyBatis环境搭建
1. 创建maven工程并导入坐标（依赖）
2. 创建实体类（与数据库对应+get、set+tostring）和dao接口
3. 创建mybatis的主配置文件（SqlMapConfig.xml）
4. 创建映射配置文件（IUserMapper.xml）
注意：
1. mybatis的映射配置文件位置必须和dao接口的包结构相同（dao是com.wwl.mapper，mapper就是com.wwl.mapper,保持编译后dao接口及其mapper配置在一个目录下）
2. 映射配置文件的mapper标签 的namespace属性的取值必须是dao接口的全限定类名
3. 映射配置文件的操作配置（select），id属性的取值必须是dao接口的方法名
4. 映射配置文件的结果集（ResultType）指定实体类的全限定类名，表示查出来的结果封装到哪个类
5. 当遵从了以上三点时，我们在开发中就无需再写dao的实现类

## MyBatis的设计模式分析 
```java
//这是org.apache.ibatis.io.Resources封装的读取resource文件的类
        InputStream in = Resources.getResourceAsStream("SqlMapConfig.xml");
//    2、创建SqlSessionFactory工厂(它是一个接口，要用builder读取配置文件来创建)
        SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
        SqlSessionFactory factory = builder.build(in);
//    3、使用工厂生产SqlSession对象
        SqlSession session = factory.openSession();
//    4、使用SqlSession创建Dao接口的代理对象
        IUserMapper dao = session.getMapper(IUserMapper.class);
```
1. 生产SqlSessionFactory这个工厂的时候用了构建者模式，是用SqlSessionFactoryBuilder这个构建者来构建的。
   1. 优势：把对象的创建细节隐藏，使使用者直接调用方法即可拿到对象。
2. 工厂生产SqlSession用了工厂模式
   1. 优势：解耦
3. 使用SqlSession创建Dao接口实现类使用了代理模式
   1. 优势：不修改源码的基础上对已有方法增强模式

## 自定义Mybatis的分析
Mybatis在使用代理dao的方式实现crud操作时做了什么事情？
1. 创建代理对象
2. 在代理对象中调用selectList方法

### 配置文件分析
1、以下是连接数据库的信息，有了它们就能创建Connection对象
```xml
    <property name="driver" value="${driver}"/>
    <property name="url" value="${url}"/>
    <property name="username" value="${username}"/>
    <property name="password" value="${password}"/>
```
2、以下是映射配置信息
```xml
    <mappers>
<!--        XML的映射配置文件,配置文件在resource目录-->
        <mapper resource="com/wwl/mapper/IUserMapper.xml"/>
<!--        注解的映射配置文件-->
        <mapper class="com.wwl.mapper.IUserMapper"/>
    </mappers>
```
3、有了以下映射配置未见就有了执行的SQL语句，就可以获取PreparedStatement对象，此配置中还有封装的实体类全限定类名
```xml
<!--namespace写的是dao的全限定类名-->
<mapper namespace="com.wwl.mapper.IUserMapper">
<!--    配置查询所有操作，id和dao方法的名称对应-->
    <select id="findAll" resultType="com.wwl.pojo.User">
    select * from user
  </select>
</mapper>
```
4、读取以上的配置文件用到的技术就是解析XML的技术，此处用的是dom4j解析xml技术

### 解析配置文件selectList()的伪代码
selectList()方法
```java
1.根据配置文件的信息创建Connection对象
    注册驱动，获取连接
    Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/eesy","root","123456");
2.获取操作数据库的预处理对象PreparedStatement
    此时需要SQL语句
    PreparedStatement ps = conn.prepareStatemeng(sql);
3.执行查询，获取结果集
    ResultSet resultSet = ps.executeQuery();
4.遍历结果集用于封装
    List<E> list = new ArrayList();
    while(resultSet.next()){
        //可根据resultType中的全限定类名反射得到element对象
        E element = (E)ClassName.forName("全限定类名").newInstance(); 
        /* 此处使用反射进行封装，把每个rs的内容都添加到element中 
        思路：
        我们的实体类属性和表中的列名是一致的。
        于是我们就可以把表的列名看成是实体类的属性名称
        就可以使用反射的方式来根据名称获取每个属性，并把值赋进去 
        */


        // 把element添加到list中
        list.add(element);
    }
5.返回list
    return list；
```

### 映射对象分析
以下是映射信息,它包含了两个部分：
1. 执行的sql语句
2. 封装结果的实体类全限定类名

```xml
<!--namespace写的是dao的全限定类名-->
<mapper namespace="com.wwl.mapper.IUserMapper">
<!--    配置查询所有操作，id和dao方法的名称对应-->
    <select id="findAll" resultType="com.wwl.pojo.User">
    select * from user
  </select>
</mapp
```

3. 把这两个信息组合起来定义成一个Mapper对象
4. 并可以使用唯一标志来查找

|  String(namespace+id)   | Mapper对象(sql+全限定类名)  |
|  ----  | ----  |
| com.wwl.mapper.IUserMapper  | String domainClassPath |
| findAll   | String sql |

### 创建代理对象分析 
```java
//    4、使用SqlSession创建Dao接口的代理对象
    IUserMap dao = session.getMapper(IUserMapper.class);//我们的dao接口是没有实现的，mybatis创建了dao的代理对象
```
伪代码：
```java
// 根据dao接口的字节码创建dao的代理对象
public <T> T getMapper(Class<T> daoInterfaceClass){
    /*
    类加载器：他使用的和被代理对象是相同的类加载器
    代理对象要实现的接口：和被代理对象实现同样的接口
    如何代理：他就是增强的方法，需要我们自己提供
            此处是一个InvocationHandler的接口，我们需要写一个该接口的实现类
            在实现类中调用selectList方法。
    */
    Proxy.newProxyInstance(类加载器，代理对象要实现的接口字节码数组，如何代理);
}

```

## MyBatis参数深入
### 传递简单类型
### 传递pojo对象
#{}：代表占位符 /？/

${}：代表连接字符串，没有问号
- mybatis使用OGNL表达式解析对象字段的值，#{}或者${}括号中的值为pojo属性名称
- OGNL(Object Graphic Navigation Language:对象图导航语言)：它是通过对象的取值方法GetParameter来获取数据。在写法上将get省略
- 比如获取用户的名称：
  - 类中的取值写法：user.getUsername
  - OGNL写法：user.username
- Mybatis为什么能直接写#{username}或者${username}
  - 因为在ParameterType中已经指定了类名，所以此时不需要写对象名


## 解决实体类属性名和数据库列名不对应的方式
如果属性名和列名不对应，那么有些操作比如过select * from users，因为不对应，查出来的结果就封装不成为一个User实体类了。

解决思路：
1.使用<resultMap>配置查询结果的列名和实体类的属性名的对应关系

```xml
<!--    配置查询结果的列名和实体类的属性名的对应关系,Type:对应的实体类-->
    <resultMap id="userMap" type="com.wwl.pojo.User">
<!--        配置主键的对应-->
        <id property="userId" column="id"></id>
        <result property="userName" column="username"></result>
        <result property="userAddress" column="address"></result>
        <result property="userSex" column="sex"></result>
        <result property="userBirthday" column="birthday"></result>
    </resultMap>
```
2. 将返回类型由resultType改为resultMap
```xml
前：
  <select id="findAll" resultType="com.wwl.pojo.User">
        select * from user
  </select>
后：将返回结果与之前配置的对应关系resultMap相匹配再封装为resultMap里的type类型
 <select id="findAll" resultMap="userMap"> 
        select * from user
  </select>
``