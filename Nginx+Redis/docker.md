## 容器关闭了以后重开，并设置交互模式打开的过程

1. exit 关闭容器
2. `docker ps -a/-l`找到刚刚关掉的容器的ID
3. `docker start ID`
4. `docker attach ID`

## Why docker

- 更轻量：基于容器的虚拟化，仅包含业务运行所需的 `runtime环境`， CentOS/Ubuntu基础镜像仅170M；宿主机可部署100~1000个容器【也就是说，我可以以一台装了docker的服务器作为宿主机，在宿主机上装它100个CentOS不就变成了100个节点了】

- 更高效：无操作系统虚拟化开销

  - 计算：轻量，无额外开销

  - 存储：系统盘aufs/dm/overlayfs；数据盘volume

  - 网络：宿主机网络，NS隔离

- 更敏捷、更灵活
	- 分层的存储和包管理， devops理念
	- 支持多种网络配置

鲸鱼背上有集装箱

- 蓝色的大海----宿主机系统Windows/Linux/Mac

- 鲸鱼----- docker

- 集装箱------ 容器实例	from 镜像模板

  

docker的主要目标是“Build， Ship and Run Any App, Anywhere”， 也就是通过对应用组件的封装、分发、部署、运行等生命周期的管理，使用户的APP（也可以使一个WEB应用或数据库应用等）及其运行环境能够做到**一次封装，到处运行。**

![](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191219105232.png)

将应用运行在Docker容器上面，而Docker容器在任何操作系统上都是一致的，这就实现了跨平台、跨服务器。**只要一次配置好环境，换到别的机子上就可一键部署好，大大简化了操作。**

## Docker和虚拟机的不同

- 虚拟机时虚拟出一套硬件后，在其上运行一个完整的操作系统，在该系统上再运行所需应用进程；
- 容器与虚拟机不同，不需要捆绑一整套操作系统，只需要软件工作所需的库资源和设置。
- 容器内的应用进程直接运行于宿主的内核，容器内没有自己的内核，**而且也没有进行硬件虚拟。**因此容器要比传统虚拟机更为轻便 
- 每个容器之间互相隔离，每个容器有自己的文件系统，容器之间进程不会相互影响，能区分计算资源。

![虚拟机与docker架构对比图](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191219152630.png)

##  Docker的三要素

**Docker**本身是一个容器运行载体或者称之为管理引擎。我们把应用程序和配置依赖打包好形成一个可交付的运行环境。这个打包好的运行环境就是**image镜像**文件。只有通过这个镜像文件才能生成**Docker容器**。**image**文件可以看作是容器的模板。**Docker**根据 **image** 文件生成容器的实例。 同一个**image**文件，可以生成多个同时运行的容器实例。

镜像和容器的关系类似于面向对象编程中的类(image)和对象(Container)。

- 镜像(image)：就是一个**只读**的模板。镜像可以用来创建Docker容器，**一个镜像可以创建很多容器。**
- 容器(Container):是用镜像创建的运行实例。【在Docker里就是一个个的集装箱】
  - 一个容器运行一种服务，当我们需要的时候，就可以通过 **docker客户端** 创建一个对应的运行实例，也就是我们的容器。
  - 它可以被启动、开始、停止、删除。每个容器都是相互隔离的、保证安全的平台。
  - **可以把容器看作是一个简易版的Linux环境**(包括root用户权限、进程空间、用户空间和网络空间等)和**运行在其中的应用程序**
- 仓库(Repository)：是**集中存放镜像**文件的场所，需要的时候从仓库中pull下来就可以了。
  - 最大的公开仓库是 Docker Hub。
  - 国内的公开仓库包括阿里云、网易云等。

![docker的架构图](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191219112351.png)

## 阿里云加速

 **容器镜像服务** ---->> **镜像加速器** 

- 配置镜像加速器

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://xxxxxx.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

- 查看镜像源

  ```shell
  docker info
  ```

  

