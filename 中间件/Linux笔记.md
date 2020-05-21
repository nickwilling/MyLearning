##       如果要运行一个文件方法：

* 路径（绝对路径/相对路径）+文件名  home/wwl/work/my_date
* 直接输入文件名my_date(前提是这个文件的目录要添加在PATH环境变量中【记录了查找路径，输入了命令后会去这些目录下面查找】)**Export这个命令只在本次登录shell命令有效！！！export PATH=$PATH:/home/wwl/work/**
  *  命令 “**Export PATH=$PATH**:路径”可以把这个路径加入环境变量，但是**退出这个命令行就失效**了。要想**永久生效**，需要把这行添加到环境变量文件里。有两个文件可 选**:“/etc/profile**”和用户主目录下的“**.bash_profile**”。
  * “/etc/profile”对系统里所有用户都有效。
    * vim /etc/profile
      /export PATH //找到设置PATH的行，添加
      export PATH=/usr/local/mongodb/bin:$PATH
      生效方法：系统重启/输入**source /etc/profile**命令
      有效期限：永久有效
      用户局限：对所有用户
  * 用户主目录下的“.bash_profile”只对这个用户有效。加上之后，输入 **source ~/.bash_profile**命令来执行变量，使他生效 

### 软件的安装位置：

#### 	Linux distribution发布安装的软件大多安装在/usr里面；

####     用户自行安装的软件建议放置在/**usr/local** 里面。一般man和info会去搜索usr/local/man里面的说明文件，因此，如果我们将软件安装在/usr/local下，安装完成后，该软件的说明文件自然可以被找到。

#### 	源码（Tarball）建议放置在/usr/local/src（src为source的缩写）下面



### 切换身份：su - wwl,此时exit后就从wwl用户z切换回root了

### Linux bc 命令

Basic Calculator（bc）

默认是仅输出整数，可以用**scale=3** 输出为3位小数

quit退出

### Ctrl+c命令

中断目前的程序。

### Ctrl+d

离开文字界面，相当于输入exit

### “who”命令

要关机时查看哪些用户在线

### netstat -a

查看网络的联机状态

### ps -aux

查看后台执行的程序

## Linux的文件权限与目录配置

### 用户和用户组

在Linux里，任何一个文件都具有User、Group以及Others3种身份的个别权限

* 默认情况下所有的系统上的账号与一般用户身份，还有root账户的相关信息都记录在/etc/passwd文件内

* 个人的密码记录在/etc/shadow文件下

* Linux所有的组名都记录在/etc/group内

这三个文件可以说是Linux系统里面账号、密码、用户组信息的集中地。

****

### Linux文件属性

![1571980730787](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\1571980730787.png)

![1571980802529](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\1571980802529.png)

* 第一列 第一位  **-** 是文件；**d** 是目录

* 第二列 连接
* 第三列 所有者
* 第四列 用户组
* 第五列 文件容量（大小默认为B）
* 第六列 修改日期
* 第七列 文件名 

****

****

### 改变文件属性与权限

* chgrp：改变文件所属用户组 **chgrp [-R] 用户组名称 文件或目录 	chgrp users install.log**

  * chown：改变文件所有者 **chown [-R] 账号名称 文件或目录	chown bin install.log**

* chmod：改变文件的权限  **a代表all**

  * 1. **数字类型改变文件权限**

       **r:4  w:2  x:1** 如果要将install.log的权限改成“-rwxrwxrwx”就是 4+2+1 4+2+1 4+2+1

       * **chmod 777 install.log**
  
       如果要将文件变成可执行文件，并且不要让他人修改文件的话就需要"**-rwxr-xr-x**"这样的权限
       
       * **chmod 755** **filename**
       
       如果有些文件你不希望被别人看到，权限为“**-rwxr-----**” **chmod 740 filename** 
    
  * 2. 符号类型改变文件权限
  
       假设将文件权限修改为“**-rwxr-xr-x**” **chmod u=rwx ,go=rx install.log** 或 **u=rwx,g=rx,o=rx**
  
       假设不知道文件原本的权限，希望所有人都可以增加写入的权限**chmod [u/g/o/a]+w filename**
  
       全部人都去掉可执行的权限 **chmod a-w filename**

****

### 目录与文件的权限意义

![image-20191102100856031](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\image-20191102100856031.png)

* <u>文件的x权限</u>**在Linux系统下，文件是否能被执行是由是否具有x这个权限来决定的，与windows下的扩展名不同。**

* <u>目录的x权限</u>**表示用户是否能进入该目录成为工作目录**

  * 例子：“**drwxr--r--	3	root	root	4096	Jun 25 08:35	.ssh**” 

    vbird用户不属于root用户组，vbird对此目录有r的权限，因此vbird可以查询此目录下的文件名列表[但不能读取详细的文件名列表，有一堆问号？？？？？权限不够]，但是不能切换到此目录内。因为没有x权限

****

### 目录树架构

![img](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572834623&di=198f3ad49c9a2d95cf4db304baf864ad&imgtype=jpg&er=1&src=http%3A%2F%2Fimages.cnblogs.com%2Fcnblogs_com%2Fxkfz%2F201203%2F201203022229448515.png)



****

### 复制文件或目录：

**cp [-adfilprsu] source destination**

**cp [options] source1 source2 source3 ... directory**

不能直接复制目录，需要递归复制：

cp -r /etc /tmp[-r会改变文 件与目录的权限]

或者 cp -a /etc /tmp [-a archive归档、存档，相当于备份，和源文件一模一样]

****

###  删除【移除】文件或目录

**rm [-fir]	文件或目录**

	* f：force，强制删除，忽略不存在的文件，不会出现警告
	* i：interact，互动模式，在删除前会询问用户是否操作，默认
	* r： recursive，递归删除，最常用在目录的删除。<u>这是非常危险的参数</u>

删除目录不为空的文件夹时，会一直问你是不是要删除，如果不想继续按y可使用反斜杠忽略指定参数。

\rm -r /tmp/etc

****

### 文件内容查阅

* cat：由第一行开始显示文件内容
* tac：从最后一行开始显示，为cat的倒写
* head：只看头几行 **默认前10行****head -n 20 /etc/man.config** 显示前20行
* tail：只看结尾几行

****

### 修改文件时间或创建新文件：touch

【atime access time访问时间、ctime status time状态修改时间，比方说权限的修改】

**[ll = ls - l] **  **ll bashrc;  ll --time=atime bashrc; ll --time=ctime bashrc**

分号代表连续执行命令

****

### 文件与目录的默认权限与隐藏权限

root想将~/.bashrc复制给wwl，又担心覆盖掉~wwl/.bashrc。并且文件是root需要将拥有者变为wwl

* **cp ~/.bashrc ~wwl/bashrc**
* 修改own：**chown wwl:users ~wwl/bashrc** 

**例2**：

在/tmp下面新建一个目录，这个目录名称为chapter7_1,并且这个目录的所有者为wwl，用户组为users，此外，任何人都可以进入该目录浏览文件，不过除了wwl以外，其他人不能修改该目录下的文件。

**经分析，整个目录的权限应该是 drwxr-xr-x=755**

* 新建目录：**mkdir /tmp/chapter7_1**
* 修改属性： **chown -R wwl:users /tmp/chapter7_1**
* 修改权限：**chmod -R 755 /tmp/chapter7_1**

****

### 文件默认权限umask

umask：**目前用户在新建文件或者目录的时候的权限默认值**:文件的默认属性是666，目录是777与umask相减

**umask	输出0022** ****022:意思是user的rwx不拿掉任何权限，group和other拿掉了w

umask - S	输出u=rwx,g=rx,o=rx

修改默认权限umask：**umask 002** 这样**文件**的默认权限就是**-rw-rw-r--**目录：**drwxrwxr-x**

****

### 文件隐藏属性chattr，lsattr

**chattr（change attribution设置文件的隐藏属性）**

**chattr [+-=] [ASacdistu] 文件或目录名称**

* +：增加某一个特殊参数，其他原本存在的参数则不动
* -：删除。。。
* =：仅有后面接的参数
* <u>a：设置a之后，这个文件将只能增加数据，而不能删除也不能修改数据，只有root才能设置这个属性。</u>
  * **chattr +i attrtest**【给予attrtesti的属性】
  * **chattr -i attrtest**将i属性取消
* <u>i：可以让一个文件“不能被删除、改名，设置连接也无法写入或添加数据。”“对系统安全性有相当大的帮助”。</u>

**lsattr（显示文件隐藏属性）**

**lsattr [-adR] 文件或目录**

* -a:将隐藏文件的属性也展示出来
* -d：如果接的是目录，仅列出目录本身的属性而并非目录内的文件名
* -R：连同子目录的数据也一并列出来

****

### 查看文件类型：file【文件的类型是由文件的内容决定的不是由后缀决定】

想知道某个文件的基本数据，例如是属于ASCII或者是data文件，或者是binary

**file ~/.bashrc**

****

### 命令与文件的查询

* 脚本文件名的查询
  
* which 【-a】 command **which ifconfig** **输出：/sbin/ifconfig**
  
* 文件名的查找

  * whereis(寻找特定文件) whereis [-bmsu] 文件或目录名 **whereis passwd**
  
* locate: **locate [-i忽略大小写的差异r后面可接正则表达式的显示方式] keyword** 
  
* **find [PATH] [option] [action]** 
  
    > mkdir src
    >
    > find /usr/src -name "*.c" -exec cp {} /src  \;
    >
    > ll src
    
    * > **find /usr/src/ -name "*.c" -exec wc -l {} \;**  
    >
    > * -exec后面就是动作；**wc（wordCount） -l**是一个用来统计行数的命令；
      > * **{}匹配一次每次find匹配的结果，每次将一行文件名放入{}中；
      > *  **\;**---将；转义，代表命令的结束。
      > * 要执行find出来的所有文件的统计行数的命令
    
    * 统计find到多少条命令
    
      > 1. 第一种方式（生成中间文件）find /usr/src/ -name "*.c" >> count  ；wc -l count ; rm count     	<==   **>> count 是将标准输出以追加重定向的方式添加到count文件中**
      > 2. 第二种方式（使用管道） find /usr/src/ -name "*.c" | wc -l
    
    * **与用户有关的参数**
    
      *  user name:name 用户账户名称
      * group name:name 用户组名
      * nouser：寻找文件的所有者不存在/etc/passwd的人
      * nogroup：不存在于/etc/group的文件
      * 示例：查找/home下面属于wwl的文件(用这个命令将所有属于某个用户的文件找出来)
        *  **find /home -user wwl**
      * 示例：查找系统中不属于任何人的文件 **find / -nouser**
    
    * 与文件权限及名称有关的参数
      * -name filename：查找文件名为filename的文件**find -name passwd**
      * -size [+-] SIZE:查找比SIZE还要大[+]或小[-]的文件。c：代表byte；k：代表1KB
      * -type TYPE:类型主要有一般文件(f)、设备文件(b/c)、目录(d)、连接文件(l)、socket(s)
        * find /var -type s -	【**find . -type f -name "1"**】
      * -perm mode：查找文件权限刚好 等于 mode的文件
      * -perm +mode
      * -perm -mode

****

### 文件的特殊权限：SUID，SGID，SBIT

**s与t都是代替x的**，就是文件的拥有者暂时具有root权限，暂时有权限给其他人设置。

**4为SUID（SetUID，SUID不是用在目录上**，**用于设置文件**）

**2为SGID（SetGID）**

**1为SBIT（SBIT不是用于文件上 。Sticky Bit用于设置目录）**

**SetUID：	假设要将一个文件权限修改为-rwsr-xr-x时，由于s在用户权利中，所以是SUID**

	* 这样修改：**chmod 4755 filename来修改**

chmod 7777 filename，最后权限是-rw<u>s</u>rw<u>s</u>rw<u>t</u>

## Linux磁盘与文件系统管理

### 磁盘与目录的容量：df，du 

df: Disk free  空余硬盘

du: Disk usage 硬盘使用率

**df [-ahikHTm] [目录或文件名]**:列出文件系统的整体磁盘使用量

-h：以人们较易阅读的GB、MB、KB等格式自动显示；

-k：使用KB表示

-m：使用MB表示

-i：不使用硬盘容量，而以inode的数量来表示。

![1572267443203](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\1572267443203.png)

**du：评估文件系统的磁盘使用量（常用于评估目录所占容量）**

**du [-ahskm] 文件或目录名称**

-h、-k、-m:同上

-s：列出总量而已，不列出每个个别的目录占用总量

-S：列出目录下的全部数据

![1572268311612](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\1572268311612.png)

### 连接文件：Symbolic link（符号连接，相当于windows的快捷方式）

**ln [-sf] 源文件 目标文件**

<u>-s：如果不加任何参数连接就是hard link，s就是symbolic link</u>

-f:如果目标文件存在时，就主动将目标文件直接删除后再创建

**ln -s /etc/crontab ~/crontab2**

![1572268917606](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\1572268917606.png)

![1572269842074](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\1572269842074.png)

​								正常的连接文件颜色时蓝色的，当连接到的文件被删除后连接就断了，颜色变红

**关于目录的连接数量**

当新建目录时，会有三个东西：

**/tmp/testing**

