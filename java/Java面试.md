## Redis

### redis线程

redis是单线程操作的，但是却可以处理高并发。原因是基于多路复用的非阻塞IO，基于NIO(non_blocking_io);

### Redis为什么这么快

- 完全基于内存，绝大部分请求是纯粹的内存操作；
- 数据结构简单，对数据操作也简单，redis中的数据结构是专门进行设计的；
- 采用单线程，避免了不必要的上下文切换和竞争条件，不用考虑加锁释放锁和死锁的问题；
- 使用多路复用模型，非阻塞IO；

## 缓存一致性问题（共享变量）

当程序在运行过程中，会将运算需要的数据从主存复制一份到CPU的高速缓存当中，那么CPU进行计算时就可以直接从它的高速缓存读取数据和向其中写入数据，当运算结束之后，再将高速缓存中的数据刷新到主存当中。

```
i=i+1
```

当线程执行这个语句时，会先从主存当中读取i的值，然后复制一份到高速缓存当中，然后CPU执行指令对i进行加1操作，然后将数据写入高速缓存，最后将高速缓存中i最新的值刷新到主存当中。

比如同时有2个线程执行这段代码，假如初始时i的值为0，那么我们希望两个线程执行完之后i的值变为2。

可能存在下面一种情况：初始时，两个线程分别读取i的值存入各自所在的CPU的高速缓存当中，然后线程1进行加1操作，然后把i的最新值1写入到内存。此时线程2的高速缓存当中i的值还是0，进行加1操作之后，i的值为1，然后线程2把i的值写入内存。最终结果i的值是1，而不是2。这就是著名的**缓存一致性问题**。通常称这种**被多个线程访问的变量为共享变量。**

## 并发编程中的三个概念

　　在并发编程中，我们通常会遇到以下三个问题：**原子性问题，可见性问题，有序性问题**。

**1.原子性**

　　原子性：即一个操作或者多个操作 要么全部执行并且执行的过程不会被任何因素打断，要么就都不执行。

**2.可见性**

　　可见性是指当多个线程访问同一个变量时，**一个线程修改了这个变量的值，其他线程能够立即看得到修改的值。**

比如：线程1对变量i修改了之后，先放到缓存，但是没有立即写入内存；此时线程2没有立即看到线程1修改的值，线程2此时想读取这个变量的值以后还是原来的值。

**3.有序性**

　　有序性：即程序执行的顺序按照代码的先后顺序执行。**cpu指令重排**，一般来说，处理器为了提高程序运行效率，可能会对输入代码进行优化，它不保证程序中各个语句的执行先后顺序同代码中的顺序一致，但是它会保证程序最终执行结果和代码顺序执行的结果是一致的。

## HappensBefore规则

JSR-133**使用happens-before的概念来指定两个操作之间的执行顺序**。由于这两个操作可以在一个线程之内，也可以是在不同线程之间。因此，JMM可以通过happens-before关系向程序员提供**跨线程的内存可见性保证**（如果A线程的写操作a与B线程的读操作b之间存在happens-before关系，尽管a操作和b操作在不同的线程中执行，但JMM向程序员保证a操作将对b操作可见）

### 规则一：程序的顺序性规则

> 一个线程中，按照程序的顺序，前面的操作happens-before后续的任何操作。

### 规则二：volatile规则

> 对一个volatile变量的写操作，happens-before后续对这个变量的读操作。

### 规则三：传递性规则

> 如果A happens-before B，B happens-before C，那么A happens-before C。

### 规则四：管程中的锁规则

> 对一个锁的解锁操作，happens-before后续对这个锁的加锁操作。

### 规则五：线程start()规则

> 主线程A启动线程B，线程B中可以看到主线程启动B之前的操作。也就是start() happens before 线程B中的操作。

### 6.规则六：线程join()规则

> 主线程A等待子线程B完成，当子线程B执行完毕后，主线程A可以看到线程B的所有操作。也就是说，子线程B中的任意操作，happens-before join()的返回。

## Java内存模型

Java内存模型规定所有的变量都是存在主存当中（类似于前面说的物理内存），每个线程都有自己的工作内存（类似于前面的高速缓存）。线程对变量的所有操作都必须在工作内存中进行，而不能直接对主存进行操作。并且每个线程不能访问其他线程的工作内存。

**1.对原子性的保证**