## Docker HelloWorld

```shell
[root@localhost ~]# docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
1b930d010525: Pull complete
Digest: sha256:4fe721ccc2e8dc7362278a29dc660d833570ec2682f4e4194f4ee23e415e1064
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

```

## Docker Daemon

 Daemon是Docker的守护进程，Docker Client通过命令行与Docker Damon通信，完成Docker相关操作 

## Docker常用命令

- docker run

![](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191219151613.png)

### 镜像命令

- `docker images`：列出镜像
  - `docker images -q` : 列出镜像的id
- `docker search`： Search the Docker Hub for images
  - `docker search -f/--filter stars=30 tomcat`以stars为条件来搜索
- `docker pull tomcat:latest/指定版本` :Pull an image or a repository from a registry
- `docker rmi -f image:latest`         Remove one or more images
  - 删除全部镜像 `docker rmi -f $(docker images -q)` 【管道命令，先列出id，再根据id把镜像删除】
- `docker rm container`    :  Remove one or more containers

### 容器命令

- 下载镜像：`docker pull centos` :下一个centos镜像

- 新建并启动容器：**docker run -it --name mycentos01 centos**

  - 参数

    - -d: 后台运行容器，并返回ID， 也即启动守护式容器；

    - -i：以交互模式运行容器，通常与-t同时使用
    - -t：为容器重新分配一个伪输入终端，通常与-i同时使用；
    - -P：随机端口映射
    - -p：指定端口映射，有以下四种形式
      - ip:hostPort:containerPort
      - ip::containerPort
      - hostPort:containerPort
      - containerPort

-  列出所有**正在运行**的容器

  - docker ps [OPTIONS]
  - docker ps -q 只显示容器编号，可以和docker rm结合使用删除所有容器

- 退出容器
  - exit：容器停止退出
  - ctrl+P+Q：容器不停止退出

- 启动容器
  - docker start 容器ID或者容器名
- 重启容器
  - docker restart 
- 停止容器
  - docker stop
- 强制停止容器
  - docker kill
- 删除已停止的容器：
  - docker rm / 未停止 docker -f rm
  - 一次性删除多个容器 `docker rm -f $(docker ps -aq)`

#### 守护式容器

使用镜像centos:latest以后台启动模式启动一个容器

`docker run -d centos \\后面跟命令`

问题：使用`docker pa -a` 进行查看，发现容器已经退出

`docker run -it centos ` \\-it会给容器分配一个伪终端，效果与

`docker run -it centos /bin/bash` 一致，这里的\bin\bash就是容器运行容器里的 */bin/bash* 程序，也就是运行终端

很重要的要说明的一点：**Docker容器后台运行，就必须要有一个前台进程**
```shell
wwl@wuweilins-MBP ~ % docker run -it --name mycentos centos tail
| \\这里容器不退出，一直运行
```

容器运行的命令如果不是那些**一直挂起的命令（比如运行top，tail）**，就是会自动退出的。比如下面运行的就是pwd就不是一直挂起的命令，运行完容器就退出了
```shell
wwl@wuweilins-MBP ~ % docker run -it --name mycentos centos pwd 
/
wwl@wuweilins-MBP ~ % 

```

这是docker的机制问题

- 查看容器日志：`docker logs -f -t --tail 容器ID`
  - -t ：加入时间戳
  - -f 跟随最新的日志打印
  - --tail 数字 显示最后多少条
- 查看容器内运行的进程：`docker top 容器ID`

- 进入正在运行的容器并以命令行交互

  - `docker exec -it 容器ID bashShell` 直接进入容器启动命令的终端，不会启动新的进程

    ```shell
    
    [root@localhost ~]# docker exec -it efebabb9f63d ls -l /tmp
    total 8
    -rwx------ 1 root root 1379 Sep 27 17:13 ks-script-0n44nrd1
    -rwx------ 1 root root  671 Sep 27 17:13 ks-script-w6m6m_20
    [root@localhost ~]# 
    ```

    

  - `docker attach 容器ID`： 是在容器中打开新的终端，并且可以启动新的进程

    ```shell
    [root@localhost ~]# docker attach efebabb9f63d
    [root@efebabb9f63d /]# 
    ```