**/tmp/testing/.**

**/temp/testing/..**

testing=testing/. 所以，当新建一个目录时，**新的目录的连接数为2，而上层的连接数会增加1**

![1572270314217](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\1572270314217.png)



### 磁盘分区：fdisk

先找到磁盘叫什么名字

**df /**---->/dev/sda

**fdisk [options] -l disk：list partition tables**

**fdisk /dev/sda** :可以删除分区、新建分区

### 磁盘格式化:mkfs(make file system)

**mkfs [-t 文件系统格式] 设备文件名**   **mkfs -t ext3 /dev/sda7**

-t：文件系统格式，例如ext3，ext2，vfat等

**mkfs [tab] [tab]**

![1572332544873](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\1572332544873.png)

​							发现mkfs支持的文件格式如上

### 挂载与卸载:mount:挂载；umount-卸载(卸载挂载点只能去掉挂载点，硬盘还是在的，不会被删除)----[mount之后重启还要再mount，所以可以通过修改/etc/fstab设置开机自动挂载]

**fdisk -l**：列出U盘文件名，并挂载到/mnt/flash目录中

**mkdir /mnt/flash**

**mount /dev/sdb4 /mnt/flash**

#### 卸载 umount[-fn] 设备文件名或挂载点

****

### 内存交换空间（swap）

* swap**的功能就是在应付物理内存不足的情况下所造成的内存扩展记录的功能**
  * CPU所读的数据都来源于内存，当内存不足的情况下，为了让后续的程序可以顺利运行，内存中暂时不用的程序与数据就会被挪到swap中。此时内存就会空出来给需要执行的程序加载。
  * 由于swap是用硬盘来暂时放置内存中的信息，所以用到swap时，主机硬盘灯会闪个不停

****

### 磁盘的使用必须要经过分区、格式化与挂载。分别惯用的命令为fdisk、mkfs、mount

例子：独立一个文件系统挂载在/srv/myproject目录下。让这个文件系统每次开机都能够自动挂载到/srv/myproject上，且该目录是给project这个组共享的，其他人不可具有任何权限2770，5G

1. **fdisk /dev/sda**创建一个新的分区
2. 新建完毕后，开始进行格式化操作：**mkfs -t ext3 /dev/sda6**
3. 新建挂载点：**mkdir /srv/myproject**
4. 编写自动挂载的配置文件‘**nano /etc/fstab**’在最后增加一行 **/dev/sda6 /srv/myproject ext3 defaults 1 2**
5. 测试自动挂载：**mount -a**,然后使用‘**df**’查看有无挂载
6. 设置权限：<u>chgrp project /srv/myproject</u> **chmod 2770 /srv/myproject**

