# Java基础
## 8种基本类型占用字节数

| 数据类型 | 大小                    |
| -------- | ----------------------- |
| Boolean  | true/false(default) 1位 |
| byte     | 1字节                   |
| char     | 2字节                   |
| short    | 2字节                   |
| int      | 4字节                   |
| long     | 8字节                   |
| float    | **4字节**               |
| double   | 16字节                  |

## 装箱和拆箱：有了基本数据类型为什么还要包装类型

每一个基本数据类型都对应一个包装类型。

**装箱：把基本数据类型转换成包装类型。**

```java
Integer.valueOf(int i/String i)	----->	Integer
Integer i = 1;//自动装箱 在编译的时候会调用Integer.valueOf()来装箱
Integer j = Integer.valueOf(1);//手动装箱
```

 **拆箱：把包装类型转换为基本数据类型**

```java
Integer i = 1;
int j = i;//自动拆箱 在编译的时候会调用inVal()来拆箱;
int k = i.intValue();//手动拆箱
```

原因：Java是一个面向对象的语言，而基本的数据类型是关键字不是对象，不具备面向对象的特性。

## Java中的集合

集合分为存value和key-value，也就是(Collection Map)两种

存值的Collection：List、Set



```java
public interface List<E> extends Collection<E> {}
public interface Set<E> extends Collection<E> {}
public interface Map<K,V> {}
```



存键值对的Map：HashMap、HashTable、ConcurrentHashTable

### Map

- HashMap 无序
- LinkedHashMap 无序 ，迭代时是有序的
  - LinkedHashMap实现与HashMap的不同之处在于，后者维护着一个运行于所有条目的**双重链接列表**。此**链接列表定义了迭代顺序**，该迭代顺序可以是插入顺序或者是访问顺序
- TreeMap：TreeMap使用的存储结构为红黑树。所以是有序的（大小顺序）。

#### Map的遍历方法

```java
//第一种，使用entrySet的迭代器
Iterator<Map.Entry<Integer, Integer>> iterator = map.entrySet().iterator();
while (iterator.hasNext()){
    Map.Entry<Integer,Integer> entry = iterator.next();
    System.out.println(entry.getKey()+" "+entry.getValue());
}
//第二种，使用keySet的forEach
for(int j : map.keySet()){
    System.out.println(j+"value: "+map.get(j));
}
//第三种，forEach遍历entrySet
for(Map.Entry<Integer,Integer> e :map.entrySet()){
    System.out.println(e.getKey()+"  "+e.getValue());
}
```

### Set

- HashSet 无序
- LinkedHashSet 底层是LinkedHashMap所以迭代时是有序的
- TreeSet：有序，大小顺序

**Set为什么不重复：**因为HashSet的底层是由HashMap实现的，而HashSet的add方法，是将元素作为map的key进行存储的，map的key是不会重复的，所以HashSet中的元素也不会重复。一个对象要存在Set中，必须重写equals（Key是不是重复了）和hashcode(在entry数组的哪个地方存)方法。

在HashSet中，**元素都存到HashMap键值对的Key上面，而Value时有一个统一的值`private static final Object PRESENT = new Object();`**，(定义一个虚拟的Object对象作为HashMap的value，将此对象定义为static final。)



## 内部类

内部类可以分为四种：

### **成员内部类(非静态)**：

- 可以无限制的访问外围类的所有成员属性和方法，尽管是private的，但是外围类要访问内部类的成员属性和方法则需要通过内部类实例来访问。
- 成员内部类中不能存在任何static的变量和方法
- 成员内部类是依附于外围类的，所以只有先创建了外围类才能够创建内部类。new Main().new Inner();

### **局部内部类(方法中)**

局部内部类是定义在一个方法或作用域中的类，它的访问权限仅限于方法内或作用域内。

### **匿名内部类**

匿名内部类是没有构造器的类，大部分用于继承其他类或实现接口，并不需要增加额外的方法，只是对继承方法的实现或是重写

