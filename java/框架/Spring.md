# Spring
SpringIOC只能降低（不是解决）程序间的依赖关系，其他什么事情都干不了
## Spring核心容器
核心容器(Core Container)
- Beans
- Core
- Context
- SpEL

## Spring注解
## Spring依赖注入
- 依赖注入（Dependency Inject）
- 依赖关系的管理（以后都交给Spring）
- 在当前类需要用到其他类的对象，由Spring为我们提供，我们只需要在配置文件里说明
- 依赖关系的维护就称之为依赖注入
依赖注入：
- 能注入的数据有三类
  - 基本类型和Sting
  - 其他bean类型（在配置文件中或者注解配置过的bean）
  - 复杂类型 / 集合类型
- 注入的方式有三种
  1. 构造函数
  2. set方法
  3. 使用注解提供

### 使用XML配置文件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
<!--把对象的创建交给-spring来管理-->
<!--    默认使用无参数的构造函数，如果定义了有参数的构造函数就会报错-->
<!--    <bean id="accountService" class="com.ecnu.wwl.service.impl.AccountServiceImpl"></bean>-->
<!--    <bean id="accountDao" class="com.ecnu.wwl.dao.impl.AccountDaoImpl"></bean>-->

<!--构造函数注入：
    标签<constructor-arg></constructor-arg>
    标签中的属性
        type:用于指定要注入的数据的数据类型，该数据类型也是构造函数中某个或某些参数的类型，但是构造函数中有两个或以上一样的属性就不能通过type来指定了
        index:用于指定要注入的数据给构造函数中指定位置的参数赋值，从0开始
        name:用于指定给构造函数中指定名称的参数赋值（常用 ）
        ===============以上用于指定给构造函数中哪个参数赋值===========================
        value:用于提供基本类型和String类型的数据
        ref:用于指定其他的bean类型数据，它指的就是在sping的IOC核心容器中出现过的bean对象。只要在xml文件或者用注解配置过都可以用ref引用

       优势：在获取bean对象中，注入数据是必须的操作，否则对象无法创建成功(用构造函数创建对象少提供一个参数都创建不了对象)
       弊端：改变了bean对象的实例化方式，是我们在创建对象时，如果用不到这些数据也必须提供
-->
    <bean id="accountService" class="com.ecnu.wlw.service.impl.AccountServiceImpl">
<!--        <constructor-arg type="java.lang.String" value="String"></constructor-arg> 构造函数中有两个String类型就不好找了-->
        <constructor-arg name="name" value="test"></constructor-arg>
        <constructor-arg name="ageee" value="18"></constructor-arg>
<!--        brithday是Date类型的，要用ref引用关联的bean对象-->
        <constructor-arg name="birthday" ref="now"></constructor-arg>
    </bean>
    <bean id="now" class="java.util.Date"></bean>

<!--    使用set方法注入（常用）
        涉及的标签：property
        标签中的属性：
            name:用于指定注入时所调用的set方法名称(setName就是name，setUserName就是userName)
            value:用于提供基本类型和String类型的数据
            ref:用于指定其他的bean类型数据，它指的就是在sping的IOC核心容器中出现过的bean对象。只要在xml文件或者用注解配置过都可以用ref引用
        优势：
            创建对象时没有明确的限制，可以直接使用默认的无参构造函数
        弊端：
            如果有某个成员必须有值，则获取的对象是有可能set方法没有执行(创建对象时先调用构造函数初始化一个对象，
            再调用set方法给参数赋值，多线程下set方法可能被打断导致获取的对象不完整)
-->
    <bean id="accountService2" class="com.ecnu.wlw.service.impl.AccountServiceImpl2">
        <property name="userName" value="TEST"></property>
        <property name="age" value="20"></property>
        <property name="birthday" ref="now"></property>
    </bean>

<!--    复杂类型/集合类型的注入
    用于给List结构集合注入的标签：
        list array ser
    用于给map结构集合注入的标签：
        map props
    结构相同，标签可以互换
