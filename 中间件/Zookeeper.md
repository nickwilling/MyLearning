## Zookeeper工作机制
从设计模式来看，Zookeeper是一个基于观察者模式设计的分布式服务管理框架，它 **负责存储和管理大家都关心的数据**，然后**接受观察者的注册**，一旦这些数据的状态发生变化，Zookeeper就将**负责通知已经在Zookeeper上注册的那些观察者**做出相关的反应。

<img src="/Volumes/MAC文件/MyLearning/中间件/images/image-20200521113014130.png" alt="image-20200521113014130" style="zoom: 33%;" />

## 特点

<img src="/Volumes/MAC文件/MyLearning/中间件/images/image-20200521113347112.png" alt="image-20200521113347112" style="zoom:50%;" />

1. 一个领导者(Leader)，多个跟随者(Follower)组成的集群
2. 集群中只要有半数以上的节点存活，集群就能正常工作
3. 全剧数据一致：每个Server保存一份相同的数据副本，Client无论连接到哪个Server，数据都是一致的。
4. 更新请求顺序进行。来自同一个Client的更新请求按其发送顺序一次执行
5. 数据更新原子性，一次数据更新要么成功，要么失败
6. 实施性，在一定时间范围内，Client能读到最新的数据

## 数据结构

Zookeeper的数据结构与Unix文件系统很类似，整体上可以看作一棵树，每个节点称作一个ZNode。每个ZNode默认能够存储1MB的数据，每个ZNode都可以通过其路径唯一标识。

<img src="/Volumes/MAC文件/MyLearning/中间件/images/image-20200521113711862.png" alt="image-20200521113711862" style="zoom:50%;" />

## 应用场景

提供的服务包括：统一命名服务、统一配置管理、统一集群管理、服务器节点动态上下线、软负载均衡等。

# 内部原理

## 选举机制（面试重点）

1. 半数机制：集群中半数以上机器存活，集群可用。所以zookeeper适合安装奇数台服务器
2. Zookeeper虽然在配置文件中没有指定Master和Slave。但是，Zookeeper工作时，是有一个节点为Leader，其他则为Follower，Leader是通过内部选举的机制临时产生的。
3. 简单例子说明：

假设有5台服务器组成的Zookeeper集群，它们的id从1-5，同时他们都是最新启动的，也就是没有历史数据，在存放数据量这一点上都是一样的。假设这些服务器依次启动，如下图：

<img src="/Volumes/MAC文件/MyLearning/中间件/images/image-20200521113347112.png" alt="image-20200521113347112" style="zoom:50%;" />

- 服务器1启动，给自己投票，然后发投票信息，由于其它机器还没有启动所以它收不到反馈信息，服务器1的状态一直属于Looking(选举状态)。
- 服务器2启动，给自己投票，同时与之前启动的服务器1交换结果，由于服务器2的编号大所以服务器2胜出，但此时投票数没有大于半数，所以两个服务器的状态依然是LOOKING。
- 服务器3启动，给自己投票，同时与之前启动的服务器1,2交换信息，由于服务器3的编号最大所以服务器3胜出，**此时投票数正好大于半数，所以服务器3成为领导者**，服务器1,2成为小弟。
- 服务器4启动，给自己投票，同时与之前启动的服务器1,2,3交换信息，尽管服务器4的编号大，但之前服务器3已经胜出，所以服务器4只能成为小弟。
- 服务器5启动，后面的逻辑同服务器4成为小弟。

## 节点类型

持久节点：客户端和服务器断开连接后，创建的节点不删除

短暂节点：客户端和服务器断开连接后，创建的节点自己删除

## 监听器原理(面试重点)

![](https://img-blog.csdnimg.cn/20181129152427184.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d4MTUyODE1OTQwOQ==,size_16,color_FFFFFF,t_70)

（1）在Zookeeper的API操作中，创建main()主方法即主线程；

（2）在main线程中创建Zookeeper客户端（zkClient），这时会创建两个线程：

         线程connet负责网络通信连接，连接服务器；
    
         线程Listener负责监听；

（3）客户端通过connet线程连接服务器；

         图中getChildren("/" , true) ，" / "表示监听的是根目录，true表示监听，不监听用false

（4）在Zookeeper的注册监听列表中将注册的监听事件添加到列表中，表示这个服务器中的/path，即根目录这个路径被客户端监听了；

（5）一旦被监听的服务器根目录下，数据或路径发生改变，Zookeeper就会将这个消息发送给Listener线程；

（6）Listener线程内部调用process方法，采取相应的措施，例如更新服务器列表等。