```java
new 类名或接口名(){
    重写方法;
}；     //注意分号
//以上就是内部类的格式，其实这整体就相当于是new出来的一个对象
```

#### Lambda表达式

Lambda 表达式是 JDK8 的一个新特性，可以**取代大部分的匿名内部类**，写出更优雅的 Java 代码，尤其在集合的遍历和其他集合操作中，可以极大地优化代码结构。

语法形式为 () -> {}，其中 () 用来描述参数列表，{} 用来描述方法体，-> 为 lambda运算符 ，读作(goes to)。

```java
new Thread(new Runnable() {
    @Override
    public void run() {
	System.out.println("匿名内部类");
    }
}).start();

new Thread(()->{
    System.out.println("Lambda");
}).start();
```



### **静态内部类**

静态内部类也是定义在另一个类里面的类，只不过在类前加上了static。静态内部类是不需要依赖于外部类的，与静态成员变量类似。

#### 局部内部类和匿名内部类访问局部变量的时候，为什么变量必须要加上final？

因为**局部变量和匿名内部类的生命周期不同**。 匿名内部类是创建后是存储在堆中的，而方法中的局部变量是存储在Java栈中，当方法执行完毕后，就进行退栈，同时局部变量也会消失。那么此时匿名内部类还有可能在堆中存储着，那么匿名内部类要到哪里去找这个局部变量呢？ 为了解决这个问题编译器为自动地帮我们在匿名内部类中创建了一个局部变量的备份，也就是说即使方法执结束，匿名内部类中还有一个备份，自然就不怕找不到了。 但是问题又来了。如果局部变量中的a不停的在变化。那么岂不是也要让备份的a变量无时无刻的变化。为了保持局部变量与匿名内部类中备份域保持一致。编译器不得不规定死这些局部域必须是常量，一旦赋值不能再发生变化了。所以为什么匿名内部类应用外部方法的域必须是常量域的原因所在了。 特别注意：在Java8中已经去掉要对final的修饰限制，但其实只要在匿名内部类使用了，该变量还是会自动变为final类型（只能使用，不能赋值）

## JDK 中常用的包有哪些

java.lang：这个是系统的基础类；
java.io：这里面是所有输入输出有关的类，比如文件操作等；
java.nio：为了完善 io 包中的功能，提高 io 包中性能而写的一个新包；
java.net：这里面是与网络有关的类；
java.util：这个是系统辅助类，特别是集合类；
java.sql：这个是数据库操作的类。

## 实现一个拷贝文件的工具类使用字节流还是字符流

字节流。因为要拷贝的文件不会是只含有字节的。也有可能里面含有图片、声音、图像等。为了考虑到通用性，要使用字节流。

## 线程的几种实现方式,怎么启动，怎么区分

- 继承Thread类
- 实现Runnable接口，重写run方法
- 实现Callable接口，重写call方法

### 怎么启动

启动线程使用start方法，而启动了以后执行的是run方法。

```java
Thread thread = new Thread(继承了 Thread 的对象/实现了 Runnable 的对象)
thread.start();
```
```java
//继承的Thread类的启动方式，要重写Thread的run方法在调用run方法
public class Junit extends Thread {
    @Override
    public void run() {
        super.run();
        System.out.println("我被执行了");
    }

    @Test
    public void test () {
      Thread thread = new Thread(new Junit());
       thread.start();
}
}
```
  ```java
//实现的 Runnable接口的启动方式
public class Junit implements Runnable {
    @Override
    public void run() {
        System.out.println("我被执行了");
    }

    @Test
    public void test () {
        Thread thread = new Thread(new Junit());
        thread.start();
    }
}
  ```

### 怎么区分

在创建线程完成后都需要设置名称》》》这是一种规范

在一个系统中有很多线程，每个线程都会打印日志，我想区分是哪个线程打印的怎么办？

给thread设置一个线程名字 `thread.setName("线程名称");`

## Java中怎么创建线程池（线程并发库）