****

## 文件与文件系统的压缩与打包

Linux下面的扩展名时没有什么特殊的意义的，但是Linux支持的压缩命令非常多，且不同的压缩命令所用的压缩技术并不相同，彼此之间可能无法相互压缩/解压文件。所以压缩文件会有后缀名来帮助我们了解使用的是什么压缩命令。

### Linux常用的压缩命令：

* ~~***.Z**	compress程序压缩的文件；~~
* <u>***.gz**   gzip程序压缩的文件；</u> 常见
* <u>***.bz2** bzip2程序压缩的文件；</u> 常见
* ***.tar** tar程序打包的数据，**并没有压缩过**
* ***.tar.gz** tar程序打包的文件，其中**经过gzip的压缩**
* ***.tar.bz2** tar程序打包的文件，其中**经过bzip2的压缩**

**gzip和bz2只能对一个文件压缩与解压，tar是打包软件；将目录或者很多文件“打包”成一个文件，无压缩功能**

### gzip [-cdtv#] 文件名

* -c:将压缩的数据输出到屏幕上，可通过数据流重定向来处理
* -d：解压缩的参数；
* -t：可以用来检验一个压缩文件的一致性，看文件有无错误。
* -v：可以显示出源文件/压缩文件的压缩比等级
* -#：压缩等级，1-9，-1最快，压缩比最差，-9最慢；压缩比最好默认是-6。

