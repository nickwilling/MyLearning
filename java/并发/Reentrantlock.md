# Re'entrantlock

## Java中的锁是干什么

**保证多线程下方法的同步执行**

```
A B两个线程都要访问a方法，每次只能有一个线程访问这个方法(A先访问，访问完了B访问)
a(){

}
```

### 1.使用synchronized实现方法代码同步访问

```java
public static synchronized void testSync(){
    System.out.println(Thread.currentThread().getName()+Thread.currentThread().getPriority());
    try {
        Thread.sleep(2000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}
```
**其中，下面的obj监视器锁是存在于对象头的，如果这个对象是空的就没有这个监视器了，所以必须在之前new一下！！！，不然会报空指针异常！！！**

```java
Object obj = new Object();

public static void testSync(){
    synchronized (obj){
        System.out.println(Thread.currentThread().getName()+Thread.currentThread().getPriority());
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}
```

### 2.使用锁实现同步

```java
ReentrantLock lock = new ReentrantLock();
public static void testSync(){
        lock.lock(); //对应下面的lock，可知上锁成功后可以继续向下执行，没成功就死循环直到成功再往下执行代码。
        System.out.println(Thread.currentThread().getName()+Thread.currentThread().getPriority());
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            lock.unlock();
    }
}
```

### 同步思路之CAS自旋伪代码

缺点：耗费cpu资源，一个线程拿不到锁会一直占用cpu资源进行cas操作(空转死循环)

```java
volatile int status=0; //标志---是否有线程在同步块----是否有线程上锁成功
void lock() {
    //如果上锁成功了返回true，前面加了！变成false，不会进入自旋；如果返回false，前面加了！就变成while(true)死循环了，一直自旋直到修改成功才会退出循环
    while(!compareAndSet(0,1)) { 
        
    }
    // lock
}

void unlock() {
    status=0;
}

boolean compareAndSet(int exp,int update) {
    //cas操作，修改status成功就返回true
}
```

### yield+自旋

yield能让得不到锁的线程让出cpu。

要**解决自旋锁的性能问题必须让竞争锁失败的线程不空转**，**而是在获取不到锁定的时候把cpu给让出来**，yield()方法就能让出cpu资源，当线程竞争锁失败时，会调用yield方法让出cpu。自旋锁+yield的方法并没有完全解决问题，**yield只是让有相同优先级的程序可以交替运行，也不一定达到让步的目的，因为cpu调度时还是有可能选中这个线程。**

```java
  void lock(){
        while (!compareAndSet(0,1)){
            yield();// 自己实现
        }
    }

```

### sleep+自旋

**睡眠时间时不确定的**。线程t1拿到锁执行5minute，但是没拿到锁的线程t2只是睡眠10s，也就是每10s就去看一下可不可以拿到锁。而假设t1只执行了1s，但是t2睡了10s，那就足足浪费了9s。

```java
   void lock(){
        while (!compareAndSet(0,1)){
            sleep(10);
        }
        //lock-------------5minute
    }
```

### Park+自旋

unpark调用时，如果当前线程还未进入park，则将许可设置为true;

park调用时，判断许可是否为true，如果是true，则 park 不阻塞线程，程序继续往下执行；

如果是false，则阻塞线程。

```java
Thread threadTest = new Thread(
                () -> {
                    System.out.println("thread start!");
                    LockSupport.park();
                    System.out.println("thread weakup!");
                }
        );
       threadTest.start();
        Thread.sleep(100);
        System.out.println(" from main thread");
        LockSupport.unpark(threadTest);

输出：
    thread start!
    阻塞threadTest线程
    from main thread
    唤醒threadTest线程 
    thread weakup!
   
```
**ReentrantLock通过自旋+park的方式进行锁的竞争**，竞争不到锁时加入等待队列。等待队列中的线程通过堵塞挂起的方式(park)等待锁释放的通知信号(unpark)，然后自旋的去再次竞争锁