java.util.current包中提供了对线程优化、管理的各项操作。该包提供了线程了运行，线程池的创建，线程生命周期的控制。

Java通过 **Executors**提供的四个静态方法创建线程池，分别为：【阿里开发手册规定不允许使用这几种方法】

```java
//创建一个可缓存线程池，如果线程池长度超过处理需要，可灵活回收空闲线程，若无可回收，则新建线程
ExecutorService executorService1 = Executors.newFixedThreadPool(60);
//创建一个定长线程池，可控制线程最大并发数，超出的线程会在队列中等待
ExecutorService executorService2 = Executors.newCachedThreadPool();
//创建一个定长线程池，支持定时及周期性任务执行
ExecutorService executorService3 = Executors.newScheduledThreadPool(20);
//创建一个单线程化的线程池，它只会用唯一的工作线程来执行任务，保证所有的任务按照指定顺序(FIFO,LIFO,优先级)执行
ExecutorService executorService4 = Executors.newSingleThreadExecutor();
```

### 线程池的作用

1. **限定线程的个数**（不能是可缓存线程池，对于限制个数 没多大用处），不会导致由于线程过多导致系统运行缓慢或崩溃
2. 线程池不需要每次都去创建或销毁，一开始创建好了以后维持一个线程池**重用里面的线程**就好，**节约了资源**
3. 线程池不需要每次都去创建，**响应时间更快**

## 常用设计模式

### 单例模式【singleton】

确保一个类只有一个实例。**使用一个私有构造函数、一个私有静态变量以及一个公有静态函数来实现**。

**私有构造函数保证了不能通过构造函数来创建对象实例，只能通过公有静态函数返回唯一的私有静态变量**。

- 懒汉/饱汉模式：（不饿就不着急创建实例。延迟加载LazyLoading）,在用到该类的时候才实例化。线程不安全

- 饥汉/饿汉模式：类加载的收就实例化（马上就创建实例。所以叫饥汉）【无LazyLoading】

### 工厂模式

- SpringIOC
- 对象的创建交给一个工厂去创建

## 代理模式

- Spring AOP就是使用的动态代理模式

### 装饰器/包装模式【Decorator】

## Servelet

Servlet全称Java Servlet，**是用Java编写的服务器端程序**。servelt是指任何实现了这个Servlet接口的类。Servlet运行于支持Java的应用服务器中。

HttpServlet 重写了doGet和doPost方法完成对get和post的响应。

### Servlet的生命周期

加载和实例化、初始化、处理请求以及服务结束。init()，service()，destroy()

加载Servlet的class-->实例化Servlet---》调用Servlet的init完成初始化---》响应请求(service方法)--》Servlet容器关闭(destroy)

### JSP和Servlet的相同点和不同点

相同：Jsp技术是Servlet技术的扩展，所有的jsp文件都会被翻译为一个继承HttpServlet的类，也就是说**jsp最终也是一个Servelet**。这个Servlet对外提供服务 

不同：Servlet的应用逻辑是在java文件中，并且完全从表现层中的HTML里分离开来。而JSP的情况是Java和HTML可以组合成一个扩展名为.jsp的文件。**JSP侧重于视图，Servlet主要用于控制逻辑。**

## MVC各部分都有哪些技术

Model：模型 就是普通的javabean 

View: 视图  html、jsp等

Controller：控制器 Servlet 

**最经典的MVC模式：jsp+Servlet+javabean**

**工作模式：**

- 当控制器接收到来自用户的请求
- 控制器调用JavaBean完成业务
- 完成业务后通过控制器跳转jsp页面的方式给用户反馈信息
- jsp给用户做出相应

使用了struts2和springMVC这样的mvc框架后，jsp+核心控制器+action+javabean

## **SpringMVC框架运行原理**

**MVC框架是为了解决传统MVC模式（jsp+Servlet+JavaBean）的问题而出现的框架**

常用的MVC框架：SpringMVC+Struts2

SpringMVC运行原理

1. 客户端请求提交到DispatcherServlet

