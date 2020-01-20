---
title: Wireshark常用技巧
layout: post
categories: 安全
tags: Wireshark
---
很久没有更新博客了，再不更新都要发霉了都，这一篇主要介绍Wireshark的常用技巧，因为毕业论文做协议方面的内容，所以在此记录一下。

<!--more-->

#### 1.常用过滤规则

```
(ip.src == 47.95.47.253 && ip.dst== 192.168.1.133)||(ip.dst== 47.95.47.253 && ip.src== 192.168.1.133)

# 提取有效 tcp 包
tcp and !(tcp.analysis.flags && !tcp.analysis.window_update) and !(http || tcp.port == 80 || http2)
```

参考：<br>
[http://blog.51cto.com/yttitan/1734425](http://blog.51cto.com/yttitan/1734425)<br>
[https://www.magentonotes.com/wireshark-filter-ip.html](https://www.magentonotes.com/wireshark-filter-ip.html)

![Coloring Rules](http://fight0days.cn/2019-07-10-111.png)

`Coloring Rules` 里面会有对应报文类型规则



#### 2.Wireshark 常用功能

**查看TCP数据流**

![Flow Graph](http://fight0days.cn/2019-07-10-2.png)



**存储自定义的过滤规则**

![zidingyi](http://fight0days.cn/2019-07-10-3.png)



**查看会话条数**

![2019-07-10-4.png](http://fight0days.cn/2019-07-10-4.png)



**跟踪数据流**

![2019-07-10-5](http://fight0days.cn/2019-07-10-5.png)



**保存成特定文件**

![2019-07-10-6](http://fight0days.cn/2019-07-10-6.png)



以上就是我平时用到稍微多一点的地方，后续如果有更多tips会继续更新。