- 从容器内拷贝文件到主机上

  - `docker cp efebabb9f63d:/tmp/yum.log /root` 将efebabb9f63d容器下的/tmp/yum.log文件cp到/root目录

## Docker镜像原理

### UnionFS（联合文件系统）

是一种分层、轻量级并且高性能的文件系统，它支持**对文件系统的修改作为一次提交来一层层叠加**

Union文件系统是Docker镜像的基础。镜像可以通过分层来进行继承，基于基础镜像（没有父镜像），可以制作各种具体的应用镜像。

### 为什么tomcat有400多M而centos只有200m

![image-20191219175555130](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\image-20191219175555130.png)

### Docker镜像为什么要采用这种分层结构呢

最大的一个好处就是----共享资源

比如：有多个镜像都从相同的base镜像构建而来，那么宿主机只需在磁盘上保存一份base镜像，

同时内存中也只需加载一份base镜像们就可以为所有容器服务了。

而且镜像的每一层都可以被共享。

## 容器数据卷

- 容器之间希望有可能共享数据

- 将docker容器运行产生的数据持久化。

- 为了能保存数据在docker中我们使用卷。

卷就是目录或文件，存在于一个或多个容器中，由docker挂载到容器，但不属于联合文件系统，因此能够绕过联合文件系统提供一些用于**持续存储**或**共享数据**的特性：

卷的设计目的就是数据的持久化，完全独立于容器的生存周期，因此Docker不会在容器删除时删除其挂在的数据卷。

特点：

1. 数据卷可在容器之间共享或重用数据
2. 卷中的更改可以直接生效
3. 数据卷中的更改不会包含在镜像的更新中
4. 数据卷的生命周期一直存续到没有容器使用它为止

### 添加数据卷 -v【volumn卷】

- 命令直接添加：
  - `docker run -it -v /宿主机绝对路径目录:/容器内目录 镜像名`

**这是容器内的目录**

```shell
[root@d0c5cc8d52b9 /]# ls -l
total 0
lrwxrwxrwx   1 root root   7 May 11  2019 bin -> usr/bin
drwxr-xr-x   5 root root 360 Dec 19 12:46 dev
drwxr-xr-x   1 root root  66 Dec 19 12:46 etc
drwxr-xr-x   2 root root   6 May 11  2019 home
lrwxrwxrwx   1 root root   7 May 11  2019 lib -> usr/lib
lrwxrwxrwx   1 root root   9 May 11  2019 lib64 -> usr/lib64
drwx------   2 root root   6 Sep 27 17:13 lost+found
drwxr-xr-x   2 root root   6 May 11  2019 media
drwxr-xr-x   2 root root   6 May 11  2019 mnt
drwxr-xr-x   2 root root   6 May 11  2019 opt
dr-xr-xr-x 224 root root   0 Dec 19 12:46 proc
dr-xr-x---   2 root root 162 Sep 27 17:13 root
drwxr-xr-x  11 root root 163 Sep 27 17:13 run
lrwxrwxrwx   1 root root   8 May 11  2019 sbin -> usr/sbin
drwxr-xr-x   2 root root   6 May 11  2019 srv
dr-xr-xr-x  13 root root   0 Dec 19 12:46 sys
drwxrwxrwt   7 root root 145 Sep 27 17:13 tmp
drwxr-xr-x  12 root root 144 Sep 27 17:13 usr
drwxr-xr-x  20 root root 262 Sep 27 17:13 var
```

**这是宿主机的目录**