　　在Java中，对**基本数据类型的变量的读取和赋值操作是原子性操作**，即这些操作是不可被中断的，要么执行，要么不执行。如果要实现**更大范围操作的原子性**，可以通过**synchronized和Lock**来实现。由于synchronized和Lock能够保证任一时刻只有一个线程执行该代码块，那么自然就不存在原子性问题了，从而保证了原子性。

**2.可见性的保证**

对于可见性，Java提供了volatile关键字来保证可见性。

当一个**共享变量被volatile修饰**时，它会保证修改的值会立即被更新到主存，当有其他线程需要读取时，它会去内存中读取新值。

而**普通的共享变量不能保证可见性**，因为普通共享变量被修改之后，什么时候被写入主存是不确定的，当其他线程去读取时，此时内存中可能还是原来的旧值，因此无法保证可见性。

通过**synchronized和Lock也能够保证可见性**，synchronized和Lock能保证同一时刻只有一个线程获取锁然后执行同步代码，并且**在释放锁之前会将对变量的修改刷新到主存**当中。因此可以保证可见性。

**3.有序性的保证**

volatile关键字能禁止指令重排序，所以volatile能在一定程度上保证有序性。【防止指令重排只能防止volatile关键字变量之前的操作的不重排。】

synchronized和Lock保证每个时刻是有一个线程执行同步代码，相当于是让线程顺序执行同步代码，自然就保证了有序性。



## Java内存模型和JVM内存模型

### 一、jvm内存结构（jvm运行时内存结构）