2. 由DispatcherServlet控制器查询一个或多个HandlerMapping，找到处理请求的Controller

3. DispatcherServlet将请求提交到Controller

4. Controller调用业务逻辑处理后，返回ModelAndView

5. DispatcherServlet查询一个或多个ViewResoler视图解析器，找到ModelAndView指定的视图

6. 视图负责将结果显示到客户端

## SpringAOP

AOP：面向切面的变成

核心原理：使用**动态代理**的设计模型方式在执行前后或出现异常后加入相关逻辑

主要用AOP来做：

- 事务处理：执行方法前开启事务，执行方法后关闭事务，出现异常后回滚事务
- 权限判断：在执行方法前判断是否有权限
- 日志：执行方法前进行日志处理
- ……

## 对象关系映射ORM框架

 为了解决面向对象与关系型数据库存在的互补匹配的现象的技术。

ORM提供了实现持久化层的另一种模式。

Hibernate和Mybatis

## SSM框架(Spring+SpringMVC+Mybatis)

**Spring**负责管理javaBean

**SpringMVC**
　　SpringMVC在项目中拦截用户请求，它的核心**Servlet**即DispatcherServlet承担中介或是前台这样的职责，将用户请求通过HandlerMapping去匹配Controller，Controller就是具体对应请求所执行的操作。SpringMVC相当于SSH框架中struts。

**mybatis**
　　mybatis是对jdbc的封装，它让数据库底层操作变的透明。mybatis的操作都是围绕一个sqlSessionFactory实例展开的。mybatis通过配置文件关联到各实体类的Mapper文件，Mapper文件中配置了每个类对数据库所需进行的sql语句映射。在每次与数据库交互时，通过sqlSessionFactory拿到一个sqlSession，再执行sql命令。

## 事务的四大特征ACID

谈  到事务一般都是以下四点
**原子性（Atomicity）**

- 原子性是指事务是一个**不可分割**的工作单位，事务中的操作要么都发生，要么都不发生。

**一致性（Consistency）**

- 事务前后数据的完整性必须保持一致。要是后面的失败了要对前面的操作进行**回滚**。一个事务在执行之前和执行之后，**数据库都必须处于一致性状态。**

**隔离性（Isolation）**

- 事务的隔离性是多个用户并发访问数据库时，数据库为每一个用户开启的事务，**不能被其他事务的操作数据所干扰**，多个并发事务之间要相互隔离。

**持久性（Durability）**

- 持久性是指一个事**务一旦被提交，它对数据库中数据的改变就是永久性的，**接下来即使数据库发生故障也不应该对其有任何影响

## MySQL数据库的默认最大连接数

100

## 数据库连接池的作用(与线程池作用一样)

1. 限定数据库连接的个数 ，不会导致由于数据库连接过多导致数据库运行缓慢或崩溃
2. 数据库连接不需要每次都去创建或销毁，节约资源+速度快

## 1 JDK和JRE的区别

- JRE：java运行环境，负责运行java程序
- JDK：java开发工具，要完整运行一个java程序需要先编译再运行
    - jre
    - javac（编译）
    - javap（反编译）
    - javadoc

## 2 ==与equals的区别
1. ==对于基本类型判断值是否相等，对于引用类型判断引用的地址是否相同（引用的对象是否是同一个）
2. equals是Object的一个方法,如果没有重写比较的还是两个是否是双等号，即引用对象的地址是否是同一个 ==
    - 常见的封装类是重写的这个方法的，是比较值的。
    - 所以只要值相等就return true
```java
public boolean equals(Object obj) {
    return (this == obj)
}
```

## 3 HashCode与Equals相同吗
在集合查找时，hashcode能大大降低对象比较次数，提高查找效率
```
哈希表
[0] [1] [2] [3] [4] [5] [6]...
每个对象都有一个hashcode
    比如 int a，a的哈希码为1，那Java在找a这个值的时候只要从哈希码为1的集合里找就可以了。
```
Java对象的eqauls方法和hashCode方法是这样规定的：
1. 相等（相同）的对象必须具有相等的哈希码（或者散列码）。
2. 如果两个对象的hashCode相同，它们并不一定相同。