```shell
[root@localhost ~]# ll
总用量 11792
-rw-------. 1 root root     1715 8月   6 19:23 anaconda-ks.cfg
drwxr-xr-x. 3 root root       30 11月  6 17:07 Desktop
drwxr-xr-x. 2 root root        6 8月  19 03:06 Documents
drwxr-xr-x. 2 root root       81 11月  6 13:35 Downloads
drwxr-xr-x. 2 root root        6 12月  2 21:22 go
-rw-r--r--. 1 root root    13871 12月 17 20:05 go.sh
-rw-r--r--. 1 root root    13871 12月 17 20:06 go.sh.1
-rw-r--r--. 1 root root       81 1月  12 2010 index.html
-rw-r--r--. 1 root root     1763 8月   6 11:26 initial-setup-ks.cfg
drwxr-xr-x. 2 root root        6 8月  19 03:06 Music
drwxr-xr-x. 8 root root     4096 12月  2 21:23 ngrok
drwxr-xr-x. 2 root root        6 8月  19 03:06 Pictures
drwxr-xr-x. 2 root root        6 8月  19 03:06 Public
drwxr-xr-x. 2 root root        6 8月  19 03:06 Templates
drwxr-xr-x. 2 root root        6 12月 17 20:06 v2ray
-rw-rw-r--. 1 wwl  wwl  12022827 12月 17 20:09 v2ray-linux-64.zip
drwxr-xr-x. 2 root root        6 8月  19 03:06 Videos
```

**此时，宿主机没有/myDataVolume，容器也没有/dataVolumeContainer文件**

执行：`docker run -it -v /myDataVolumn:/dataVolumeContainer centos`

分别查看目录，可以看到

- 容器多了`dataVolumnContainer文件`

```shell
[root@3b53ac73d2cc /]# ls -l
total 0
lrwxrwxrwx   1 root root   7 May 11  2019 bin -> usr/bin
// 容器多了`dataVolumnContainer文件`
drwxr-xr-x   2 root root   6 Dec 19 12:52 dataVolumeContainer
drwxr-xr-x   5 root root 360 Dec 19 12:52 dev
```

- 宿主机多了myDataVolume

```shell
drwxr-xr-x.   2 root root    6 4月  11 2018 media
drwxr-xr-x.   2 root root    6 4月  11 2018 mnt
// 宿主机多了`myDataVolume`
drwxr-xr-x    2 root root    6 12月 19 20:52 myDataVolume
```

### 查看是否挂载成功 

`docker inspect 容器ID` 以JSON文件查看docker的信息

```json
 "Mounts": [
            {
                "Type": "bind",
                "Source": "/myDataVolume",
                "Destination": "/dataVolumeContainer",
                "Mode": "",
                "RW": true,
                "Propagation": "rprivate"
            }
```

### 容器和宿主机之间数据共享

不管在容器内还是在宿主机内修改了建立挂载关系的文件夹，另一个文件夹也会跟着变的。

### 容器停止推出后，主机修改后数据也是同步的

### 命令带权限

`docker run -it -v /myDataVolumn:/dataVolumeContainer:ro centos`

- ro[read-only]

### 容器间传递共享

- --volumes-from list : Mount volumes from the specified container(s)
- docker run -it --name dc01 centos  // 父容器 dc01

- docker run -it --name dc02 --volumes-from dc01 centos		   

## 使用docker安装tomcat

- docker hub上面查找tomcat镜像  --- docker search tomcat
- 从docker hub 上拉取tomcat镜像到本地 --- docker pull tomcat
- docker images 查看是否有拉取到到的tomcat --- tomcat images

- 使用tomcat镜像创建容器（也叫运行镜像）--- docker run -it -p 8080:8080 tomcat

### docker运行tomcat命令

映射端口：

- `docker run -d -p 9080:8080 --name mytomcat tomcat`

添加容器卷:

```shell
docker run -d -p 9080:8080 --name mytomcar
-v /tomcat/test:/usr/local/tomcat/webapps/test
-v /tomcat/tomcatlogs:/usr/local/tomcat/logs
tomcat
```

