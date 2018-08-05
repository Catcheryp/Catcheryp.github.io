---
title: SQL注入的套路
layout: post
categories: SQL注入
---
记录一般的 SQL 注入的套路，持续更新......
<!--more-->

## 0x01 判断注入点



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