#### 压缩：gzip -v man.config

#### 解压缩：

* **gzip -d man.config.gz** #与gzip相反，gzip -d 会将原本的.gz删除，产生原本的man.config文件。

*   Linux压缩保留源文件的方法：
  **gzip -c filename > filename.gz**

  Linux解压缩保留源文件的方法：
  **gunzip filename.gz > filename** 或者  **gzip -c -d filename.gz > filename**  

### bzip2：bzip2[-cdkzv#] 文件名。压缩比比gzip好，但用法一样

-k:保留源文件而不会删除源文件

-z:压缩的参数

-d：解压的参数

压缩并保留源文件：**bzip2 -k services** or **bzip2 -c services>services.bz2**

解压并保留源文件：**bzip2 -k -d services.bz2** or **bunzip2 -k services.bz2** or 

**bunzip2 -c  services.bz2>services** or **bunzip2 -k services.bz2** 

### 打包命令tar

tar [-j|-z] [cv] [-f 新建的文件名] filename 《==打包与压缩

tar [-j|-z] [tv] [-f 新建的文件名]				《==查看文件名

tar [-j|-z] [xv] [-f 新建的文件名] [-C 目录]《==解压缩

参数：

* -c：新建打包文件，可搭配-v来查看过程中被打包的文件名（filename）