-->
    <bean id="accountService3" class="com.ecnu.wlw.service.impl.AccountServiceImpl3">
        <property name="myStrs">
            <array>
                <value>AAA</value>
                <value>BBB</value>
                <value>CCC</value>
                <value>"DDD"</value>
            </array>
        </property>
        <property name="myList">
            <list>
                <value>AAA</value>
                <value>BBB</value>
                <value>CCC</value>
                <value>"DDD"</value>
            </list>
        </property>
        <property name="mySet">
            <set>
                <value>AAA</value>
                <value>BBB</value>
                <value>CCC</value>
                <value>"DDD"</value>
            </set>
        </property>
        <property name="myMap">
            <map>
                <entry key="test1" value="value1"></entry>
                <entry key="test2" value="value2"></entry>
                <entry key="test3" value="value3"></entry>
                <entry key="test4" value="value4"></entry>
            </map>
        </property>
        <property name="myProps">
            <props>
                <prop key="k1">kk1</prop>
                <prop key="k2">kk2</prop>
                <prop key="k3">kk3</prop>
                <prop key="k4">kk4</prop>
            </props>
        </property>
    </bean>


</beans>
```

### 使用注解
1、使用注解创建的bean需要在xml文件中配置目录spring才会取扫描
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd">

<!--    先在xmlns和xsi引入context名称空间和约束-->
<!--    用于扫描这个包及其子包所有类或接口上的注解-->
    <context:component-scan base-package="com.ecnu.wlw"></context:component-scan>
</beans>
```
2、使用注解
```xml
曾经XML的配置
<bean id="userService" class="com.ecnu.wwl.service.impl.UserServiceImpl"
      scope="" init-method="" destroy-method="" >
  <property name="" value=""></property>
</bean>
```
```
注解的分类：
1、用于创建对象的注解
    作用与XML配置文件中方编写一个<bean>标 中
    @Component：
        作用：用于把当前类对象存入spring容器中
        属性：
            value：用于指定bean的id。不写时默认值是首字母小写的类名
##################以下三个注解的作用和属性与@Component是一模一样的，只是为了使我们三层的对象更加清晰################
    @Controller：一般用在表现层
    @Service：一般用在业务层
    @Repository：一般用在持久层

 2、用于注入数据的注解
    作用就和在XML中的<bean>标签中写一个<property>标签的作用是一样的，用来设值的
    @AutoWired（先byType匹配，再byName匹配）
        作用：自动按照类型注入。只要容器中有唯一的一个bean对象和要注入的变量类型匹配就可以成功注入
             - 如果只有一个匹配就可以自动注入成功
             - 如果IOC容器有多个类型匹配，则再按照名字去匹配，如果匹配成功就注入成功
             - 如果没有匹配的就报错
        出现的位置：可以是变量也可以是方法
         细节：在使用注解注入时set方法不是必须的。
     @Resouce(byName)
         作用：直接按照bean的id注入
         属性：
            name：用于指定bean的id
##########以上的注入都只能注入bean类型的数据，而基本类型和String类型无法使用上述注解实现，集合类型的注入只能通过XML实现##########
    @Value
        作用：用于注入基本类型和String类型的数据
        属性：
            value：用于指定数据的值。他也可以使用spring中SpEL(Spring的el表达式--通过${key}取出配置文件的value)
                spEL写法：${表达式}
                    @Value("${spring.redis.host}") //常见
                    private String host;
3、用于改变作用范围的注解
    作用和在<bean>标签中使用scope属性实现的功能是一样的
    @Scope
        作用：用于指定bean的作用范围
        属性：value：指定范围的取值。常用取值：singleton(默认) prototype
4、和生命周期相关的注解（了解）
    作用就和在<bean>标签中使用init-method和destroy-method的作用是一样的
    @PreDestroy
        作用：用于指定销毁方法
    @PostConstruct
        作用：用于指定初始化方法

```

### 使用容器对象获取bean
- SpringIOC容器就是一个Map集合，里面存了bean的id(key)和数据类型(value)
- 使用注解的方式注入依赖的时候不需要写依赖的set方法
- @AutoWired：按照类型自动注入（Spring会去IOC容器里找是不是只有一个UserDao类型的bean）
  - 如果只有一个匹配就可以自动注入成功
  - 如果IOC容器有多个类型匹配，则再按照名字去匹配，如果匹配成功就注入成功
  - 如果没有匹配的就报错