privileged参数:

使用该参数，container内的root拥有真正的root权限。
否则，container内的root只是外部的一个普通用户权限。
privileged启动的容器，可以看到很多host上的设备，并且可以执行mount。
甚至允许你在docker容器中启动docker容器。 

```shell
docker run -d -p 9080:8080 --name mytomcar \
-v /tomcat/test:/usr/local/tomcat/webapps/test \
-v /tomcat/tomcatlogs:/usr/local/tomcat/logs \
--privileged=true \
tomcat
```

### 开启交互运行

`docker exec -it 容器ID /bin/bash`

```shell
root@localhost tomcat]# docker exec -it fae6a31facd2 /bin/bash
root@fae6a31facd2:/# ls -l
total 8
drwxr-xr-x   2 root root 4096 Nov 18 00:00 bin
drwxr-xr-x   2 root root    6 Sep  8 10:51 boot
drwxr-xr-x   5 root root  340 Dec 20 06:22 dev
drwxr-xr-x   2 root root    6 Nov 23 01:48 docker-entrypoint-initdb.d
lrwxrwxrwx   1 root root   34 Nov 23 01:49 entrypoint.sh -> usr/local/bin/docker-entrypoint.sh
drwxr-xr-x   1 root root   66 Dec 20 06:22 etc
drwxr-xr-x   2 root root    6 Sep  8 10:51 home
drwxr-xr-x   1 root root   30 Nov 18 00:00 lib
drwxr-xr-x   2 root root   34 Nov 18 00:00 lib64
drwxr-xr-x   2 root root    6 Dec 20 06:22 logs
drwxr-xr-x   2 root root    6 Nov 18 00:00 media
drwxr-xr-x   2 root root    6 Nov 18 00:00 mnt
drwxr-xr-x   2 root root    6 Nov 18 00:00 opt
dr-xr-xr-x 226 root root    0 Dec 20 06:22 proc
drwx------   1 root root   24 Nov 23 01:48 root
drwxr-xr-x   1 root root   20 Nov 23 01:49 run
drwxr-xr-x   2 root root 4096 Nov 18 00:00 sbin
drwxr-xr-x   2 root root    6 Nov 18 00:00 srv
dr-xr-xr-x  13 root root    0 Dec 19 12:47 sys
drwxrwxrwt   1 root root    6 Dec 20 06:23 tmp
drwxr-xr-x   1 root root   19 Nov 18 00:00 usr
drwxr-xr-x   1 root root   41 Nov 18 00:00 var
```



## 安装mysql

```shell
docker run -p 3306:3306 --name mysql \
-v /wwl/mysql/conf:/etc/mysql/conf.d \
-v /wwl/mysql/logs:/logs \
-v /wwl/mysql/data:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=123456 \
-d mysql
```

## 安装Redis

- 使用镜像

```shell
docker run -p 6379:6379 \
-v /wwl/myredis/data:/data \
-v /wwl/myredis/conf/redis.conf:/usr/local/etc/redis/redis.conf \
-d redis \
redis-server /usr/local/etc/redis/redis.conf \
--appendonly yes  //持久化 aof文件，--后面的都是配置文件的设置
--requirepass "12345678" //设置密码
```

- 在主机`/wwl/myredis/conf/redis.conf`目录下新建redis.conf文件

  - `vim /wwl/myredis/conf/redis.conf/redis.conf`

- 测试redis-cli链接

  - 
	```shell
	[root@localhost ~]# docker exec -it 18bd12301dd6 redis-cli
    127.0.0.1:6379>
  ```

- 测试持久化文件生成

```shell
[root@localhost data]# cat /wwl/myredis/data/appendonly.aof
*2
$6
SELECT
$1
0
*3
$3
set
$2
k1
$2
v1
*3
$3
set
$2
k2
$2
v2
```



