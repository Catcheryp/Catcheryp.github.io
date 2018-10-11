---
title: webhacking.kr writeup(1-？)
layout: post
categories: CTF
tags: CTF
---

这个 CTF 平台都是 web 题目，感觉不错，这里记录一下做题的一些技巧......

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