## 4 Final有什么作用
fanal关键字可以作用的地方：
- 类：不能够被继承
- 方法：不能被重写（父类定义final方法，子类不能重写）
- 变量：
    - 基本类型不能重新赋值
    - 引用类型指针指向的位置不能发生改变，但是引用对象的属性值是可以改变的

## 5 操作字符串的类之间的区别
String、StringBuilder、StringBuffer都是java.lang包里的，都是final修饰的。

- String：不可变，变了就是把指针指向另一个地方
  - String底层用了一个不可变的字符数组 `private final char value[];`
- StringBuilder：可变，不加锁，速度快 
  - 底层：`char[] value;在它的super()-->AbstractStringBuilder定义`
- StringBuffer：可变，方法加锁，线程安全（synchronized是Java中的关键字，是一种同步锁）
  - 和StringBuilder的父类是同一个

```java
方法区有个字符串常量池
StringPool = ["abc","bcd","cde"]
String a = "abc";---->就把a的指针指向字符串常量池的"abc";
String b = "eee",这个时候字符串常量池里面没有“eee”，
就在里面创建
StringPool ["abc","bcd","cde","eee"]
创建出来以后把b的指针指向"eee"
```

## 6 HashMap和HashTable和ConcurrentHashMap的区别
- HashMap的方法不加锁，速度快,put的时候键和值都可以为null,HashMap的put过程如下:
```java
map.put(key,value):
1.hash(key):获取key的哈希值,比方说hash(key)=3,将其放到entry数组的3号位置
2.查的时候也是一样,把hash(key)传进去,是3就在3号entry位置查找,每个entry都是node的结构
public V put(K key, V value) {
        return putVal(hash(key), key, value, false, true);
    }
public V get(Object key) {
    Node<K,V> e;
    return (e = getNode(hash(key), key)) == null ? null : e.value;
}
        HashMap map = new HashMap();
        map.put(null,null);
        map.put(null,1);
        System.out.println(map.get(null));
        null 的返回值 为 1
   
```
- HashTable的方法加锁，线程安全,如果put进的键或值为空，会报错
```java
   public synchronized V put(K key, V value) {
        // Make sure the value is not null
        if (value == null) {
            throw new NullPointerException();
        }
   }
        Hashtable table = new Hashtable();
        table.put(null,null);
        table.put(null,1);
        System.out.println(table.get(null));
        结果：空指针异常：java.lang.NullPointerException
```

- ConcurrentHashTable即线程安全又效率高
  - 通过把整个Map分为N个Segment（类似HashTable），每个小的Map里实现了线程安全，但是效率提升N倍，默认16倍。
  - 给每个小Map加锁，在操作某一个Map的时候，其他的小Map可以同时操作，保证了并发。
  
  **JDK1.8之前是由分段锁实现的。ConcurrentHashMap是由Segment数组结构和HashEntry数组结构组成。Segment是一种可重入锁ReentrantLock**，每个segment可以看作一个小型的hashmap
  
  一个Segment里包含一个HashEntry数组，每个HashEntry是一个链表结构的元素， 每个Segment守护者一个HashEntry数组里的元素,当对HashEntry数组的数据进行修改时，必须首先获得它对应的Segment锁。
  
  <img src="https://upload-images.jianshu.io/upload_images/807144-4db95a9fa5fedc1c?imageMogr2/auto-orient/strip|imageView2/2/w/820/format/webp" alt="img" style="zoom:50%;" />
  
  **JDK1.8及之后**
  
  jdk8直接**抛弃了Segment**的设计，采用了较为轻捷的**Node + CAS + Synchronized**设计，保证线程安全。
  
  - ConcurrentHashMap包含一个node数组，默认为16，可以自动扩展，扩容银子为0.75
  
  - 每一个节点，挂载一个链表，当链表挂载数据大于8时，链表自动转换成红黑树
  
  <img src="https://upload-images.jianshu.io/upload_images/807144-6264960638978dff?imageMogr2/auto-orient/strip|imageView2/2/w/757/format/webp" alt="img" style="zoom:50%;" />
  
  - Node： ConcurrentHashMap核心内部类，它包装了key-value键值对，所有插入ConcurrentHashMap的数据都包装在这里面。
  
  - TreeNode： 树节点类，当数据链表长度大于8时，会转换为TreeNode。注意，此时的TreeNode并不是红黑树对象，它并不是直接转换为红黑树，而是把这些结点包装成TreeNode放在TreeBin对象中，由TreeBin完成对红黑树的包装。
  
  - TreeBin： TreeNode节点的包装对象，可以认为是红黑树对象。它代替了TreeNode的根节点，ConcurrentHashMap的node“数组”中，存放就是TreeBin对象，而不是TreeNode对象。

