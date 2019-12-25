

## 进程命令

### 在进程中找到叫ngrok的进程

- ps -ef | grep ngrok

### 在进程中找到端口号是80的进程

- netstat -tanlp | grep 80

## 查看CentOS版本

```shell
[root@VM_0_10_centos ~]# cat /etc/redhat-release
CentOS Linux release 7.6.1810 (Core)
```

## top

 top - display Linux processes

## 开放端口

- 对外开放访问的端口：
  - `firewall-cmd --add-port=8080/tcp --permanent`
- 重启防火墙
  - `firewall-cmd --reload`
- 查看已经开放的端口号
  - `firewall-cmd --list-all`

