## Idea如何看接口的实现类
ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml")

点ApplicationContext右键--->Diagrams-->show diagram会得到这个接口的继承关系，此时再右键这个接口-->show implementations就可以找到这个接口的实现类了

## Java读取文件的路径问题
1. 绝对路径：d:/xxx/xxx.xml XXX
2. 相对路径：src/java/main/xxx.xml XXX [因为一旦编译以后就没有这些文件了，也就读取不到了]
3. 使用类加载器，他只能读取类路径(编译后的路径)的配置文件
4. 使用ServletContext对象的getRealPath()

## 实体类(Entity)、POJO和JavaBean
JavaBean：是一种JAVA语言写成的可重用组件。JavaBean符合一定规范编写的Java类，不是一种技术，而是一种规范。
1. 所有属性为private。
2. 这个类必须有一个公共的缺省构造函数。即是提供无参数的构造器。
3. 这个类的属性使用getter和setter来访问，其他方法遵从标准命名规范。
4. 这个类应是可序列化的。实现serializable接口。
5. POJO严格地遵守简单对象的概念，而一些JavaBean中往往会封装一些简单逻辑。

**POJO （Plain Ordinary Java Object）简单的Java对象，实际就是普通JavaBeans**

POJO类中有属性和get、set方法，但是没有业务逻辑

**实体类和数据库对应：**
- 实体类名，尽量和数据库中的表名一一对应
- 实体类应该实现java.io.Serializable接口
- 实体类中的属性对应数据库表中的字段，相关的命名最好也一一对应
- 实体类内方法主要有，setter、getter方法，用于设置、获取数据
- 实体类属性一般为private类型，方法为public类型
- 实体类应该有，无参、有参构造方法
## 类和对象
**类（class）和对象(object)** 

Java类和对象的关系是：对象是类实例化出来的,对象中含有类的属性,类是对象的抽象。

比如“人类”就是一个类，那么具体的某个人“张三”就是“人类”这个类的对象，而“名字、年龄”等信息就是对象的属性，人的动作比如“吃饭、穿衣”等就是对象的方法。

总之类就是有相同特征的事物的集合，而对象就是类的一个回具体实例。

## 抽象类
- 抽象类使用 abstract 关键字修饰
- 有抽象方法的类一定是抽象类
- 抽象类不能实例化对象
- 抽象类的其它功能依然存在，成员变量、成员方法和构造方法的访问方式和普通类一样。
- 由于抽象类不能实例化对象，所以抽象类必须被继承，才能被使用。
- 在Java中抽象类表示的是一种**继承关系**，**一个类只能继承一个抽象类**，而一个类却可以实现多个接口。
```java
public class Solution {
    public static void main(String[] args) {
        A a= new B(); // 抽象类 A 不能实例化A的对象，但是可以实例化子类B的对象
        a.c(); //这里调用的是重写的B中的c方法，子类重写的方法会覆盖父类
    }
}

abstract class A { //抽象类 A 中可以没有抽象方法
    int a = 0;
    int b = 1;
    void a(){}
    void b(){
        System.out.println("sss");
    }
    abstract void c(); //抽象方法就是没有实现的方法，后面不能加大括号
}

class B extends A {

    @Override
    void c() {
        System.out.println(a+b);
    }
}
```

### 多态的实现方式
- 方法重载（指的是在一个类中有若干个方法名相同，但参数列表不同的情况，返回值可以相同也可以不同）
- 方法重写 (子类对父类。但是子类方法的参数列表和返回值类型，必须与父类方法一致！)
- 接口 (接口定义方法，方法的实现在继承接口的具体类中定义，也是对同一行为的不同表现形式。)
- 抽象类
## 创建一个对象的过程
    1. 分配对象空间， 并将对象成员变量初始化为0或空
    2. 执行属性值的显式初始化
    3. 执行构造方法
    4. 返回对象的地址给相关的变量

## this的本质
this的本质就是**“创建好的对象的地址”**！ 由于在构造方法调用前，对象已经创建。 因此， 在构造方法中也可以使用 this 代表 “当前对象”。 
```java
helloWorld.this.a = a;
this.a = a;
```
this最常用的用法：