* -t： 查看打包文件的内容有那些文件名，重点在查看文件名
* -x：解压缩，可搭配-C在特定目录解开
* -j： 通过bzip2的支持进行压缩/解压缩，此时文件名最好为*.tar.bz2
* -z：通过gzip的支持进行压缩/解压缩，此时文件名最好为*.tar.gz
* -v：在压缩/解压缩的过程中，将正在处理的文件名显示出来
* -f filename： -f后面要接被处理的文件名。建议-f单独写一个参数
* -C：目录：这个参数用在解压缩时，若要在特定目录解压缩，可以使用这个参数
* -p(小P)：保留备份数据的原本权限与属性，常用于备份重要的配置文件
* -P(大P)：保留绝对路径，即允许备份数据中含有根目录存在之意

#### 最简单的tar使用：

* 压缩：tar -jcv -f filename.tar.bz2 要被压缩的文件或目录的名字【**c：create**】**[v:verbose详细显示]**

  ![image-20191102102721205](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\image-20191102102721205.png)

  * **tar -zpcv -f /root/etc.tar.gz /etc my_date**
  * **tar -jpcv -f /root/etc.tar.bz2 /etc**

* 查询：tar -jtv -f filename.tar.bz2(压缩中的小p参数没有将根目录复制过来)【**t：list**】

  * **tar -jcv -f /root/etc.tar.bz2**

    ![1572352713425](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\1572352713425.png)

    * 如果压缩命令是**tar -jpPcv -f /root/etc.tar.bz2 /etc**就会将根目录（绝对路径一起保留）

    ![1572352852768](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\1572352852768.png)

* 解压缩：tar -jxv -f filename.tar.bz2 -C 欲解压的目录**【x：extract解压**】
  * **tar -jxv -f /root/etc.tar.bz2; ll**此时该打包文件会在本目录下进行解压缩

  * **tar -jxv -f /root/etc.tar.bz2 -C /tmp** 此时会在/tmp目录下进行解压缩。

### vim程序编辑器

#### vi与vim

#### vi的使用【vi共分为3种模式，分别为一般模式、编辑模式与命令行模式】

* **一般指令模式**：以vi打开一个文件就进入一般模式，在这个模式中，可以上下左右**移动光标**，可以**删除**字符或删除整行，也可以**复制、粘贴**你的文件数据
* **编辑模式**：**一般指令模式中**可以**进行删除、复制、粘贴**等操作，但是**无法编辑文本内容**。要等按下“**i,I,o,O,a,A,r,R**”等任何一个字母才会进入编辑模式，在界面的左下角出现INSERT或REPLACE的字样。此时才可以进行编辑。如果要**回一般模式**必须按下【**esc**】键退出**编辑模式**
* **命令行模式**：在一**般指令模式**中，输入“**：、/、？**”三个这个中的任意一个按钮，就可以将光标移动到最下面那行。在这个模式中，**可进行数据查找功能**。**读取、保存、大量替换字符、离开vi、显示行号**

![1572355451755](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\1572355451755.png)

### 离开vi：

**：q退出**
**：wq写入后保存退出**

**：wq！强制写入后退出**

