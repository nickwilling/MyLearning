# RabbitMQ

## 架构

<img src="C:\Users\wwl\Documents\学习\MyLearning\Kafka\images\261319-20180912090830511-1702198991.png" alt="img" style="zoom:67%;" />

如上图所示，集群中有两个节点，每个节点上有一个broker，每个broker负责本机上队列的维护，并且borker之间可以互相通信。集群中有两个队列A和B，**每个队列都分为master queue和mirror queue（备份）**

有的consumer连在master queue所在节点，有的连在非master queue节点上。**consumer和producer所有的读写操作都要在maser上**。即使consumer连接到了非master queue节点，该consumer的操作也会**被路由到master** queue所在的节点上，这样才能进行消费。

生产也一样，如果连接的是mirror也必须要路由到master才能生产。

<img src="C:\Users\wwl\Documents\学习\MyLearning\Kafka\images\1198522-20190605184210713-1436545971.png" alt="img" style="zoom:50%;" />

- Broker:它提供一种传输服务,它的角色就是维护一条从生产者到消费者的路线，保证数据能按照指定的方式进行传输, 
- Exchange：消息交换机,它指定消息按什么规则,路由到哪个队列。 
- Queue:消息的载体,每个消息都会被投到一个或多个队列。 
- Binding:绑定，它的作用就是把exchange和queue按照路由规则绑定起来. 
- Routing Key:路由关键字,exchange根据这个关键字进行消息投递。 

# Kafka

Kafka是一个分布式的**基于发布/订阅模式的消息队列**，是一个中间件，主要应用于大数据实时处理领域。

**Kafka是用Scala写的。**

## MP的好处

- 解耦

  - 本来客户端的请求都要依赖于服务端来处理，有了mq以后，客户端和服务端的耦合变小，服务端只要从消息队列里拿任务一个个处理就好了。两个系统不必同时在线，服务端就算挂了也可以在消息队列里取消息处理。

    <img src="C:\Users\wwl\Documents\学习\MyLearning\Kafka\images\image-20200425154651576.png" alt="image-20200425154651576" style="zoom:50%;" />

- 异步

  - 消息队列允许用户把一个消息放入队列，但并不立即处理它。想向队列中放入多少消息就放多少，然后在需要的时候再去处理。
  - 如果是同步处理，没有采用MQ，用户并发访问直接爆了服务器

  <img src="C:\Users\wwl\Documents\学习\MyLearning\Kafka\images\image-20200425154404320.png" alt="image-20200425154404320" style="zoom:50%;" />

- 流量销峰

  - 缓冲
    - 控制和优化数据流经过系统的速度，解决生产消息和消费消息的处理速度不一致的情况
  -  灵活性&峰值处理
    - 访问量剧增的情况下应用仍然需要发挥作用，但是这种突发流量并不常见，使用消息队列能够使关键 组件顶住突发的访问压力，而不会因为突发的超负荷的请求而完全崩溃。

## 消息队列的两种模式（消息队列的消息是有时限的）

（1） 点对点模式（一对一，**消费者主动拉取数据**，消息收到后消息清除）【A发的消息只能给B处理，如果想给C处理就要再发一个消息】

消息生产者生产消息发送到Queue，然后消息消费者从Queue中取出并且消费消息。消息被消费后，queue中不再有存储，所以消费者不可能消费到已经被消费的消息。Queue支持存在多个消费者，但是对一个消息而言，只会有一个消费者可以消费。

![image-20200425160530474](C:\Users\wwl\Documents\学习\MyLearning\Kafka\images\image-20200425160530474.png)

- 发布/订阅模式也分两种情况：

  - 第一种是消费者主动去拉取消息，消费者的消费速度由消费者自己决定【Kafka采用这种方式】

    - 存在的问题是，消费者要采用轮询的方式去获取新消息
    - 有一个长轮询比较浪费资源

  - 第二种是由队列主动推送给消费者，消费者的消费速度由队列的处理速度决定，存在的问题是：

    - 消费者消费的速度可能不一样，但是队列推的速度是一样的
    - 会造成资源分配不均【资源浪费或资源不足】

    

![image-20200425160958197](C:\Users\wwl\Documents\学习\MyLearning\Kafka\images\image-20200425160958197.png)

## Kafka架构

![image-20200425170707573](C:\Users\wwl\Documents\学习\MyLearning\Kafka\images\image-20200425170707573.png)

- Kafka是一个集群
- broker【经纪人】：一台kafka服务器就是一个broker，由这些broker组成了kafka集群。一个broker可以容纳多个topic
- topic【主题】，相当于把消息分类。不能什么信息都往kafka这个消息队列里面存没有分类，这样消费者都不知道取什么消息了。
  - 1、主题是有分区的
  - 2、每个分区是有副本的
  - 3、副本分leader和follower

-  partition【分区】：负载均衡，提高并发。为了实现扩展性，一个非常大的topic可以分布到多个broker上，**一个topic可以分为多个partition，每个partition都是一个有序的队列**
- Replica：副本，为保证集群中的某个节点发生故障时，**该节点上的partition数据不丢失，且kafka仍然能够正常工作。**一个topic的每个分区都有若干个副本，**一个leader和若干个follower。**
  - leader：生产者和消费者都是去找leader
  - follower：实时从leader中同步数据，保持和leader数据的同步。follower仅仅是提供备份作用，如果leader故障可以替代其功能，成为新的leader
- follower【分区的follower】，相当于备份，一个分区的leader和follower不可能在一台电脑上。 生产者或者消费者找消息的时候都是去找leader，follower仅仅是提供备份作用，如果leader挂了可以替代其功能
- 消费者组（consumer group ）：**消费者组内每个消费者负责消费不同分区的数据，一个分区 只能由一个组内消费者消费；消费者组之间互不影响。消费者组是逻辑上的一个订阅者。**
  - 同一个分区的数据【partition】同时只能被同一个组里面的某一个消费者消费，不能同时给一个组的两个消费者。提高消费能力 和并发
  - 同一个分区的数据可以同时被不同组的消费者消费
  - **同一组的消费者数目不能高于主题的分区数，会造成消费者资源浪费，最好两个数目相等，处理能力最大**。

- zookeeper
  - 1、帮助kafka集群存储信息（只要kafka注册的zookeeper是同一个就可以形成集群）
  - 2、帮助消费者存储消费到的位置信息（比方说一台机器宕机了，重启的时候要从zk里获取处理到的消息的位置以接着消费）
    - 0.9版本之前offset【消费的消息的偏移量】存储在zk，0.9之后的版本存储在kafka本地。

# Kafka和RabbitMQ的区别

 RabbitMQ的不足：由于master queue单节点，导致性能瓶颈，吞吐量受限。虽然为了提高性能，内部使用了Erlang这个语言实现，但是终究摆脱不了架构设计上的致命缺陷。

Kafka看到了RabbitMQ这个缺陷才设计出的一个改进版，改进的点就是：把一个队列的单一master变成多个master，即一台机器扛不住qps，那么我就用多台机器扛qps，把一个队列的流量均匀分散在多台机器上不就可以了么？注意，多个master之间的数据没有交集，即一条消息要么发送到这个master queue，要么发送到另外一个master queue。

这里面的每个master queue 在Kafka中叫做Partition，即一个分片。一个队列有多个主分片，每个主分片又有若干副分片做备份，同步机制类似于RabbitMQ。