![图片描述](https://segmentfault.com/img/bVbwWOC?w=742&h=529)

### 二、java内存模型

- 在Java中，所有实例域、静态域和数组元素{数组中的元素}都存储在堆内存中， 堆内存在线程之间是共享的
- 而虚拟机栈（其中包括局部变量、方法参数定义等..）是线程私有的，不会在线程之间共享，所以它们不会有内存可见性的问题，也不受内存模型的影响。

**java内存模型主要是保证<<共享内存部分>>的原子性、可见性、有序性，**

![image-20200428212616852](C:\Users\wwl\Documents\学习\MyLearning\java\images\image-20200428212616852.png)

## Spring AOP两种动态代理对象实现方式

#### 一、JDK生成AopProxy代理对象

JDK 的动态代理要求**代理者必须实现接口**, , 否则不能生成代理对象. .

通过JDK的Proxy类的静态方法newProxyInstance方法得到最终的代理对象。该方法包含3个参数： 
 一个类装载器loader， 
 一个代理接口interfaces， 
 一个Proxy回调方法所在的对象handler

### 二、CGLIB生成AopProxy代理对象

cglib是一个代码生成的类库，可以**在运行时动态生成某个类的子类**，所以，**CGLIB是通过继承的方式做的动态代理**，因此如果某个类被标记为final，那么它是无法使用CGLIB做动态代理的。**不管有无接口都可以创建代理对象.**

代理对象的生成过程由Enhancer类实现，大概步骤如下： 
1、**生成代理类Class的二进制字节码**； 
2、通过**Class.forName加载二进制字节码，生成Class对象；** 
3、**通过反射机制获取实例构造，并初始化代理类对象**。

### 使用spring的AOP代理对象生成策略：

1.在spring中默认条件下**如果目标对象有接口,则使用JDK的动态代理.**
　**如果目标对象没有接口则默认使用cgLib动态代理**.

2.**当从容器中获取对象时,如果获取的对象满足切入点表达式.那么就会为其创**
**建代理对象.**

### 优缺点

**jdk动态代理类只能为一个被代理类服务**jdk动态代理**必须实现接口**，**通过反射来动态代理方法**，消耗系统性能。

**cglib动态代理无需实现接口**，通过**生成子类字节码来实现**，比反射快一点，没有性能问题。但是由于cglib会继承被代理类，需要重写被代理方法，所以被代理类不能是final类，被代理方法不能是final。

## Java线程池几个参数的理解

```java
ThreadPoolExecutor mExecutor = new ThreadPoolExecutor(
    corePoolSize,// 核心线程数						
    maximumPoolSize, // 最大线程数						
    keepAliveTime, // 闲置线程存活时间						
    TimeUnit.MILLISECONDS,// 时间单位						
    new LinkedBlockingDeque<Runnable>(),// 线程队列							Executors.defaultThreadFactory(),// 线程工厂						
    new AbortPolicy()// 队列已满,而且当前线程数已经超过最大线程数时的异常处理策略);
```
## Synchronized 同步锁

Java 中的 synchronized 关键字可以在多线程环境下用来作为线程安全的同步锁。

java的内置锁：每个java对象都可以用做一个实现同步的锁，这些锁成为内置锁。**线程进入同步代码块或方法的时候会自动获得该锁，在退出同步代码块或方法时会释放该锁。**获得内置锁的**唯一途径就是进入这个锁的保护的同步代码块或方法。**

Java中的对象锁和类锁：对象锁是用于对象实例方法，或者一个对象实例上的，类锁是用于类的静态方法或者一个类的class对象上的。我们知道，类的对象实例可以有很多个，但是每个类只有一个class对象，所以不同对象实例的对象锁是互不干扰的，但是每个类只有一个类锁。



```java
非静态方法:  给对象加锁(可以理解为给这个对象的内存上锁,注意 只是这块内存,其他同类对象都会有各自的内存锁),这时候  在其他一个以上线程中执行该对象的这个同步方法(注意:是该对象)就会产生互斥

静态方法: 相当于在类上加锁(*.class 位于代码区,静态方法位于静态区域,这个类产生的对象公用这个静态方法,所以这块内存，N个对象来竞争), 这时候,只要是这个类产生的对象,在调用这个静态方法时都会产生互斥
```

下面这段同步代码快给obj上了同步锁，每个时间只能有一个线程进入，sleep 1 秒以后将obj释放，另一个线程进来。可以实现一秒打印一个hello

```java
public class Concurrent {
    static Object obj = new Object();
    static Lock lock = new ReentrantLock();//可重入锁

    public static void main(String[] args) {
        for (int i=0; i<10; i++) {
            test1();
        }
    }

    public static void test1() {
        Thread t = new Thread(()->{
            synchronized (obj) {
                try {
                    System.out.println("Hello");
                    Thread.sleep(1000);
                }catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        t.start();
    }
}
```

## Volatile

一、Java中的volatile

  在Java程序中，如果一个变量被volatile关键字修饰，那么这个变量就具有了**有序性和可见性。**

  有序性：java语言中提供了**synchronized和volatile两个关键字保证线程之间操作的有序性**，也就是他可以使CPU指令有序。

  可见性：当一个线程操作一个被volatile修饰的变量时，这个变量的修改对其他所有线程都是可见的，因为此时的操作不会将该变量读到当前线程的CPU缓存中进行操作，而是直接操作内存

**volatile原理** ：Java语言提供了一种**稍弱的同步机制**，即volatile变量，用来确保将变量的更新操作通知到其他线程。当把变量声明为volatile类型后，编译器与运行时都会注意到这个变量是共享的，因此不会将该变量上的操作与其他内存操作一起重排序。**volatile变量不会被缓存在寄存器或者对其他处理器不可见的地方，因此在读取volatile类型的变量时总会返回最新写入的值。**

　　**在访问volatile变量时不会执行加锁操作，因此也就不会使执行线程阻塞**，因此volatile变量是一种比sychronized关键字更轻量级的同步机制。

## Lock

```java
public class Concurrent {
    static Object obj = new Object();
    static Lock lock = new ReentrantLock();

    public static void main(String[] args) {
        for (int i=0; i<10; i++) {
            test2();
        }
    }
    public static void test1() {
        Thread t = new Thread(()->{
            synchronized (obj) {
                try {
                    System.out.println("Hello");
                    Thread.sleep(1000);
                }catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        t.start();
    }
    public static void test2() {
        Thread t = new Thread(()->{
            try {
                lock.lock();
                System.out.println("hello");
                Thread.sleep(1000);
            }catch (InterruptedException e) {
                e.printStackTrace();
            }finally {
                lock.unlock();
            }
        });
        t.start();
    }
}
```

## Lock和Synchronized的区别

 1:**Lock**是一个接口，而**Synchronized**是关键字。

 2:**Synchronized**会自动释放锁，而**Lock**必须手动释放锁。

 3:**Lock**可以让等待锁的线程响应中断，而**Synchronized**不会，线程会一直等待下去。

 4:通过**Lock**可以知道线程有没有拿到锁，而**Synchronized**不能。

 5:**Lock**能提高多个线程读操作的效率。

 6:**Synchronized**能锁住类、方法和代码块，而**Lock**是块范围内的

synchronized原始采用的是CPU**悲观锁**机制，即线程获得的是独占锁。独占锁意味着其他线程只能依靠阻塞来等待线程释放锁。

Lock用的是乐观锁方式。所谓乐观锁就是，每次不加锁而是假设没有冲突而去完成某项操作，如果因为冲突失败就重试，直到成功为止。



ReentrantLock的方法

　 **a) lock(), 如果获取了锁立即返回，如果别的线程持有锁，当前线程则一直处于休眠状态，直到获取锁
　b) tryLock(), 如果获取了锁立即返回true，如果别的线程正持有锁，立即返回false；**

 **c) unlock()释放锁**

