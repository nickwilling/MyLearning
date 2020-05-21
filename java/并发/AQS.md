# AQS基础概况

```java
Node类
public class Node() {
	volatile Node prev;
	volatile Node next;
	volatile Thread thread;
}
```

一个Node除了前后结点的索引外,还维护了一个Thread对象，一个int的waitStatus。
Thread对象就是处于竞争队列中的线程对象本身。
waitStatus表示当前竞争结点的状态，

```java
 AQS:
 private transient volatile Node head;
 private transient volatile Node tail;
 private volatile int state;
```

处于队首的，即Head所指向的结点，即为获取到锁的结点。释放锁即为出队，后续结点则成为队首，即获取到锁



AQS是基于CLH队列算法改进实现的锁机制。AQS内部有一个链型队列，队列结点类是AQS的一个内部类Node，形成一个类似如下Sync Queue(记住这个名词), 当我们的业务代码中的**多个线程对同一个ReentrantLock实例进行锁竞争操作时，其实际就是对同一个Sync Queue的队列进行入队、出队操作。**

![](https://upload-images.jianshu.io/upload_images/10193564-6fa9a2a666e0eb22.png?imageMogr2/auto-orient/strip|imageView2/2/w/756/format/webp)

# 独占模式

## NonFairSync非公平锁

```java
 final void lock() {
     // 先通过CAS获取锁
            if (compareAndSetState(0, 1))
                // 如果获取成功就设置当前锁的独占进程
                setExclusiveOwnerThread(Thread.currentThread());
            else
                // 否则，acquire(1)尝试获取锁，这个方法会自旋、阻塞，一直到获取锁成功为止。
                // 这个方法是忽略线程中断的。
                acquire(1);
        }
```

## acquire()

```java
public final void acquire(int arg) {
    // 先尝试获取锁tryAcquire(arg)，如果返回true，&&前面的!true=false就不用往后执行了；
      if (!tryAcquire(arg) &&
            // 如果获取失败，再调用acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            acquireQueued(addWaiter(Node.EXCLUSIVE), arg))//如果if条件成立，说明被打断过
            selfInterrupt();//如果线程在等待过程中被中断过，它是不响应的。只是获取资源后才再进行自我中断selfInterrupt()，将中断补上。
}
```

## **addWaiter()**

```java
private Node addWaiter(Node mode) {
    	   // 先将当前线程封装为Node
1：        Node node = new Node(Thread.currentThread(), mode);
2：        // Try the fast path of enq; backup to full enq on failure
3：        Node pred = tail; // node的前驱节点应该为队列的tail
           // 如果有前驱节点(有竞争线程)就用CAS入队
4：        if (pred != null) {
5：           node.prev = pred;
6：           if (compareAndSetTail(pred, node)) {
7：                pred.next = node;
8：                return node;
9：            }
10：        }
    	   // 如果前驱节点为空(竞争为空时将竞争线程入队)
11：       enq(node);
12：        return node;// 返回当前竞争的线程node
13：    }
```

**`addWaiter`返回的`node`直接作为参数给了`acquireQueued`，这个方法就是主要的`node`竞争锁方法。acquireQueued方法保证了只有头节点的后继节点才有资格去获取同步状态，如果线程可以休息了就让该线程休息然后记录下这个过程中是否被中断过**



**独占式锁每个节点自旋观察自己的前一节点是不是Header节点，如果是，就去尝试获取锁。**

![](https://img-blog.csdnimg.cn/20200308153703835.png)

​																	同步队列中节点自旋操作

![](https://img-blog.csdnimg.cn/20200308154634133.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3VuaXF1ZXdvbmRlcnE=,size_16,color_FFFFFF,t_70)

![](https://upload-images.jianshu.io/upload_images/15100432-89de513f9350e32b.png?imageMogr2/auto-orient/strip|imageView2/2/w/1079/format/webp)

​																	AQS之aquire独占式获取锁流程

##  acquireQueued

```java
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;//标记是否成功拿到资源
    try {
        boolean interrupted = false;//标记等待过程中是否被中断过
        
        //又是一个“自旋”！
        for (;;) {
            final Node p = node.predecessor();//拿到前驱
            //如果前驱是head，即该结点已成老二，那么便有资格去尝试获取资源（可能是老大释放完资源唤醒自己的，当然也可能被interrupt了）。
            if (p == head && tryAcquire(arg)) {
                setHead(node);//拿到资源后，将head指向该结点。所以head所指的标杆结点，就是当前获取到资源的那个结点或null。
                p.next = null; // setHead中node.prev已置为null，此处再将head.next置为null，就是为了方便GC回收以前的head结点。也就意味着之前拿完资源的结点出队了！
                failed = false;
                return interrupted;//返回等待过程中是否被中断过
            }
            
            //如果自己可以休息了，就进入waiting状态，直到被unpark()
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt()) //if成立则出现过中断
                interrupted = true;//如果等待过程中被中断过，哪怕只有那么一次，就将interrupted标记为true
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```

shouldParkAfterFailedAcquire这个方法传入了当前竞争结点及其前驱结点

## waitstatus

在AQS中waitstatus有五种值：

- SIGNAL 值为-1、**当前节点在入队后、进入休眠状态前，应确保将其prev节点类型改为SIGNAL，以便后者取消或释放时将当前节点唤醒。**
  - 后继节点的线程处于等待的状态、当前节点的线程如果释放了同步状态或者被取消、会通知后继节点、后继节点会获取锁并执行
- CANCELLED 值为1、因为超时或者中断，结点会被设置为取消状态，被取消状态的结点不应该去竞争锁，只能保持取消状态不变，不能转换为其他状态。处于这种状态的结点会被踢出队列，被GC回收（一旦节点状态值为1说明被取消，那么这个节点会从同

步队列中删除）

- CONDITION 值为-2、节点在等待队列中、节点线程等待在Condition、当其它线程对Condition调用了singal()方法该节点会从等待队列中移到同步队列中
- PROPAGATE 值为-3、表示下一次共享式同步状态获取将会被无条件的被传播下去（读写锁中存在的状态，代表后续还有资源，可以多个线程同时拥有同步状态）
- initial 值为0、表示当前没有线程获取锁（初始状态）

## shouldParkAfterFailedAcquire

```java
private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {

        int ws = pred.waitStatus;
        if (ws == Node.SIGNAL)
           //如果已经告诉前驱拿完号后通知自己一下，那就可以安心休息了
            return true;
        if (ws > 0) {
             /*
           * 如果前驱放弃了，那就一直往前找，直到找到最近一个正常等待的状态，并排在它的后边。
           * 注意：那些放弃的结点，由于被自己“加塞”到它们前边，它们相当于形成一个无引用链，稍后就会被保安大叔赶走了(GC回收)！
          */
            do {
                node.prev = pred = pred.prev;
            } while (pred.waitStatus > 0);
            pred.next = node;
        } else {
          //如果前驱正常，那就把前驱的状态设置成SIGNAL，告诉它拿完号后通知自己一下。有可能失败，人家说不定刚刚释放完呢！
            compareAndSetWaitStatus(pred, ws, Node.SIGNAL);
        }
        return false;
    }
```

**从`shouldParkAfterFailedAcquire`可以看出来，在确保前驱结点status为`SIGNAL`时，就可以放心的去`unsafe.park()`了。之所以要为`SIGNAL`，是因为这个状态含义为：当前结点OVER时要唤醒后继结点。**

**整个流程中，如果前驱结点的状态不是SIGNAL，那么自己就不能安心去休息，也就是只有当前驱节点为SIGNAL时，当前驱节点释放锁时会向它的后继节点发送一个signal将其唤醒。这个线程才可以进入等待状态。**

## parkAndCheckInterrupt

```java
// 用来挂起线程
private final boolean parkAndCheckInterrupt() {
        LockSupport.park(this);
        return Thread.interrupted(); //走到这里说明被唤醒了。如果被唤醒，查看自己是不是被中断的。
    }
```

# 共享模式

**在独占模式下，我们知道state的状态最初的值是0.如果某个线程获取到资源了state就加了1释放资源了就减去1。当state变为0的时候唤醒后继节点的线程，让后继节点的线程去持有资源。那么好了我们可以不可以这么干，一开始我给state设定一个值，当一个线程获取资源后，我的state就减去1，其它在来时我在减去1...以此类推，直到线程获取资源减到为0为止。表示资源没有了其他线程就无法获取了只能去等待了。这样的话多个线程就将这个state共享了，其实这就是AQS中的共享模式。**

线程调用`acquireShared`方法获取锁
如果失败则创建共享类型的节点放入FIFO队列，等待唤醒
有线程释放锁后唤醒队列最前端的节点，然后唤醒所有后面的共享节点

## AQS acquireShared方法

acquireShared方法是AQS共享模式的入口。

首先看能不能直接获得资源，也就是执行tryAcquireShared(arg)方法，如果没有取得资源，则返回是负数，如果取得了资源但是后续的资源可以再进行获取则返回的是0，如果返回的是正数，那么代表着获取成功并且还有剩余资源，别的线程也能进行获取。Ps：tryAcquireShared方法需要子类自己去实现。

```java
   public final void acquireShared(int arg) {
        //获取共享锁，小于0表示资源没有了，则放入队列，挂起线程
        if (tryAcquireShared(arg) < 0)
            doAcquireShared(arg);
    }
```

在调用`tryAcquireShared`小于零后调用`doAcquireShared`

## doAcquireShared

这个方法和独占模式的acquireQueued方法差不多，流程就是

1. 在队列尾部添加共享模式节点
2. 前一个节点如果是head并且tryAcquireShared>=0则替换当前节点为head,并唤醒后面所有共享模式节点
3. 如果前一个节点不是head，则挂起当前线程

```java

    private void doAcquireShared(int arg) {
        //添加一个共享节点到同步队列尾部
        final Node node = addWaiter(Node.SHARED);
        boolean failed = true;
        try {
            //是否中断
            boolean interrupted = false;
            for (; ; ) {
                //获取当节点的前驱节点
                final Node p = node.predecessor();
                if (p == head) {
                    //如果前驱节点时头接节点的话，再次尝试获取资源，r代表的是剩余资源
                    int r = tryAcquireShared(arg);
                    if (r >= 0) {
                        //大于0获取到了就要检查还有没有资源，有的话设置头节点并唤醒下一个节点共享节点
                        setHeadAndPropagate(node, r);
                        p.next = null;
                        if (interrupted) {
                            selfInterrupt();
                        }
                        failed = false;
                        return;
                    }
                }
                if (shouldParkAfterFailedAcquire(p, node) &&
                        parkAndCheckInterrupt()) {
                    interrupted = true;
                }
            }
        } finally {
            if (failed) {
                cancelAcquire(node);
            }
        }
    }

```

## setHeadAndPropagate

这个方法主要完成两件事，设置头节点head以及在一定条件下唤醒后继Node。还记得这节最开始说过，共享锁模式不仅会在释放锁成功后唤醒后继Node，在获取锁成功时也会唤醒后继Node，所以setHeadAndPropagate方法会在两个不同的地方被调用，我们具体看代码

```java
 
    private void setHeadAndPropagate(Node node, int propagate) {
        //记录当前头结点
        Node h = head; // Record old head for check below
        //把当前获取到锁的节点设置为头结点
        setHead(node);
        ////propagate>0表示还有资源可以获取，后面的节点也需要唤醒
        //  h.waitStatus < 0 表示节点是可唤醒状态
        if (propagate > 0 || h == null || h.waitStatus < 0 ||
            (h = head) == null || h.waitStatus < 0) {
            Node s = node.next;
            //后继节点为空或者是共享模式则唤醒
            if (s == null || s.isShared())
                doReleaseShared();
        }
    }
```

setHead(node)表示为把node设置为head结点，然后如果当前node获取完资源还有剩余（**propagate>0，代表剩余资源的数目**）的话，就去唤醒后继的结点。如果当前头结点的waitStatus是<0，意味着它是SINGAL和Propagate，那么也去唤醒后继结点。如果头结点为空（可能在其它线程中被释放了），那么也唤醒后继结点来获取资源。

那么此时，s作为传进来的结点的后继结点，执行if (s == null || s.isShared())的判断，如果s为空（当前结点为空的话，当然要找后继结点）或者s是shared模式的话，也要唤醒后继结点，则执行doReleaseShared()方法去唤醒后继。

## 共享锁的释放releaseShared

```java
public final boolean releaseShared(int arg) {
    if (tryReleaseShared(arg)) {
        doReleaseShared();
        return true;
    }
    return false;
}
可以看到，就两个方法，其中第一个方法tryReleaseShared的方法是子类复写的方法，返回值为boolean，如果失败，则直接跳到最后返回false；否则就返回true，然后进入if分支调用doReleaseShared方法来唤醒后继Node。
```

## doReleaseShared唤醒操作

```java
    /**
     * Release action for shared mode -- signals successor and ensures
     * propagation. (Note: For exclusive mode, release just amounts
     * to calling unparkSuccessor of head if it needs signal.)
     */
    private void doReleaseShared() {
        
        for (;;) {
            //从头节点开始
            Node h = head;
             //如果头节点不为空，又不是尾节点的话
            if (h != null && h != tail) {
                int ws = h.waitStatus;
                //是需要被唤醒的状态
                if (ws == Node.SIGNAL) {//head是SIGNAL状态
           /* head状态是SIGNAL，重置head节点waitStatus为0，这里不直接设为Node.PROPAGATE,
            * 是因为unparkSuccessor(h)中，如果ws < 0会设置为0，所以ws先设置为0，再设置为PROPAGATE
            * 这里需要控制并发，因为入口有setHeadAndPropagate跟release两个，避免两次unpark
            */
                    if (!compareAndSetWaitStatus(h, Node.SIGNAL, 0))
                        continue;   //设置失败，重新循环
            /* head状态为SIGNAL，且成功设置为0之后,唤醒head.next节点线程
             * 此时head、head.next的线程都唤醒了，head.next会去竞争锁，成功后head会指向获取锁的节点，
             * 也就是head发生了变化。看最底下一行代码可知，head发生变化后会重新循环，继续唤醒head的下一个节点
             */
                    unparkSuccessor(h);
                }
                   /*
         * 如果本身头节点的waitStatus是出于重置状态（waitStatus==0）的，将其设置为“传播”状态。
         * 意味着需要将状态向后一个节点传播
         */
                else if (ws == 0 &&
                         !compareAndSetWaitStatus(h, 0, Node.PROPAGATE))
                    continue;                
            }
            //如果if条件成立，即h == head，说明在t1执行doReleaseShared方法期间没有其他线程执行了setHead方法，所以t1可以退出自旋for循环
            if (h == head)                   
                break;
        }
    }
```

# 总结

可以看出，共享模式与独占模式最大的不同就是，**共享模式唤醒第一个节点后会迭代唤醒后面所有的共享节点。**

共享模式的资源获取与释放主要在于将资源预**先初始化一定数目**，然后各个线程去获取特定数量的资源，**在获取资源时如果资源还有剩下就唤醒后继节点继续获取**，知道资源没有剩余，其他资源只能进入等待状态。释放时做了操作资源和唤醒下一个节点的操作。

