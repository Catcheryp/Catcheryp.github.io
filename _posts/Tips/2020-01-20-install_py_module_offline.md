---
title: 离线安装python各种库
layout: post
categories: Tips
tags: python
---
最近在搭建一个简易的平台，使用python cgi实现后台的简单逻辑需要安装paramiko库，但是很尴尬的是公司管理面的机器无法连外网，公司yum源的地址在这台机器上也没法使用，即使能使用pip源也用不了，就是各种坑......

<!--more-->

## 0x01 离线安装的几种思路

1.修改yum源，使用公司内部的yum源，且保证有pip源

2.使用跳板机，利用跳板机来连外网，在本地开个代理即可

3.下载python库但是不安装，然后再移植到目标机器上，具体操作步骤[参考这里](https://stackoverflow.com/questions/11091623/how-to-install-packages-offline)

4.在Linux上生成python虚拟化环境，并下载好所需要的包，直接移植到目标机器上

## 0x02 背景

对于第一种方法，直接pass掉

对于第二种方法，在公司内使用`export http://xxxxxx`走的还必须是公司的代理，需要填我的账号和密码，本身只是鉴权的作用，需要这台机器本身就能连通目标网址。但是目标机器连不通目标网址，这种方法不行。

对于第三种方法，我在安装paramiko的时候，会下载另外的依赖库，这几个依赖库是系统相关的，而目标机器的系统是欧拉，我直接安装paramiko-2.7.1-py2.py3-none-any.whl 文件会报错`No platform`，意思是找不到对应的操作系统。此时如果坚持使用这种方法的，只有去自己装个欧拉的系统，且可以下载python库，然后按照这种方法移植过来，理论上来说是可以的。

对于第四种方法，我就是用这种方法的，下面主要介绍这种方法

## 0x03 python虚拟环境跨平台

1.目标机器的系统是欧拉，我现在centOS上生成python的虚拟环境，并下载好我需要的python库。

2.将python虚拟环境整个打包上传到目标机器上，在目标机器上解压缩。

3.此时你若`source ./bin/activate` 激活虚拟环境，你会发现在虚拟环境下并没有成功使用python虚拟环境，此时需要修改`activate` 文件里面的`VIRTUAL_ENV="xxxx"`，将其修改成当前虚拟环境对应的路径。

4.修改完了之后，确实可以进入到python虚拟环境了，但是此时我`import paramiko`又报错了，显示我`no socket module`，这是因为python虚拟环境会从当前机器的python库里面拷贝内置的一些库，比如python自带的socket库，而`sys.path`里面的默认的路径是centOS中系统python的路径，此时就需要修改`sys.path`里面的内容，将centOS的路径改成本机自带的Python路径就可以了。

```
import sys
sys.append("/usr/local/lib/python3.5")
import paramiko
```

按照以上修改之后就可以不报错了，这只是临时的解决方案，每次写代码都需要加上面这段才可以。还有一种永久的解决办法，修改`venv/lib/python3.5/site.py`，在里面加上一行`sys.append("/usr/local/lib/python3.5")`，就可以永久生效了。

5.此时还没有完全解决我的问题，我希望前台触发的python直接就是虚拟环境的python，还需要将cgi脚本的shebang路径改成虚拟环境的路径`/usr/bin/venv/bin/python3`，同时在`/etc/profile`里面添加一行`source /usr/bin/venv/bin/activate`，然后`source /etc/profile`刷新一下即可。