## 读写锁

**Synchronized**存在明显的一个性能问题就是**读与读之间互斥**，简言之就是，我们编程想要实现的最好效果是，可以做到读和读互不影响，读和写互斥，写和写互斥。

ReadWriteLock管理一组锁，一个是只读的锁，一个是写锁。
Java并发库中ReetrantReadWriteLock实现了ReadWriteLock接口并添加了可重入的特性。

### 锁升降级

锁降级：从写锁变成读锁；同一个线程中在**没有释放写锁**的情况下，就去**申请读锁，这属于锁降级**。

锁升级：从读锁变成写锁

**ReentrantReadWriteLock支持锁降级不支持锁升级，但是需要正确释放写锁，不然别的线程永远得不到写锁**

### 总结

读锁使用共享模式；

写锁使用独占模式，换句话说，读锁可以在没有写锁的时候被多个线程同时持有，写锁是独占的

**当有读锁时，写锁就不能获得（先读再写）；**而当**有写锁时，除了获得写锁的这个线程可以获得读锁外，其他线程不能获得读锁**

## 可重入锁

什么是可重入锁，不可重入锁呢？"重入"字面意思已经很明显了，就是可以重新进入。可重入锁，就是说一个线程在获取某个锁后，还可以继续获取该锁，即允许一个线程多次获取同一个锁。比如synchronized内置锁就是可重入的，如果A类有2个synchornized方法method1和method2，那么method1调用method2是允许的，不可重入的话一个线程获取同步锁以后其他线程就不能访问这个类的同步方法了。

## CAS:乐观锁与悲观锁

**JUC是java.util.concurrent包的简称，JUC有2大核心，CAS和AQS，CAS是java.util.concurrent.atomic包的基础**

CAS（Compare and Swap）有3个操作数，内存值V，旧的预期值A，要修改的新值B。当且仅当预期值A和内存值V相同时，将内存值V修改为B，否则什么都不做。

<img src="C:\Users\wwl\Documents\学习\MyLearning\java\images\image-20200428225725400.png" alt="image-20200428225725400" style="zoom:50%;" />

**乐观锁，用到的机制就是CAS，基于冲突检测的乐观锁。这种模式下，已经没有所谓的锁概念了，每个线程都直接先去执行操作，检测是否与其他线程存在共享数据竞争，如果没有则让此操作成功，如果存在共享数据竞争则不断地重新执行操作，直到成功为止**

## 可重入锁是如何实现的

**可重入锁之所以可重入，就是同一个线程可以反复使用它占用的锁**

ReentrantLock实现了Lock接口，内部有三个内部类，Sync、NonfairSync、FairSync，Sync是一个抽象类型，它继承AbstractQueuedSynchronizer，这个**AbstractQueuedSynchronizer【AQS】**是一个模板类，它实现了许多和锁相关的功能，并提供了钩子方法供用户实现，比如tryAcquire，tryRelease等。Sync实现了AbstractQueuedSynchronizer的tryRelease方法。**NonfairSync和FairSync两个类继承自Sync，实现了lock方法**，然后分别公平抢占和非公平抢占针对tryAcquire有不同的实现

lock方法：

当我们调用**ReentrantLock的lock方法**的时候，实际上是调用了NonfairSync的lock方法，

- 这个方法先用**CAS操作，去尝试抢占该锁。**
- **如果成功，设置当前锁的状态为1，表示抢占成功**  
- 如果失败，则调用acquire模板方法，等待抢占。
- acquire方法内部先使用tryAcquire这个钩子方法去尝试再次获取锁，实现原理是先比较当前锁的状态是否是0，如果是0，则尝试去原子抢占这个锁（设置状态为1，然后把当前线程设置成独占线程），如果当前锁的状态不是0，就去比较当前线程和占用锁的线程是不是一个线程，如果是，会去增加状态变量的值，从这里看出可重入锁之所以可重入，就是同一个线程可以反复使用它占用的锁。如果以上两种情况都不通过，则返回失败false。

## AQS和Synchronized的区别