**ConcurrentHashMap 总结：**
     1、get方法不加锁；
     2、put、remove方法要使用锁
     jdk7使用锁分离机制(Segment分段加锁)
     jdk8使用cas + synchronized 实现锁操作

   

## 7 HashMap

- 存储结构：entry的数组，entry(key,value)
    - 当entry<8时，本身是一个链表结构
    - 当entry的长度>=8时变成树形结构（红黑树：一种自平衡二叉查找树） 【还是为了查找的效率】

![image-20200422173310929](C:\Users\wwl\Documents\学习\MyLearning\java\images\image-20200422173310929.png)


- 存取逻辑:
  - 1.hash(key):获取key的哈希值,比方说hash(key)=3,将其放到entry数组的3号位置
  - 2.查的时候也是一样,把hash(key)传进去,是3就在3号entry位置一个个往下查找,每个entry都是node的结构
- 扩容方案:自身容量扩大一倍.成倍增长
  - 默认的长度是16,负载因子大小为0.75，也就是说，当一个map填满了75%的bucket时候，和其它集合类(如ArrayList等)一样，将会创建原来HashMap大小的两倍的bucket数组，来重新调整map的大小，并将原来的对象放入新的bucket数组中。这个过程叫作rehashing，因为它调用hash方法找到新的bucket位置。

## 8 Vector和ArrayList的区别

相同点: 都实现了List接口

区别:

- Vector:上锁了,线程安全,速度较慢,效率较低
- ArrayList:没有锁, 线程不安全,速度较快,效率更高
- 扩容逻辑
  - Vector
```java
//Vector指定 初始大小为10,扩容因子为0
public Vector(int initialCapacity) {this(initialCapacity,capacityIncrement:0);}
public Vector() {this(initialCapacity:10);}
//Vector扩容逻辑:如果调用时制定了扩容因子并capacityIncrement > 0,则每次增加扩容因子大小,如果未指定,即扩容银子=0,则2倍增长
private void grow(int minCapacity){
  int newCapacity = oldCapacity + ((capacityIncrement > 0) ?
                                         capacityIncrement : oldCapacity);   
}
```
- - ArrayList

```java
// 默认容量为10
private static final int DEFAULT_CAPACITY = 10;
//扩容机制:1.5倍增加
//右移一位等于 /2 这是二进制计数规则
//二进制1000是十进制8
//二进制100是十进制4
//二进制10是十进制2 
private void grow(int minCapacity) {
        int newCapacity = oldCapacity + (oldCapacity >> 1);
    }
```

## Arrays.asList()方法

```java
Integer[] a = {1,2,3};
List<Integer> list = Arrays.asList(a);
```

Arrays.asList()只是将传入的数组以**list**的形式返回，list对应的数组还是原来的数组。没有拷贝，也不会动态改变大小，所以对数组的修改也会反映到List中。

```java
//如果想将数据变成**ArrayList**的话需要new ArrayList。
//这个时候list2在内存中是一个新的空间
List<Integer> list2 = new ArrayList<>(list);
```

## 9 Vector为什么用得少