- @Resource：按照name自动注入 ()
|id|type|
|-|-|
|userService|com.ecnu.wwl.impl.UserService|
|userDao|com.ecnu.wwl.impl.UserDao
```java
    void diAnnotation(){
//        spring核心容器默认会到XML配置文件里去找定义的bean，如果bean是使用注解定义的，
//        则在xml配置文件里找不到这个bean的id就会报错
//        此时需要在xml配置文件里配置---context名称空间和约束
//        告知spring在创建容器时要扫描的包及其子包，并扫描所有类或接口上的注解放入spring容器管理

//      获取核心容器对象
        ApplicationContext ac = new ClassPathXmlApplicationContext("bean1.xml");
//        根据id获取bean对象
        IUserService us = (IUserService) ac.getBean("userService");
        System.out.println(us);

        IUserDao ud = (IUserDao) ac.getBean("userDao");
        ud.saveUser();
    }
```

## Bean的配置和注入
```
SpringBoot：
配置bean 用@component; @service; @Mapper; @controller; 自动扫描装配。
注入的时候用注解@Autowaried; @Resourse.
```
```
Spring：
```

- Bean配置： Bean 配置是通过XML配置或注解的方法把Bean的信息注册到IOC容器中。（有两大种方式：（1）通过注解@component; @service; @Mapper; @controller; 等。（2）在xml中配置<bean id="' class="">）
 

- Bean引入： Bean注入是在某个类中要用到别的Bean时要把把他引入进来。（比如说你在service 层中肯定要用到Dao层的类。有以下几种方式：（1）注解的方式@Autowaried, （2）或者属性注入{提供这个属性的get set}、（3）再者构造方法注入{实现个带参数的构造方法}）

### 实例
mybatis的配置文件：
```xml
    <bean id="dataSource"
		class="org.springframework.jdbc.datasource.DriverManagerDataSource">
		<property name="driverClassName" value="com.mysql.jdbc.Driver" />
		<property name="url" value="jdbc:mysql://localhost:3306/niit" />
		<property name="username" value="root" />
		<property name="password" value="why123me." /> 
	</bean>

<!-- 注册bean -->
	<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
		<property name="dataSource" ref="dataSource" />
		<property name="mapperLocations" value="classpath:com/qdu/mapping/*.xml" />
	</bean>
<!-- 注入bean -->
    @Autowired
    private SqlSessionFactory sqlSessionFactory;

	<bean id="txManager"
		class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
		<property name="dataSource" ref="dataSource" />
	</bean>
```


## @Autowired 和 @Resource
@Autowired

由Spring提供，只按照byType注入

2、@Resource

