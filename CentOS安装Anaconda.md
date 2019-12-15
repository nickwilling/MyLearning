记录一下一个Linux菜鸡第一次安装Anaconda3。

先贴上Anaconda的[官网](https://www.anaconda.com/)

本着要下就下最新版的宗旨，我本来想直接在虚拟机上面直接下的，结果网速实在是不给力。于是选择了现在windows下面开科学上网下好，再通过sftp传到本地虚拟机上，速度还是很快的。

下完以后的到一个`Anaconda3-2019.10-Linux-x86_64.sh`文件

**纵所周知, sh文件在Linux上面是可以直接运行的,而Linux自带的sh是bash**

```shell
sudo bash /tmp/Anaconda3-2019.10-Linux-x86_64.sh
```

运行后跳出来如下界面, 按照提示**按Enter**

> Welcome to Anaconda3 2019.10In order to continue the installation process, please review the license
> agreement.
> Please, press ENTER to continue
>
> \>\>\> 

接下来会出现一堆的License,一直按enter,跳出来

>Do you accept the license terms? [yes|no]
>**按yes**

接下来会提示

> Anaconda3 will now be installed into this location:
> /root/anaconda3
>
>  - Press ENTER to confirm the location
>   - Press CTRL-C to abort the installation
>   - Or specify a different location below

**千万不要直接安装在root目录这里,安装到这里我一想不对劲啊,前面的安装命令不应该加sudo的,这样不就给我所有的用户都安装了嘛,但我只想给wwl这个用户安装啊**



于是我又运行了一遍,这次不加sudo了,直接

```shell
bash /tmp/Anaconda3-2019.10-Linux-x86_64.sh
```

果然,这次变成了wwl用户的主目录下

> Anaconda3 will now be installed into this location:
> /home/wwl/anaconda3
>
>   - Press ENTER to confirm the location
>   - Press CTRL-C to abort the installation
>   - Or specify a different location below
>
> [/home/wwl/anaconda3] >>> 

**我输入了我想要安装在```/home/wwl/software/anaconda3```目录下**

>[/home/wwl/anaconda3] >>> /home/wwl/software/anaconda3
>PREFIX=/home/wwl/software/anaconda3
>Unpacking payload ...
>Collecting package metadata (current_repodata.json): done                                                                                                                                                       
>Solving environment: done
>/## Package Plan ##
>environment location: /home/wwl/software/anaconda3

这样就开始安装了

> Preparing transaction: done
> Executing transaction: done
> installation finished.
> Do you wish the installer to initialize Anaconda3
> by running conda init? [yes|no]
> [no] >>> 
> You have chosen to not have conda modify your shell scripts at all.
> To activate conda's base environment in your current shell session:
>
> eval "$(/home/wwl/software/anaconda3/bin/conda shell.YOUR_SHELL_NAME hook)" 
>
> To install conda's shell functions for easier access, first activate, then:
>
> conda init
>
> If you'd prefer that conda's base environment not be activated on startup, 
> set the auto_activate_base parameter to false: 
>
> conda config --set auto_activate_base false
>
> Thank you for installing Anaconda3!
>
> ===========================================================================
>
> Anaconda and JetBrains are working together to bring you Anaconda-powered
> environments tightly integrated in the PyCharm IDE.
>
> PyCharm for Anaconda is available at:
> https://www.anaconda.com/pycharm



但是如下说,要激活你的conda的base环境需要输入第二条命令.

```shell
To activate conda's base environment in your current shell session:
eval "$(/home/wwl/software/anaconda3/bin/conda shell.YOUR_SHELL_NAME hook)" 
```

于是我就按照提示输入,这里把YOUR_SHELL_NAME改成bash

```
eval "$(/home/wwl/software/anaconda3/bin/conda shell.bash hook)" 
```

出现了如下结果,说明base环境已经被激活了

> (base) [wwl@localhost ~]$

按照下面的提示, 要安装conda的shell命令需要在activate以后输入 conda init

> To install conda's shell functions for easier access, first activate, then:
>
> conda init

输入以后出现以下提示:

> (base) [wwl@localhost ~]$ conda init
> no change     /home/wwl/software/anaconda3/condabin/conda
> no change     /home/wwl/software/anaconda3/bin/conda
> no change     /home/wwl/software/anaconda3/bin/conda-env
> no change     /home/wwl/software/anaconda3/bin/activate
> no change     /home/wwl/software/anaconda3/bin/deactivate
> no change     /home/wwl/software/anaconda3/etc/profile.d/conda.sh
> no change     /home/wwl/software/anaconda3/etc/fish/conf.d/conda.fish
> no change     /home/wwl/software/anaconda3/shell/condabin/Conda.psm1
> no change     /home/wwl/software/anaconda3/shell/condabin/conda-hook.ps1
> no change     /home/wwl/software/anaconda3/lib/python3.7/site-packages/xontrib/conda.xsh
> no change     /home/wwl/software/anaconda3/etc/profile.d/conda.csh
> modified      /home/wwl/.bashrc
>
> ==> For changes to take effect, close and re-open your current shell. <==

接下来查看一下环境变量
 ```shell
(base) [wwl@localhost ~]\$ echo \$PATH
 ```
> /home/wwl/software/anaconda3/bin:/home/wwl/software/anaconda3/condabin:/usr/local/bin:/usr/local/sbin:/usr/bin:/usr/sbin:/bin:/sbin:/home/wwl/work:/home/wwl/.local/bin:/home/wwl/bin:/home/wwl/work

可以看到,anaconda3的环境变量已经被自动添加进去.


- 最后，如果只执行前面两部的话每次开启终端，anaconda都会被自动激活
>If you'd prefer that conda's base environment not be activated on startup,
>set the auto_activate_base parameter to false:
>conda config --set auto_activate_base false

所以需要执行anaconda给出的提示最后一步：
```
conda config --set auto_activate_base false
```


**至此Anaconda3就安装完成了**

****
### 追加
后来我在shell里运行jupyter的时候发现bash not found jupyter
我查了一下环境变量发现没有这条环境变量了
>/home/wwl/software/anaconda3/bin

于是只能自己动手添加这条环境变量
```shell
sudo vim /etc/profile
//添加如下代码
export PATH=$PATH:/home/wwl/software/anaconda3/bin
//退出编辑
source  /etc/profile  //执行配置
```