1. 线程安全牺牲速度
2. 扩容大,需要连续的存储空间也大
3. 底层用的是数组,插入/删除比较慢。如果经常插入或者删除可以用LinkedList

## 10 枚举
```java
    enum UserState {
        NORMAL,LOCKED,DISABLE;
    }
    public void main(){
            handleState(UserState.NORMAL);
        }
    public void handleState(UserState state){
        switch (state) {
            case NORMAL:
                System.out.println(1);
                break;
            case LOCKED:
                System.out.println(2);
                break;
            case DISABLE:
                System.out.println(3);
                break;
            default:
                System.out.println(444);
                break;
        }
```
1、为什么使用枚举？
- 使用枚举的地方会有更强的约束类型，编译器会帮我们检查入参类型，规避潜在风险(你不能像int一样随便输一个)
2、枚举的常用方法：
- UserState state1 = UserState.NORMAL
    - state1.ordinal() 返回枚举的序数，从0开始。输出为0
    - state1.name() 返回枚举的名称：输出为NORMAL
    - 类方法UserState state3 = UserState.valueOf("NORMAL") 输入字符串名称返回枚举对象

3、枚举的扩展

自定义枚举的构造函数、属性值、方法(和普通类一样)
```java
   enum UserState {
        NORMAL("ADMIN",1001),
        LOCKED("USER",1002),
        DISABLE("OTHER",1003);
        private final String roleName;
        private final Integer stateCode;

        UserState(String roleName, Integer stateCode) {
            this.roleName = roleName;
            this.stateCode = stateCode;
        }

        public String getRoleName() {
            return roleName;
        }

        public Integer getStateCode() {
            return stateCode;
        }
    }
```
4、专用于枚举的集合类
- EnumSet
- EnumMap

## 反射
### 基本过程

1、编译Java文件，生成`.class`文件

2、使用Java虚拟机（JVM）将字节码文件（字节码文件在内存中使用Class类表示）加载到内存

4、使用反射的时候，首先获取到Class类，就可以得到class文件里的所有内容，包含属性、构造方法、普通方法

5、属性通过Filed类表示、构造方法通过Constructor表示、普通方法通过Method表示
### 1、创建反射的三种方法

获取反射对象的三种方式(反射的入口):

* 1)、`Class.forName(全类名)`；
* 2)、`XX.class`；
* 3)、`对象.getClass()`；
### 2、用反射获取类的方法
* `getMethods()`会获取到这个类以及和它有关的类(接口、父类)的所有`public`方法；
* `getDeclaredMethods()`只会获取**当前类**的所有方法(包括`private、protected`)；
### 3、用反射获取接口
- getInterfaces()
### 4、用反射获取成员变量
注意也是有`getFields()`和`getDeclaredFields()`的区别。
### 5、用反射获取构造器
`getConstructors()`和`getDeclaredConstructors`
### 6、用反射获取父类
getSuperclass()
### 7、用反射创建实例
newInstance();

## 序列化和反序列化
1、序列化和反序列化的定义：

(1)Java序列化就是指把Java对象转换为字节序列的过程

Java反序列化就是指把字节序列恢复为Java对象的过程。

(2)序列化最重要的作用：在传递和保存对象时.**保证对象的完整性和可传递性**。对象转换为有序字节流,以便在网络上传输或者保存在本地文件中。

反序列化的最重要的作用：根据字节流中保存的对象状态及描述信息，通过反序列化**重建对象**。

总结：核心作用就是对象状态的保存和重建。（整个过程核心点就是字节流中所保存的对象状态及描述信息）

2、序列化优点：
1. 永久性保存数据
2. 方便网络传输
3. 进程间传递对象

## 变量初始化顺序

在有继承关系的情况下，变量初始化顺序如下：

- 父类的静态变量和静态代码块`static{}`；
- 子类的静态变量和静态代码块`static{}`；
- 父类的实例变量和实例代码块`{}`；
- 父类的构造方法；
- 子类的实例变量实例代码块`{}`；
- 子类的构造方法；