1. 当程序发生二义性的时候使用 this 来区分局部变量和成员变量

2. 用 this 调用重载的构造方法，避免相同的初始化代码。 构造器的调用必须放第一句。

3. **this 不能用于static方法**，因为 static 都是放在方法区的，用 this 是访问不到的。
    - **注意：如果定义了静态变量或者静态方法，这些变量和方法虽然是类的，对象虽然不能访问到，但是是可以使用的（因为静态变量和方法是属于类的，类和类的实例都可以访问）；
    -  但是，如果是静态方法想要使用 this 来访问一般方法和成员就会报**`'helloWorld.this' cannot be referenced from a static context` （因为static创建的时候还没有对象，因此也就不能访问对象的属性和方法了。）
![](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191209152359.png)
```java
public class helloWorld {
    int a, b, c;

    //    当程序发生二义性的时候使用 this 来区分局部变量和成员变量
    helloWorld(int a, int b) {
        this.a = a;
        this.b = b;
    }

    helloWorld(int a, int b, int c) {
//        用 this 调用构造器， 构造器的调用必须放第一句
        this(a,b);
        this.c = c;
    }

    void sing() {
    }

    void eat() {
        this.sing(); //调用本类中的sing()，写不写无所谓;
        System.out.println("你妈妈喊你回家吃饭！");
    }
    public static void main(String[] args) {
        helloWorld h = new helloWorld(2, 3);
        h.eat();
    }
}
```

## 内存分析
栈内存：
1. 栈描述的是方法执行的内存模型，每个方法被调用都会创建一个栈帧（存储局部变量、操作数、方法出口等）
2. JVM为每一个线程创建一个栈。用于存放该线程执行方法的信息（实际参数、局部变量等）
3. 栈属于线程私有，不能实现线程间的共享！
4. 栈的存储特性是：“先进后出，后进先出”（最后一个调用的方法最先被杀死）
5. 栈是由系统自动分配，速度快！栈是一个连续的内存空间。
加载的时候首先把类信息放到内存中的方法区。

堆的特点如下：
1. 堆用于存储创建好的对象和数组（数组也是对象）【new出来的对象都放在堆里面】
2. JVM只有一个堆，被所有线程共享
3. 堆是一个不连续的空间，分配灵活，速度慢!

方法区（又叫静态区）特点如下：
1. JVM只有一个方法区，被所有线程共享！
2. 方法区实际也是堆，只是用于存储类、常量相关的信息。
3. 用来存放程序中永远是不变或唯一的内容。（类信息【class对象】、静态变量、静态方法、字符串常量等。）

**注意：java程序的控制台运行是 `java User` ,敲空格以后，虚拟机启动，开始分配栈、堆空间**

1. 要运行User这个类，首先要把这个类的信息加载到空间里边（加载到方法区）
- 方法区：
    + User类的信息
        * 代码
        * 静态变量：
            - company
        * 静态方法：
            - printCompany()
        * 常量:
            - "北京尚学堂"
            - "登录："
            - "高小七"
            - "北京阿里爷爷"
2. 类加载进来以后开始找main方法，开始运行 mian 方法，运行方法就要在栈里面开辟一个栈帧：
main方法的栈帧：
第一句是`User u = new User(101, "高小七")`, 

- 先执行`User u`: 定义了一个u变量（局部变量），是User类型的，目前是空
    + u = null

3. 往后走， `new User(101, "高小七")`,先调用构造函数，会开辟一个构造函数的栈帧，构造函数执行完毕之后就新建出一个User的对象：

    - 构造函数栈帧：
        + this.id = 101
        + this.name = "高小七"字符串的地址

4. 构造函数执行完成以后构造函数的栈帧就被回收了。

5. 堆内存（new User()，存放User的对象，建完之后会给你一个地址，比如 `15db9742` )存放：
    - id: 1001
    - name ："高小七"字符串的地址
    - pwd: null(构造函数没有初始化，String是引用类型，默认为null)
    - login()


7. main函数栈帧：对象创建完成之后执行赋值符号，把建好的对象赋值给`u`。
    - u = 15db9742

