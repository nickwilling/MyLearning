Nginx简介

Nhinx是一个高性能的HTTP和反向代理服务器，特点是占有内存少，并发能力强。

- 反向代理
- 负载均衡
- 动静分离
- 高可用
## nginx配置文件：`/etc/nginx/nginx.conf`
- http部分
	server部分`include /etc/nginx/conf.d/*.conf`
```c
server {
    listen       80;
    server_name  58.198.176.178;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;
    location / {
        root   /usr/share/nginx/html;
        proxy_pass   http://web_pools;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}

```
## 正向代理：代理客户端
在客户端（浏览器）配置代理服务器，通过代理服务器进行互联网访问，代理    

## 反向代理：代理服务器
我们只需要将请求发送到反向代理服务器，由反向代理服务器去选择目标服务器获取数据后，再返回给客户端，此时反向代理服务器和目标服务器对外就是一个服务器，对客户端暴露的是代理服务器地址，隐藏了真实服务器IP地址。

## 负载均衡
当请求并发特别多的时候单个服务器处理不了这么多的并发，此时就可以增加服务器的数量，然后将请求分发到各个服务器上，将原先请求集中到单个服务器上的情况改为将请求分发到多个服务器上，将负载分发到不同的服务器，也就是我们说的**负载均衡**

因为Nginx可以反向代理服务器，所以可以充当一个请求分发者的角色，将客户端的请求平均分发到不同的服务器处理，以实现负载均衡。



![负载均衡](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191217192331.png)

## 动静分离

为了加快网站的解析速度，可以把动态页面[jsp、servlet]和静态页面[html、css、js]由不同的服务器来解析，加快解析速度。降低原来单个服务器的压力。



## Nginx配置实例-反向代理

>1.实现效果
>	(1) 打开浏览器，在浏览器地址栏输入地址 www.123.com, 跳转到 Linux系统tomcat主页面中	
![](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191218192737.png)
准备工作：
1. 安装tomcat
	- 对外开放访问的端口：
		- `firewall-cmd --add-port=8080/tcp --permanent`
	- 重启防火墙
		- `firewall-cmd --reload`
	- 查看已经开放的端口号
		- `firewall-cmd --list-all`
2. 配置反向代理
	- 将ip地址和域名对应关系写到hosts文件
	- 在nginx进行请求转发的配置(反向代理配置)


### 启动Apache Tomcat服务

` systemctl start tomcat / tomcat.service` 

查看Tomcat服务运行状态：

`systemctl status tomcat `
### 找 tomcat 的 webapps 在哪
`find / -name webapps`
找到在`/var/lib/tomcat/webapps`
### 启动nginx服务
`systemctl start tomcat`

- 查看nginx服务状态
	- systemctl status tomcat
### nginx配置文件修改以后reload
nginx -s reload

## Nginx配置实例-反向代理2

1. 实现效果：
   1. 使用nginx反向代理，根据访问的路径跳转到不同端口的服务中，nginx监听端口为9001，
   2. 访问 http://127.0.0.1:9001/edu/ 直接跳转到 127.0.0.1:8080
   3. 访问 http://127.0.0.1:9001/vod/  直接跳转到 127.0.0.1:8081
2. 准备工作：
	1. 准备两个tomcat服务器， 一个8080端口，一个8081端口

```c
server {
    listen       9001;
    server_name  58.198.176.178;
//使用正则表达式匹配前面一定要加~
    location ~ /edu/ {
    proxy_pass  http://127.0.0.1:8080;
    }
    location ~ /vod/ {
    proxy_pass http://127.0.0.1:8080;
    }

}
```

## 负载均衡

```c
http {
......
    upstream myserver {
    	server 115.28.52.63:8080 weight=1;
   	 	server 115.28.52.63:8180 weight=1;
}
.....
    server {
    location / {
        .....
            proxy_pass http://myserver;
        	proxy_connect_timeout 10;
    }
}
}
```

### 访问策略

- 轮询（默认）
- weight
- ip_hash(每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session问题)

```c
upstream myserver {
    	//不能加weight
    	ip_hash;
    	server 115.28.52.63:8080;
   	 	server 115.28.52.63:8180;
}
```

- fair(第三方)

  - 按后端服务器的响应时间来分配请求，响应时间短的优先分配

    ```c
    upstream myserver {
        	server 115.28.52.63:8080;
       	 	server 115.28.52.63:8180;
        	fair
    }
    ```

## 动静分离

nginx 动态分离简单来说就是把动态跟静态请求分开，不能理解成单纯的把动态页面和静态页面物理分离。严格意义上说应该是动态请求跟静态请求分开，可以理解成使用Nginx处理静态页面，Tomcat处理动态页面。

```c
upstream web_pools {
        server 58.198.176.178:8080 weight=1;
}
server {
    listen       80;
    server_name  58.198.176.178;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        proxy_connect_timeout       150;
        proxy_pass   http://web_pools;
}
    location ~ /edu/ {
    proxy_pass  http://127.0.0.1:8080;
    }
    location ~ /vod/ {
    proxy_pass http://119.28.214.72:8080;
    }
    location /www/ {
        root /data/;
        index index.html index.htm;
    }
    location /image/ {
        root /data/;
        autoindex on;
    }
}

```



### Nginx出现403 forbidden

 https://blog.csdn.net/qq_35843543/article/details/81561240 

## 配置高可用集群

 高可用就是一台nginx宕机了以后还是可以保持请求。主从nginx服务器。

## nginx原理

- 有一个master，多个worker

- 每个worker都是一个独立的进程，但每个进程只有一个主线程，通过异步非阻塞的方式来处理请求，即使是成千上万个请求也不在话下。每个worker的线程可以把一个cpu的性能发挥到极致。
- 所以worker的数量应该和服务器的cpu的数量保持一致（4核cpu就设置4个worker）

### nginx的连接数（worker_connection）

1. 发送请求，占用了worker的几个连接数？
   - 2个【如果请求的是静态资源，worker自己就能处理，res+req一共两个连接数】或者4个 【请求的是动态资源，worker需要使用反向代理转发给tomcat处理，所以是2个客户端的连接数，2个tomcat的连接数】
2. nginx 有一个master， 有4个worker， 每个worker支持最大的连接数据 1024， 支持的最大并发数是多少？
	- 普通的静态访问最大并发数：$worker\_connections * worker\_processes /2 = 1024*4/2 = 2048$
	- 如果是http作为反向代理，最大并发数量=$worker\_connections * worker\_processes /4 = 1024$