**：q！强制退出，不保存修改的内容**

### Vi案例

* 删除所有内容 dG
* 跳到一行末尾$
* 自动补全 ctrl+p

* 设置行号【**:set nu**】

* 取消行号：【**:set nonu**】

* 移动到最后一行 **一般模式下按G**

* 移动到第一行：**1G/gg**

* 移動到第 43 行，向右移動 59 個字符:**[43G    59[->]]**

* 查找gzip字符串：**/gzip**

* dd:删除整行

* 20dd：向下删除20行

* yy：复制光标所在的那一行

* 剪切：按v选中后按下x

* p，P： p将 复制的数据粘贴在光标的下一行，P复制在光标的上一行

* u：复原前一个操作【ctrl+z】

* ctrl+r 重做上一个操作【ctrl+y】

* 将文件重命名[**:w man.test.config**]  [:w [filename]]

  ### 区块选择

| 区块选择 |                                        |
| -------- | :------------------------------------- |
| v        | 字元選擇，會將游標經過的地方反白選擇！ |
| V        | 列選擇，會將游標經過的列反白選擇！     |
| [Ctrl]+v | 區塊選擇，可以用長方形的方式選擇資料   |
| y        | 將反白的地方複製起來                   |
| d        | 將反白的地方刪除掉                     |
| p        | 將剛剛複製的區塊，在游標所在處貼上！   |

### Vim常用命令

![image-20191030102848555](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\image-20191030102848555.png)

### 认识与学习bash

### 在变量的设置中单引号和双引号的不同：双引号仍然可以保有变量的内容，但单引号内仅能是一般字符而不会有特殊符号

### 变量的显示与设置：echo、unset

显示：echo $name

设置：用等号设置 **myname=WWL** **变量内容如果有空格引号等特殊字符，可用“”将变量内容结合起来**

取消变量：unset myname

![image-20191030124108650](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\image-20191030124108650.png)

#### 变量累加

* **PATH=$PATH:/home/bin**
* **myname=${myname}yes** 或者 **myname="$myname"yes**

 ![image-20191030125731201](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\image-20191030125731201.png)

## 软件安装：源码与Tarball

### gcc：Linux上的C语言编译程序

### make与configure

make:将编译过程的命令简单化

**make**是一个程序，会在当前的目录下搜索makefile这个文本文件，而makefile里面则记录了源码如何编译的详细信息。

**configure**：软件开发商会写一个检测程序来检测用户的**操作环境（大家用的Distribution版本不同）**，以及该操作环境是否有软件开发商所需要的其他功能，该检测程序检测完毕后，就会 **主动新建这个makefile的规则文件** <u>通常这个检测程序的文件名为**configure**或者是**config**</u>

![image-20191031110611202](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\image-20191031110611202.png)

 

### 什么是Tarball的软件

所谓的Tarball文件，其实就是将软件的所有源码文件先以tar打包，然后再以压缩技术来压缩，通常最常见的就是**gzip**。因为用了tar和gzip，**所以tarball文件一般的扩展名就会写成*.tar.gz或者是简写为 *.tgz**

Tarball是一个软件包，将其解压之后，里面的文件通产有:

* **源代码文件**
* **检测程序文件（可能是configure或config等文件名）**
* **本软件的简易说明（INSTALL或README）【最重要】**

#### 更新的方法分为两大类：

1. **直接以源码通过编译来安装与升级（Tarball）；**
2. **直接以编译好的二进制程序来安装与升级**（包括RedHat的**RPM软件管理机制与yum在线更新模式**；Debain使用的**dpkg软件管理机制与APT在线更新模式**）

#### 如何安装Tatball

1. 将Tarball由厂商的网页下载下来
2. 将Tarball解压缩，生成很多的源码文件；
3. 开始以gcc进行源码的编译（会生成目标文件）；
4. 然后以gcc进行函数库、主程序、子程序的链接，以形成主要的二进制文件；【**因为有时候源码不是只有一个文件的，会有程序间的调用或者调用了外部的函数库（加入链接的函数库）**】
5. 将上述的二进制文件以及相关的配置文件安装至自己的主机上面。

上面第3、4步骤当中，我们可以通过make这个命令的功能来简化它。所以你至少需要**gcc和make**这两个软件在你的Linux系统上面才行。

### 使用传统程序语言进行gcc编译的简单范例

![image-20191031134056867](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\image-20191031134056867.png)