（1）synchronized 是 JVM 实现的（关键字），而 ReentrantLock 是 JDK 实现的（接口和接口的实现）
（2）**synchronized** 中的锁是非公平的（**非公平锁**），**ReentrantLock**（**有公平锁和非公平锁两个内部类**） 默认情况下也是非公平的，但是也可以是公平的。
（3）**synchronized比较简单（执行完会自动释放锁）**，**ReentrantLock需要lock()和unlock()，很可能死锁**来实现，较为复杂 

## Lock和Synchronized的区别

 1:**Lock**是一个接口，而**Synchronized**是关键字。

 2:**Synchronized**会自动释放锁，而**Lock**必须手动释放锁。

 3:**Lock**可以让等待锁的线程响应中断，而**Synchronized**不会，线程会一直等待下去。

 4:通过**Lock**可以知道线程有没有拿到锁，而**Synchronized**不能。

 5:**Lock**能提高多个线程读操作的效率。

 6:**Synchronized**能锁住类、方法和代码块，而**Lock**是块范围内的

synchronized原始采用的是CPU**悲观锁**机制，即线程获得的是独占锁。独占锁意味着其他线程只能依靠阻塞来等待线程释放锁。

Lock用的是乐观锁方式。所谓乐观锁就是，每次不加锁而是假设没有冲突而去完成某项操作，如果因为冲突失败就重试，直到成功为止。

### ReentrantLock的方法

　 **a) lock(), 如果获取了锁立即返回，如果别的线程持有锁，当前线程则一直处于休眠状态，直到获取锁
　b) tryLock(), 如果获取了锁立即返回true，如果别的线程正持有锁，立即返回false；**

 **c) unlock()释放锁**

## 红黑树

性质1：每个节点要么是黑色，要么是红色。

性质2：根节点是黑色。

性质3：每个叶子节点（NIL）是黑色。

性质4：每个红色结点的两个子结点一定都是黑色。

**性质5：任意一结点到每个叶子结点的路径都包含数量相同的黑结点。**

<img src="https://upload-images.jianshu.io/upload_images/2392382-4996bbfb4017a3b2.png?imageMogr2/auto-orient/strip|imageView2/2/w/526" alt="img" style="zoom:50%;" />

## 线程池都有哪几种工作队列

1、ArrayBlockingQueue
 是一个基于数组结构的**有界阻塞队列**，此队列按 FIFO（先进先出）原则对元素进行排序。
 2、LinkedBlockingQueue
 一个基于链表结构的**阻塞队列**，此队列按FIFO （先进先出） 排序元素，吞吐量通常要高于ArrayBlockingQueue。静态工厂方法Executors.newFixedThreadPool()使用了这个队列
 3、SynchronousQueue
 一个不存储元素的**阻塞队列**。每个插入操作必须等到另一个线程调用移除操作，否则插入操作一直处于阻塞状态，吞吐量通常要高于LinkedBlockingQueue，静态工厂方法Executors.newCachedThreadPool（5）使用了这个队列。
 4、PriorityBlockingQueue
 一个具有优先级的**无限阻塞队列**。



# 数据库

### **MySQL 索引**

索引用于快速找出在某个列中有一特定值的行，**不使用索引，MySQL必须从第一条记录开始读完整个表，直到找出相关的行**，表越大，查询数据所花费的时间就越多，如果表中**查询的列有一个索引**，MySQL能够**快速到达一个位置去搜索数据文件**，而不必查看所有数据，那么将会节省很大一部分时间。

**其中MySQL中的索引的存储类型有两种：BTREE、HASH**。 （InnoDB存储引擎：只支持BTREE索引）

MySQL索引的建立对于MySQL的高效运行是很重要的，索引可以大大提高MySQL的**检索速度**。

**缺点**

虽然索引大大提高了查询速度，同时却会**降低更新表的速度**，如对表进行INSERT、UPDATE和DELETE。因为更新表时，MySQL不仅要保存数据，还要保存一下索引文件。

实际上，**索引也是一张表，该表保存了主键与索引字段**，并指向实体表的记录。

#### 索引分类

索引分**单列索引和组合索引**。单列索引，即一个索引只包含单个列，一个表可以有多个单列索引，但这不是组合索引。组合索引，即一个索引包含多个列。

**单列索引**：

- **普通索引**：MySQL中基本索引类型，没有什么限制，允许在定义索引的列中插入重复值和空值，纯粹为了查询数据更快一点。
- **唯一索引**：索引列中的值必须是唯一的，但是允许为空值
- **主键索引**：是一种特殊的唯一索引，不允许有空值。

