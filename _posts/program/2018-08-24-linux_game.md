---
title: Wargames-Linux 闯关游戏
layout: post
categories: program
tags: linux
---

Linux 闯关游戏的通关秘籍，想通过[这个游戏](http://overthewire.org/wargames/)来熟悉 linux 命令，参考别人的通关秘籍来做的，这里主要记录一下我自己的实操过程。

参考:<br>

[http://overthewire.org/wargames/bandit/](http://overthewire.org/wargames/bandit/)<br>
[Linux 闯关游戏之通关秘籍](https://mp.weixin.qq.com/s?__biz=MzI5MDQ2NjExOQ==&mid=2247488103&idx=1&sn=4ac1dc8457ff4c72c046221d0286ae2e&chksm=ec1e224fdb69ab5992e5fce1a6db4048367c4a2892259c731011b278f61d2ed5a73f28cac135&token=603199687&lang=zh_CN&scene=21#wechat_redirect)<br>
[Linux 闯关游戏之通关秘籍续](https://mp.weixin.qq.com/s?__biz=MzI5MDQ2NjExOQ==&mid=2247488132&idx=1&sn=149447e7b24735102ae296d945980b90&chksm=ec1e22acdb69abba89e87c45cd4ee45ae103a552faf34d97aa46b2ef42f78aaad60060a1edfe&mpshare=1&scene=1&srcid=0822cW0pbqBBcTAD2ymx9DWG%23rd)

<!--more-->

**做题之前，要看题目和提示**

## Level 0 → Level 1

```
$ssh -p 2220 bandit0@bandit.labs.overthewire.org 

$bandit0@bandit:~$ ls
readme
$bandit0@bandit:~$ cat readme 
boJ9jbbUNNfktd78OOpsqOltutMc3MY1	=> 下一关连接 ssh 的密码
```



## Level 1 → Level 2

```
$ssh -p 2220 bandit1@bandit.labs.overthewire.org

$bandit1@bandit:~$ ls
-
$bandit1@bandit:~$ cat ./-
CV1DtqXWVFXTvM2F0k09SHz0YwRINYA9
```



## Level 2 → Level 3

```
$ssh -p 2220 bandit2@bandit.labs.overthewire.org
$bandit2@bandit:~$ cat spaces\ in\ this\ filename	<=> 这里我直接使用 tab 键自动补齐
UmHadQclWmgdLOKQ3YNgjWxGoRMb5luK
```



## Level 3→ Level 4

```
$ssh -p 2220 bandit3@bandit.labs.overthewire.org
$bandit3@bandit:~$ cd inhere
$bandit3@bandit:~/inhere$ cat .hidden
pIwrPrtPN36QITSp3EQaw936yaFoFgAB
```



## Level 4→ Level 5

```
$ssh -p 2220 bandit4@bandit.labs.overthewire.org
$bandit4@bandit:~/inhere$ ls
-file00  -file01  -file02  -file03  -file04  -file05  -file06  -file07  -file08  -file09
$bandit4@bandit:~/inhere$ file ./*	<=>	"file" 命令辨识文件类型
./-file00: data
./-file01: data
./-file02: data
./-file03: data
./-file04: data
./-file05: data
./-file06: data
./-file07: ASCII text
./-file08: data
./-file09: data
$bandit4@bandit:~/inhere$ cat ./-file07
koReBOKuIDDepwhWk7jZC0RTdopnAYKh
```



## Level 5→ Level 6

```
$ssh -p 2220 bandit5@bandit.labs.overthewire.org
bandit5@bandit:~$ ls
inhere
bandit5@bandit:~$ cd inhere
bandit5@bandit:~/inhere$ ls
bandit5@bandit:~/inhere$ ls -l
total 80
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere00
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere01
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere02
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere03
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere04
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere05
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere06
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere07
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere08
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere09
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere10
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere11
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere12
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere13
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere14
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere15
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere16
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere17
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere18
drwxr-x--- 2 root bandit5 4096 Oct 16 14:00 maybehere19
bandit5@bandit:~/inhere$ find . -type f -size 1033c
./maybehere07/.file2
bandit5@bandit:~/inhere$ cat ./maybehere07/.file2
DXjZPULLxYr17uwoI01bNLQbtFemEgo7
```

主要解释一下这个命令:

```
$find . -type f -size 1033c
"ls -l" 除文件名称外，亦将文件型态、权限、拥有者、文件大小等资讯详细列出，发现有很多文件夹，"find . -type f -size 1033c"，"." 查找当前目录以及子目录，-type f 指定文件类型为普通文件，-size 1033c 指定文件大小为 1033 bytes
```