```java
   volatile int status = 0;
   Queue parkQueue; //集合 数组 list

    void lock(){
        while (!compareAndSet(0,1)){
            park();
        }
        //lock
        ....
        unlock();
    }

    void unlock(){
        status = 0;
        lock_notify();
    }

    void park(){
        // 将当前线程加入到等待队列
        parkQueue.add(currentThread);
        // 将当前线程释放cpu，被释放cpu的线程执行到这一步就不再往下执行了，不会继续执行while
        releaseCpu()
    }

    void lock_notify(){
        // 得到要唤醒的线程头部线程
        Thread t = parkQueue.header();
        // 唤醒等待线程
        unpark(t)
    }
```

# 公平锁非公平锁 

在**公平的锁**中，如果有**另一个线程持有锁**或者**有其他线程在等待队列中等待这个锁**，那么**新发出的请求的线程将被放入到队列中**。

而**非公平锁**上，**只有当锁被某个线程持有时，新发出请求的线程才会被放入队列中**（此时和公平锁是一样的）。

所以，它们的差别在于**非公平锁会有更多的机会去抢占锁。**

公平锁要先判断自己要不要排队，只有C=0并且前面没人排队的时候才会去获取锁，前面有人就会去排队

非公平锁上来先获取锁，没获取到的时候调用非公平的nonfairTryAcquire，当c=0时再尝试获取锁，没获取到才会去排队

![img](https://img2018.cnblogs.com/blog/718929/201908/718929-20190809195059964-1524885123.png)

## 阻塞和唤醒

#### 阻塞

ReentrantLock是通过LockSupport.park()实现线程等待的，这个时候线程的状态是WAITING)。

```java
Node类
public class Node() {
	volatile Node prev;
	volatile Node next;
	volatile Thread thread;
    volatile int waitStatus;
}
```

Node类定义了节点的**先驱节点和后继节点（prev、next）**，还定义了**thread，表示一个等待锁的线程**。**waitStatus表示当前节点所处的状态**，我么可以看到有1、0、-1、-2、-3五种状态。
 1（CANCELLED）：表示当前节点被取消，通过lock()加锁的节点是不会处于这种状态的，只有通过lockInterruptibly()方法加锁才会有这种状态，因为通过lock()加锁的时候，线程是不会响应中断的，这点我们后面会详细介绍。
 0：表示节点刚被创建，是初始状态。
 -1（SIGNAL）：表示**一个节点的后继正在被阻塞 **为了避免锁的竞争，acquire()方法必须先保证节点处于SIGNAL状态，然后再去自动的获取锁，如果失败就阻塞。

acquireQueued()方法是实现ReentrantLock阻塞的关键。我们看一下具体的实现：

```java
 final boolean acquireQueued(final Node node, int arg) {
        boolean failed = true;
        try {
            boolean interrupted = false;
            for (;;) {
                final Node p = node.predecessor();
                //先获得当前节点的前驱节点p，如果p是头结点，说明前面并没有先于当前节点等待的线程，这个时候就去尝试获取锁，如果获取成功就会把头结点设置为当前节点
                if (p == head && tryAcquire(arg)) {
                    setHead(node);
                    p.next = null; // help GC
                    failed = false;
                    return interrupted;
                }
                // 前驱节点是头结点，并且 tryAcquire(arg)失败，说明前驱结点的线程正在持有锁还没有释放，或者说是前驱结点的线程持有的锁被释放了，这个时候有其他线程抢占了锁。这个时候我们就去执行shouldParkAfterFailedAcquire(p, node) 方法，这个方法的功能是判断当前节点在获取锁失败后是否需要阻塞。
                if (shouldParkAfterFailedAcquire(p, node) &&
                    parkAndCheckInterrupt())
                    interrupted = true;
            }
        } finally {
            if (failed)
                cancelAcquire(node);
        }
    }
```

如果调用shouldParkAfterFailedAcquire判断当前节点需要被阻塞，就调用parkAndCheckInterrupt()方法

```java
   //这个方法会调用LockSupport.park(this);来让当前线程进入等待状态
private final boolean parkAndCheckInterrupt() {

        LockSupport.park(this);

        return Thread.interrupted();

    }
```



#### 唤醒

释放锁的时候通过unpark来唤醒head的后继节点

```java
public final boolean release(int arg) {
    if (tryRelease(arg)) {
        Node h = head;
        if (h != null && h.waitStatus != 0)
            unparkSuccessor(h);
        return true;
    }
    return false;
}
```

