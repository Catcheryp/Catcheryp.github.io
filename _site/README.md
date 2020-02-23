# Newton

博客基于[jekyll](https://jekyllrb.com/)搭建，你也可以参考[中文文档](https://www.jekyll.com.cn/)(但是内容不全)，博客主题
吸收多平台的优点，摒弃所有的繁杂缺点搭建而成，主要集成了github平台的markdown语法样式和简书的字体。
如果你想要快速利用我的模板搭建博客，请往下看。

## fork我的仓库

你只要fork我的仓库，然后将仓库名字改为`usename.github.io`即可。其中`usename`是你的github账户名称。
过一会(因为github引擎渲染可能需要一分钟左右)，然后在浏览器中输入`usename.github.io`网址，就能看见你的
博客了

## 个性化定制

前面你已经成功将博客移植到你的仓库，但是很多数据都是我的，所以你需要将仓库pull到本地进行修改，主要修改以下几项即可。

### 修改_config.yml

该文件主要是一些个人信息，将其中的个人信息改成你的信息就行。

### 清空_posts文件夹

该文件夹里面的文章都是我个人的，全部删掉。

### 添加文章

添加的文章是利用markdown语法写的，写文章之前需要一个头部标识，即在文章前面添加如下信息

```yml
layout: post
title: 你的标题
```

接下去就可以继续写文章了
注意，文章的命名是`year-month-day-title.md`，因为这是jekyll的读取格式。

### 将修改后的仓库pull到github

做完上面的修改，就可以将仓库push到github上，过一会，你的博客就全部渲染好了。

## 自定义域名

你可以自定义域名，将域名存到CNAME文件夹中

## 本地调试

jekyll是基于ruby的maekdown转换器，为了方便，建议在本机调试好再发送到服务器，需要下载ruby和jekyll