* 在上面这个例子中，如果我们以gcc编译源码，并且没有加上任何参数，则**执行文件的文件名会被自动设置为a.out这个文件名**hello.c就是源码，而gcc就是编译程序，至于a.out就是编译成功的可执行文件。

* 但是如果我们想要产生**目标文件（object file）来进行其他操作，而且生成的可执行文件的文件名也不要用a.out命名就可以：** 
  * **gcc -c hello.c** [-c就是编译，会生成同名.o目标文件] -c：编译或汇编源文件, 但是不作连接. 编译器输出对应于源文件的目标文件
  * **gcc -o hello hello.o**[通过目标文件编译生成可执行文件hello]    
    * -o file
      指定输出文件为 file. 如果没有使用-o选项，默认的输出结果是：可执行文件为a.out
  * **./hello** 执行可执行文件会输出Hello World。

### 用make进行宏编译（make会自动判断每个目标文件相关的源码文件，并直接编译，最后再直接进行链接的操作）

makefile的规则：

```
`標的(target): 目標檔1 目標檔2   gcc -o 欲建立的執行檔 目標檔1 目標檔2`
```



###  RPM(RedHat Package Management)与SRPM（Source RPM）

RPM：最大的特点：将你要安装的软件先编译过，并且打包成为RPM机制的安装包，通过包装好的软件里头默认的数据库记录这个软件要安装的时候必须具备的依赖软件，当安装时，RPM会先依照软件里头的数据查询Linux的主机的依赖属性软件是否满足，若满足则予以安装，若不满足则不予安装。**优点**是：

* **由于已经编译完成并且打包完毕，所以软件传输与安装很方便（不需要再重新编译）**
* **由于软件的信息都已经记录在Linux主机的数据库上，很方便查询、升级与反安装**

**问题是：**

* **软件安装的环境必须与打包时的环境需求一致或相当**
* **需要满足软件的依赖属性需求（解决方法：YUM在线升级安装）**
* **反安装时需要特别小心，最底层的软件不可先删除，否则可能造成整个系统的问题**

### <u>所以真的要安装其他distribution提供的好用的RPM软件时，可以使用SRPM。SRPM所提供的软件内容并没有经过编译，它提供的是源代码</u>

通常SRPM的扩展名是以<u>***.src.rpm</u> 来命名的。

### SRPM与Tarball和RPM的区别：SRPM虽然提供的是源代码，但是仍然含有该软件所需要的依赖性软件说明以及所有RPM文件所提供的数据。与RPM的区别是提供了参数设置文件（configure与makefile）SRPM安装步骤：

* 先将该软件以RPM管理的方式编译，此时SRPM会被编译成RPM文件
* 然后将编译完成的RPM文件安装到Linux系统

![image-20191031161617215](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\image-20191031161617215.png)

### RPM默认安装的路径：/var/lib/rpm/下面的数据库进行安装对比

#### RPM安装：**rpm -ivh package_name**

-i：install

-v：查看更详细的安装信息画面

-h：以安装信息栏显示安装进度

```
範例一：安裝原版光碟上的 rp-pppoe 软件
rpm -ivh /mnt/Packages/rp-pppoe-3.11-5.el7.x86_64.rpm

範例三、直接由網路上面的某個檔案安裝，以網址來安裝：
[root@study ~]# rpm -ivh http://website.name/path/pkgname.rpm
```

#### RPM查询：rpm -qa   <==已安装软件



### 利用yum进行查询、安装、升级与移除功能

*  查詢功能：yum【list|info|search|provides|whatprovides】参数

  ​	yum [option] [查詢工作項目] [相關參數]

```
[option]：主要的選項，包括有：
  -y ：當 yum 要等待使用者輸入時，這個選項可以自動提供 yes 的回應；
  --installroot=/some/path ：將該軟體安裝在 /some/path 而不使用預設路徑
[查詢工作項目] [相關參數]：這方面的參數有：
  search  ：搜尋某個軟體名稱或者是描述 (description) 的重要關鍵字；
  list    ：列出目前 yum 所管理的所有的軟體名稱與版本，有點類似 rpm -qa；
  info    ：同上，不過有點類似 rpm -qai 的執行結果；
  provides：從檔案去搜尋軟體！類似 rpm -qf 的功能！
```

​       查询可安装的python：yum -list python

* 安 装/升级功能：yum 【install|update】 软件
* 删除：yum remove 软件  



