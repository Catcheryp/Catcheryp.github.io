---
layout: tags
title: Tags
description: 哈哈，你找到了我的文章基因库
keywords: 标签
comments: false
menu: 标签
permalink: /tags/
---

<section class="container posts-content">
{% assign sorted_tags = site.tags | sort %}
{% for tag in sorted_tags %}
<h3>{{ tag | first }}</h3>
<ol class="posts-list" id="{{ tag[0] }}">
{% for post in tag.last %}
<li class="posts-list-item">
<span class="posts-list-meta">{{ post.date | date:"%Y-%m-%d" }}</span>
<a class="posts-list-name" href="{{ site.url }}{{ post.url }}">{{ post.title }}</a>
</li>
{% endfor %}
</ol>
{% endfor %}
</section>
<!-- /section.content -->
