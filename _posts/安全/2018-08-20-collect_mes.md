---
title: 渗透测试之信息收集
layout: post
categories: 安全
tags: 信息收集
---
《Web 安全攻防》渗透测试之信息收集

<!--more-->

## 1. 收集域名信息

### 1.1 Whois 查询

I Kali 上 Whois 已经默认安装 => `whois sec-redclub.com`<br>
II [爱站工具网 ](https://whois.aizhan.com)<br>
III [站长之家](http://whois.chinaz.com)<br>
IV [Virus Total](https://www.virustotal.com)



### 1.2 备案信息查询

I [ICP备案查询网](http://www.beianbeian.com)<br>
II [天眼查 ](http://www.tianyancha.com)<br>

## 2.收集敏感信息

**a. Google 常用语法**：

| 关键字  | 说明    |
| ---    | :----  |
| Site | 指定域名 |
| Inurl | URL 中存在关键字的网页 |
| Intext | 网页正文中的关键字 |
| Filetype | 指定文件类型 |
| Intitle | 网页标题中的关键字 |
| link | link: baidu.com 即表示返回所有和 baidu.com 做了链接的 URL |
| Info | 查找指定站点的一些基本信息 |
| cache | 搜索 Google 里关于某些内容的缓存 |

exp: `site:edu.cn intext:后台管理`  => 搜索网页正文中含有「后台管理」并且域名后缀是「edu.cn」的网站。

Google 搜索可获取的敏感信息有:
- 数据库文件
- SQL 注入
- 配置信息
- 源代码泄露
- 未授权访问
- robots.txt

**b. Github 上查找敏感信息：**

- 数据库连接信息
- 邮箱密码
- uc-key
- 阿里的 osskey
- 泄露的源代码

**c. [乌云漏洞列表](https://bugs.shuimugan.com/)**

查询历史漏洞信息



## 3.收集子域名信息

### 3.1 子域名检测工具

- **Layer 子域名挖掘机**
- K8
- wydomain
- **Sublist3r**
- dnsmaper
- **subDomainsBrute**
- Maltego CE

### 3.2 搜索引擎枚举

利用 Google 语法 搜索子域名 => `site:baidu.com`

### 3.3 第三方聚合应用枚举

- [DNSdumpster](https://dnsdumpster.com)
- 在线 DNS 侦查

### 3.4 证书透明度公开日志枚举

- [crt.sh https://crt.sh](https://crt.sh)
- [censys https://censys.io](https://censys.io)
- [域名暴破网站](https://phpinfo.me/domian)
- [IP 反查绑定域名网站](http://dns.aizhan.com)

## 4.收集常用端口信息

**a. 常用的端口扫描工具：**
- **Nmap**
- 无状态端口扫描工具 Masscan
- ZMap
- 御剑高速 TCP 端口扫描工具

**b. 常见的端口及说明以及攻击方向**

**文件共享服务端口**

| 端口号 | 端口说明 | 攻击方向 |
| ---    | :----  | ---    |
| 21 / 22 / 69 | Ftp/Tftp 文件传输协议 | 允许匿名的上传、下载、暴破和嗅探操作 |
| 2049 | Nfs 服务 | 配置不当 |
| 139 | Samba 服务 | 暴破、未授权访问、远程代码执行 |
| 389 | Ldap 目录访问协议 | 注入、允许匿名访问、弱口令 |



**远程连接服务器**

| 端口号 | 端口说明 | 攻击方向 |
| ---    | :----  | ---    |
| 22 | SSH 远程连接 | 允许匿名的上传、下载、暴破和嗅探操作 |
| 23 | Telnet 远程连接 | 暴破、嗅探、弱口令 |
| 3389 | Rdp 远程桌面连接 | Shift 后门(需要 Widows Server 2003 以下的系统)、暴破 |
| 5900 | VNC | 弱口令暴破 |
| 5632 | PyAnywhere | 抓密码、代码执行 |



**Web 应用服务端口**

| 端口号 | 端口说明 | 攻击方向 |
| ---    | :----  | ---    |
| 80 / 443 / 8080 | 常见的 Web 服务端口 | Web 攻击、暴破、对应服务器版本漏洞 |
| 7001 / 7002 | WebLogic 控制台 | Java 反序列化、弱口令 |
| 8080 / 8089 | Jboss/Resin/Jetty/Jenkins | 反序列化、控制台弱口令 |
| 9090 | WebSphere 控制台 | Java 反序列化、弱口令 |
| 4848 | GlassFish 控制台 | 弱口令 |
| 1352 | Lotus domino 邮件服务 | 弱口令、信息泄露、暴破 |
| 10000 | Webmin-Web 控制面板 | 弱口令 |



**数据库服务端口**

| 端口号 | 端口说明 | 攻击方向 |
| ---    | :----  | ---    |
| 3306 | MySQL | 注入、提权、暴破 |
| 1433 | MSSQL 数据库 | 注入、提权、SA 弱口令、暴破 |
| 1521 | Oracle 数据库 | TNS 暴破、注入、反弹 shell |
| 5432 | PostgreSQL 数据库 | 暴破、注入、弱口令 |
| 27017/27018 | MonogoDB | 暴破、未授权访问 |
| 6379 | Redis 数据库 | 可尝试未授权访问、弱口令暴破 |
| 5000 | SysBase/DB2 数据库 | 暴破、注入 |



**邮件服务端口**

| 端口号 | 端口说明 | 攻击方向 |
| ---    | :----  | ---    |
| 25 | SMTP 邮件服务 | 邮件伪造 |
| 110 | POP3 协议 | 暴破、嗅探 |
| 143 | IMAP 协议 | 暴破 |

**网络常见协议端口**

| 端口号 | 端口说明 | 攻击方向 |
| ---    | :----  | ---    |
| 53 | DNS 域名系统 | 允许区域传送、DNS 劫持、缓存投毒、欺骗 |
| 67 / 68 | DHCP 服务 | 劫持、欺骗 |
| 161 | SNMP 协议 | 暴破、搜集目标内网信息 |

**特殊服务端口**

| 端口号 | 端口说明 | 攻击方向 |
| ---    | :----  | ---    |
| 2181 | Zookeeper 服务 | 允许区域传送、DNS 劫持、缓存投毒、欺骗 |
| 8069 | Zabbix 服务 | 劫持、欺骗 |
| 9200 / 9300 | Elasticsearch 服务 | 暴破、搜集目标内网信息 |
| 11211 | Memcache 服务 | 未授权访问 |
| 512 / 513 / 514 | Linux Rexe 服务 | 暴破、Rlogin 登录 |
| 873 | Rsync 服务 | 匿名访问、文件上传 |
| 3690 | Svn 服务 | Svn 泄露、未授权访问 |
| 50000 | SAP Management Console | 远程执行 |



## 5.指纹识别

**a. 常见的 CMS**

- Dedecms
- Discuz
- PHPWEB
- PHPWind
- PHPCMS
- ECShop
- Dvbbs
- SiteWeaver
- ASPCMS
- 帝国
- Z-Blog
- WordPress

**b.指纹识别工具**
- 御剑 Web 指纹识别
- WhatWeb
- WebRobo
- 椰树
- 轻量 WEB 指纹识别

**c. 在线 CMS 指纹识别**
- [BugScaner](http://whatweb.bugscaner.com/look/)
- [云悉指纹](http://www.yunsee.cn/finger.html)
- [WhatWeb](https://whatweb.net/)



## 6.查找真实 IP

### 6.1 目标服务器存在 CDN

如果目标服务器用了 CDN，就会导致我们没法直接得到目标的真实 IP。

### 6.2 判断目标是否使用了 CDN

1.ping  目标主域，观察域名的解析情况，以此来判断是否使用了 CDN;

2.利用在线网站 [17CE](https://www.17ce.com)，进行全国多地区的 ping 服务器操作，然后对比每个地区 ping 出的 IP 结果，查看这些 IP 是否一致，如果都是一样的，极有可能不存在 CDN。如果 IP 大多不太一样或者规律性很强，可是尝试查询这些 IP 的归属地，判断是都存在 IP。

### 6.3 绕过 CDN 寻找真实 IP

在确认目标用了 CDN 的情况下：

- 内部邮箱源
- 扫描网站测试文件
- 分站域名
- 国外访问([App Synthetic Monitor](https://asm.ca.com/en/ping.php))
- 查询域名解析记录([NETCRAFT](https://www.netcraft.com/))
- 如果网站有 App，抓 App 的请求
- 绕过 CloudFlare CDN 查找真实 IP([CloudFlareWatch](http://www.crimeflare.us/cfs.html#box))

### 6.4 验证获取的 IP

- 看用 IP 访问的页面是否与用域名一样
- 借助类似 Masscan 的工具批量扫描对应 IP 段中所有开了 80、443、8080 端口的 IP，然后逐个尝试 IP 访问，观察响应结果是否为目标站点


## 7.收集敏感目录文件

网站目录扫描工具
- DirBuster
- 御剑后台扫描珍藏版
- wwwscan
- Spinder.py(轻量级快速单文件目录后台扫描)
- Sensitivefilescan(轻量级快速单文件目录后台扫描)
- Weakfilescan(轻量级快速单文件目录后台扫描)

## 8.社会工程学

**社工库**<br>
**域劫持**