8. main方法往下执行，在方法区找到并执行到User.printCompany();

9. 此时开辟一个printCompany()的栈帧，打印完成后回收；

10. `User.company = "北京阿里爷爷";` 在方法区找到User.company,把 "北京阿里爷爷"的地址赋给User.company。

11. `User.printCompany();` 在方法区找到并执行到User.printCompany();

```java
public class User {
    int id;
    String name;
    String pwd;

    static String company = "北京尚学堂";

    public User(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public void login() {
        System.out.println("登录：" + name);
    }

    public static void printCompany() {
         System.out.println(company);
    }

    public static void main(String[] args) {
        User u = new User(101, "高小七");
        User.printCompany();
        User.company = "北京阿里爷爷";
        User.printCompany();
    }

}
```
![](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191209185455.png)
## static 关键字
在类中， 用static声名的成员变量为静态成员变量，也称为类变量。 类变量的生命周期和类相同，在整个应用程序执行期间都有效。

static修饰的成员变量和方法，从属于类。普通变量和方法从属于对象。

- 所以在静态方法里可以使用静态变量（静态方法和静态变量都是属于类的，都在方法区，很容易找到）；
- 但是静态方法不能调用非静态方法/普通方法（普通方法是属于对象的，类创建的时候对象还没创建，所以找不到。）
- 普通方法可以调用静态变量和静态方法。普通方法被创建的时候，静态变量和方法早就被创建了，肯定可以找到。

## 静态初始化块
**构造方法用于对象的初始化；静态初始化块，用于类的初始化操作。在静态初始化块中不能访问非static成员。**

## java参数传递机制
java中，方法中所有的参数都是 “值传递”，也就是 “传递的是值的副本”，也就是说，我们得到的是“原参数的复印件，而不是原件”。因此，复印件改变不会影响原件（前提是传递的不是地址过去。）
### - 基本数据类型参数的传递
传递的是值的副本，副本改变不会影响原件。
### - 引用类型参数得传递
传递的是值的副本，但是引用类型指的是“对象的地址”。因此，副本和原参数都指向了同一个“地址”，改变“副本指向地址对象的值，也意味着原参数指向对象的值也发生了改变。”
```java
public class User {
    int id;
    String name;
    String pwd;

    static String company = "北京尚学堂";

    public User(int id, String name) {
        this.id = id;
        this.name = name;
    }
// 这里u和u1指向的是同一个地址，改变u，u1也会跟着改。
    public void testParameterTransfer(User u) {
        u.name = "高小八";
    }
// 这里u和u1指向的也是同一个地址，但是u又重新赋值了，就指向了另一个地址。不管怎么变都不会影响u1。
    public void testParameterTransfer2(User u) {
        u = new User(200, "高三")；
    }

    public static void main(String[] args) {
        User u1 = new User(101, "高小七");
        u1.testParameterTransfer(u1);
        System.out.println(u1.name);

        u1.testParameterTransfer2(u1);
        System.out.println(u1.name);
    }
}
======>>>>   print 
“高小八”
“高小八
```

## 基本类型和引用类型
```java
int num = 10;
String str = "hello";
```
- int是基本类型，存储的是值；

- String是引用类型，存储的是地址。
![](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191209200500.png)

### 赋值号`=`的作用
```java
num = 20;
str = "java";
```
![](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191209200717.png)
- 对于基本类型 num ，赋值运算符会直接改变变量的值，原来的值被覆盖掉。

- 对于引用类型 str，赋值运算符会改变引用中所保存的地址，原来的地址被覆盖掉。但是原来的对象不会被改变（重要）。如上图所示，"hello" 字符串对象没有被改变。（没有被任何引用所指向的对象是垃圾，会被垃圾回收器回收）

 ## super父类对象引用与继承树追溯。
 构造函数的第一句永远是super(); 你不写，java会自动给你加上。

 构造函数和类的静态初始化块的调用顺序遵循继承树的上溯顺序，先从Object开始，最后执行Child：Child-->Father-->Object