由J2EE提供，默认按照byName自动注入
## Spring定义Bean的两种方式<bean/>和@Bean
### 通过XML来生成一个bean
1、创建entity命名为Student
```java

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Student implements Serializable {
 
    private static final long serialVersionUID = -2088281526481179972L;
    private int id;
    private String name;
    private int age;
}
```
2、在beans.xml中定义Student
```xml
<!-- 可以通过属性来赋值<property>，也可以通过构造参数来赋值<constructor> -->
<!-- bean 没有name标签时通过id来获取bean，如果指定了name就需要用name来获取bean -->
<beans>
     <!-- 1.空值的student -->
    <bean id="studentNoValue" class="domain.Student"/>
 
    <!-- 2.带值的student(使用setter) -->
    <bean id="student" class="domain.Student">
        <property name="id" value="11"/>
        <property name="age" value="22"/>
        <property name="name" value="jack"/>
    </bean>
 
    <!-- 3.全参构造：使用成员变量名称对应 -->
    <bean id="studentConstruct" class="domain.Student">
        <constructor-arg name="age" value="22"></constructor-arg>
        <constructor-arg name="id" value="11"></constructor-arg>
        <constructor-arg name="name" value="jack"></constructor-arg>
    </bean>
 
    <!-- 4.全参构造：使用成员变量index对应 -->
    <bean id="studentConstruct2" class="domain.Student">
        <constructor-arg index="0" value="11"></constructor-arg>
        <constructor-arg index="1" value="jack"></constructor-arg>
        <constructor-arg index="2" value="22"></constructor-arg>
    </bean>
 
    <!-- 5.全参构造：使用成员变量类型对应 -->
    <bean id="studentConstruct3" class="domain.Student">
        <constructor-arg type="int" value="11"></constructor-arg>
        <constructor-arg type="java.lang.String" value="jack"></constructor-arg>
        <constructor-arg type="int" value="22"></constructor-arg>
    </bean>
</beans>
```
3、测试bean
```java

public class ApplicationContextTest {
 
    @Test
    public void testXml(){
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("beans.xml");
        Student studentNoValue = (Student) applicationContext.getBean("studentNoValue");
        // 无参数时也可以通过传入class来获取bean
        Student studentNoValue2 = (Student) applicationContext.getBean(Student.class);

        Student studentFullValue = (Student) applicationContext.getBean("studentFullValue");
        System.out.println(studentNoValue);
        System.out.println(studentFullValue);
 
 
        Student studentConstruct1 = (Student) applicationContext.getBean("studentConstruct");
        Student studentConstruct2 = (Student) applicationContext.getBean("studentConstruct2");
        Student studentConstruct3 = (Student) applicationContext.getBean("studentConstruct3");
        System.out.println(studentConstruct1);
        System.out.println(studentConstruct2);
        System.out.println(studentConstruct3);
 
        Book bookChinese = (Book) applicationContext.getBean("bookChinese");
        System.out.println(bookChinese);
    }
}
// res:
Student(id=0, name=null, age=0)
Student(id=11, name=jack, age=22)
Student(id=11, name=jack, age=22)
Student(id=11, name=jack, age=22)
Student(id=11, name=jack, age=22)
```
### 使用JavaConfig类定义bean
JavaConfig是Spring4.x推荐的配置方式，可以完全代替XML的方式定义
1、定义bean
```java
// 创建一个类，命名为SpringConfiguration
@Configuration
public class SpringConfiguration {
    //定义Student bean
    @Bean
    public Student student(){
        return new Student(11,"jack",22);
    }
}
 
// 使用bean
AnnotationConfigApplicationContext applicationContext
                = new AnnotationConfigApplicationContext(SpringConfiguration.class);
Student student = (Student) applicationContext.getBean("student")//传入的参数就是定义Bean的方法的方法名
System.out.println(student);
 
// res:
Student(id=11, name=jack, age=22)
```
```
 相对于XML的使用方式而言，JavaConfig的使用方式基本是同步的

    * @Configuration等同于<beans></beans>

    * @Bean等同于<bean></bean>

    * 通过AnnotationConfigApplicationContext来加载JavaConfig

    * 方法名student()就等同于<bean>中的id，默认方法名就是beanName
```
## @Configuration
@Configuration 注释的类 类似于于一个 xml 配置文件的存在
## @Bean 基础声明(用于方法)

Spring的@Bean注解用于告诉方法，产生一个Bean对象，然后这个Bean对象交给Spring管理。产生这个Bean对象的方法Spring只会调用一次，随后这个Spring将会将这个Bean对象放在自己的IOC容器中。

SpringIOC 容器管理一个或者多个bean，这些bean都需要在@Configuration注解下进行创建，在一个方法上使用@Bean注解就表明这个方法需要交给Spring进行管理。

# Lombok注解
## @Log/@Slf4j
```
在方法里就可以调用默认名称 `log` 来打印日志内容
@Log 创建 private static final java.util.logging.Logger log = java.util.logging.Logger.getLogger(LogExample.class.getName());
```

## @Data
```
@Data 注解(属于lombok)的主要作用是提高代码的简洁，使用这个注解可以省去代码中大量的get()、 set()、 toString()等方法；
@AllArgsConstructor//提供全参数的构造函数
@NoArgsConstructor//提供无参数的构造函数
```

## @RestController(@ResponseBody+Controller)
```java
//这个类的所有方法返回的数据直接写成给浏览器的response对象，（如果返回的是对象转为json数据）
// @ResponseBody
// @Controller
@RestController
public class HelloController {

    @RequestMapping("/hello")
    public String Hello() {
        return "HelloWorld";
    }
}

```