### 行锁

InnoDB行锁是通过给索引上的索引项加锁来实现的，InnoDB这种行锁实现特点意味着：只有通过索引条件检索数据，InnoDB才使用行级锁，否则，InnoDB将使用表锁！

### 事务的四大特性

### 并发时存在的问题

1.脏读：一个事务读到另外一个事务还没有提交的数据，我们称之为脏读。

2.不可重复读:一个事务先后读取同一条记录，但两次读取的数据不同(同一时刻另一个事务也在读这个数据，并且修改了，读到的数据就会前后不一样)，我们称之为不可重复读。

3.幻象读:一个事务先后读取一个范围的记录，但两次读取的纪录数不同，我们称之为幻象读（两次执行同一条 select 语句会出现不同的结果，第二次读会增加一数据行，并没有说这两次执行是在同一个事务中）。

    例如：
     目前工资为5000的员工有10人，事务A读取所有工资为5000的人数为10人。
     此时，
     事务B插入一条工资也为5000的记录。
     这是，事务A再次读取工资为5000的员工，记录为11人。此时产生了幻读

### 二、事务的隔离级别

**提交读是Oracle默认的隔离级别,**

**可重复读是Mysql的默认隔离级别。**

<img src="https://img-blog.csdn.net/20170731153807862?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3RhcmxoMzU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast" alt="这里写图片描述" style="zoom:150%;" />

###  实现隔离机制的方法 

 实现隔离机制的方法主要有两种

1. 加读写锁
2. 一致性快照读，即 `MVCC`

# InnoDB 

InnoDB 给 MySQL 提供了具有[事务](https://baike.baidu.com/item/事务)(transaction)、[回滚](https://baike.baidu.com/item/回滚)(rollback)和崩溃修复能力(crash recovery capabilities)、多版本[并发控制](https://baike.baidu.com/item/并发控制)(multi-versioned concurrency control)的**事务安全**(transaction-safe **(ACID** compliant))型**表**。InnoDB 提供了**行级锁**(locking on row level)，提供与 Oracle 类似的不加锁读取(non-locking read in SELECTs)。

### 行锁

InnoDB行锁是通过给索引上的索引项加锁来实现的，InnoDB这种行锁实现特点意味着：只有通过索引条件检索数据，InnoDB才使用行级锁，否则，InnoDB将使用表锁！

### MVCC 机制

`MVCC (Multiversion Concurrency Control)` 中文全称叫 **多版本并发控制** ，是现代数据库（包括 `MySQL` 、 `Oracle` 、 `PostgreSQL` 等）引擎实现中常用的**处理读写冲突**的手段， 目的在于**提高 [数据库](http://www.codercto.com/category/database.html) 高并发**场景下的吞吐性能 。

![InnoDB MVCC 机制，看这篇就够了](https://img1.3s78.com/codercto/bfa89998d4dea1104d7954d6ab03350e)

- DATA_TRX_ID：记录**最近更新这条行记录的 `事务 ID`** ，大小为 `6` 个字节

- DATA_ROLL_PTR：表示指向该行回滚段 `（rollback segment）` 的指针，大小为 `7` 个字节， `InnoDB` 便是通过这个指针找到之前版本的数据。**该行记录上所有旧版本**，在 `undo` 中都通过链表的形式组织。

### 事务日志（Redo Log和Undo Log）

innodb事务日志包括redo log和undo log。**redo log是重做日志，提供前滚操作**，**undo log是回滚日志，提供回滚操作。**

undo log不是redo log的逆向过程，其实它们都算是用来恢复的日志：
**1.redo log通常是物理日志，记录的是数据页的物理修改，而不是某一行或某几行修改成怎样怎样，它用来恢复提交后的物理数据页(恢复数据页，且只能恢复到最后一次提交的位置)。**
**2.undo用来回滚行记录到某个版本。undo log一般是逻辑日志，根据每行记录进行记录。** 

### 如何组织版本链

在多个事务并行操作某行数据的情况下，不同事务对该行数据的 UPDATE 会产生多个版本，然后通过回滚指针组织成一条 `Undo Log` 链

MVCC  运行在  RC  和  RR 这两个隔离级别下，当  InnoDB  隔离级别设置为二者其一时，在  SELECT  数据时就会用到版本链。这就使得别的事务可以修改这条记录，反正每次修改都会在版本链中记录。SELECT可以去版本链中拿记录，这就实现了读-写，写-读的并发执行，提升了系统的性能。

## 