```java
public class TestSuper {
     public static void main(String[] args) {
        System.out.println("开始创建一个ChildClass对象.......");

        new ChildClass().f();
     }
}
class FatherClass {
    public FatherClass() {
        // super();  构造函数的第一句永远是super(); 你不写，java会自动给你加上。
        System.out.println("创建FatherClass");
    }
    public void f() {
        value = 100;
        System.out.println("FatherClass.value=" + value)
    }
}

class ChildClass extends FatherClass {
    public ChildClass() {
        // super();
        System.out.println("创建ChildClass");
    }
    // 这里子类重写了父类的函数
    public void f() {
        super.f();  //调用父类对象的普通方法
        value = 200;
        System.out.println("ChildClass.value=" + value);
        System.out.println(value);
        System.out.println(super.value); //调用父类对象的成员变量
    }
}
===============>>>>>打印
开始创建一个ChildClass对象.......
创建FatherClass
创建ChildClass

FatherClass.value=100
ChildClass.value=200
200
100
```

## 封装：访问控制符
|修饰符|同一个类|同一个包中|子类|所有类|
|:------:|:-------:|:-----------:|:----:|:------:|
|private|\*|
|default|\*|\*|
|protected|\*|\*|\*|
|public|\*|\*|\*|\*|

1. private 表示私有， 只有自己类能访问
2. default表示没有修饰符修饰， 只有同一个包的类能访问
3. protected表示可以被同一个包的的类以及其他包中的子类访问
4. public表示可以被该项目的所有包中的所有类访问。 

### 同一个包测试private
`age`是`class Human`的一个私有变量，`class TestEncapsulation` 想要去访问私有变量时会报错：
```console
'age' has private access in 'com.ecnu.oo2.Human'
```
![](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191209215011.png)

### 子类测试private
可以看到，和上面是同一个问题。说明**子类无法使用父类的私有属性和方法。**
![](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191209215619.png)

### default不同包测试和不同包里的子类测试
可以看到，Human类是com.ecnu.oo2里定义的default类，在com.ecnu.oo包里`import`的时候报
```console
'com.ecnu.oo2.Human' is not public in 'com.ecnu.oo2'. Cannot be accessed from outside package
```
![](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191209220221.png)

把Human类修改为public以后
· Human类
```java
package com.ecnu.oo2;

public class Human {
    private int age;
    String name;

    void sayAge() {
        System.out.println(age);
    }
}
```
- `sayAge()没加修饰符，是default`在不同包下的子类测试：
```java
package com.ecnu.oo;

import com.ecnu.oo2.Human;

public class Main{

    public static void main(String[] args) {
        Human h = new Human();
//        h.age=13;
//        h.sayAge();
    }
}
class Girl extends Human {
    void sayGood() {
        super.sayAge();
    }
}

```
```console
'sayAge()' is not public in 'com.ecnu.oo2.Human'. Cannot be accessed from outside package
```

### protected不同包里的子类测试

将`Human`里的`say Age`从`default`改成`protected` 就可以在`com.ecnu.oo.Girl`里访问了。

## 封装的使用细节_javabean_
提供了属性和相应的set/get方法的，没有其他复杂操作的类可以称为javabean，就是没有复杂逻辑的简单的类。
### 类的属性的处理：
    1. 一般使用private访问权限
    2. 提供相应的get/set方法来访问相关属性，这些方法通常是public修饰的，以提供对属性的赋值与读取操作。
    3. 一些只用于本类的辅助性方法可以用private修饰，希望其他类调用的方法用public修饰 

## final关键字的作用
1. 修饰变量：被他修饰的变量不可改变（只能赋一次值），一旦赋了初值，就不能被重新赋值【就是常量】
```java
final int MAX_SPEED = 120
```
2. 修饰方法：该方法不可被子类重写，但是可以被重载！
```java
final void study() {}
```
3. 修饰类：修饰的类不能被继承。比如Math、String等
```java
final class A {}
```

## ArrayList、LinkedList、Vector
Vector底层是用数组实现的List，相关的方法都加了同步检查，因此“线程安全，效率低”
如何选用：
1. 需要线程安全时， 用Vector
2. 不存在线程安全问题时， 并且查找较多用ArrayList（一般使用这个）
3. 不存在线程安全问题时，并且增加或删除元素较多用LinkedList