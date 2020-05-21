# ThreadLocal

- 每个Thread有一个ThreadLocalMap对象threadLocals

  - ```java
    Thread.ThreadLocal.ThreadLocalMap threadLocals = null;
    ```

- ThreadLocalMap里有长度为16的Entry数组

  - ```java
    private static final int INITIAL_CAPACITY = 16;
    private Entry[] table;
    ```

- ThreadLocal 的set方法：**首先获取到了当前线程t**，然后**调用getMap获取当前Thread对象的ThreadLocalMap**，如果map存在，则**将当前ThreadLocal对象作为key(每一个key对应了table中的索引i)，要存储的对象作为value存到map里面去。**如果该Map不存在，则初始化一个。

  - ```java
    public void set(T value) {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null)
            map.set(this, value);
        else
            createMap(t, value);
    }
    ```

- 对于某一ThreadLocal来讲，他的索引值i是确定的，在不同线程之间访问时访问的是不同的table数组的同一位置即都为table[i]，只不过这个不同线程之间的table是独立的。

- 对于同一线程的不同ThreadLocal来讲，这些ThreadLocal实例共享一个table数组，然后每个ThreadLocal实例在table中的索引i是不同的。



## ThreadLocal的key和value

**ThreadLocal里有一个ThreadLocalMap内部类，可以看成是一个map，这个map的key就是当前的ThreadLocal实例，value就是要存的值。实际上这个map里面维护了一个长度为16的entry数组table，通过对key hash可以获取key在table中存储的索引。**

## **ThreadLocal内存泄漏问题**

**由于ThreadLocalMap的生命周期跟Thread一样长，如果没有手动删除对应key的value就会导致内存泄漏，**

**解决：每次使用完ThreadLocal，都调用它的remove()方法，清除数据。**

在使用线程池的情况下，没有及时清理ThreadLocal，不仅是内存泄漏的问题，更严重的是可能导致业务逻辑出现问题。所以，使用ThreadLocal就跟加锁完要解锁一样，用完就清理。

![img](https://pic1.zhimg.com/80/v2-91a1ee865e422015c3f872b75aecce3c_720w.jpg)

## ThreadLocal父子线程传递

ThreadLocal是线程变量，每个线程都有自己的ThreadLocalMap，是线程隔离的。

**在子线程中，可以获取到父线程的InheritableThreadLocal类型变量的值，而不能获取到ThreadLocal类型变量的值**

```java
public class ThreadLocalDemo {
    static InheritableThreadLocal<String> local = new InheritableThreadLocal();
    public static void main(String[] args) {
        local.set("22222");
        System.ou  t.println(local.get());
        new Thread(()->{
            System.out.println(local.get());
        }).start();
    }
}
输出：
    22222
    22222
如果是ThreadLocal和话，输出：
    22222
    null
```