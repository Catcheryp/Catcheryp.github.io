---
layout: default
title: 首页
---

这是一个极度简洁的jekyll主题，完全聚焦于内容，不含多余代码，如果你是一个写作者，或者仅仅希望有一个属于自己的展示空间，
这个主题绝对适合你，完全兼容github文档语法。也许你会问，为什么将主题做得这么简单，不添加一些
搜索功能、分享功能、评论功能以及各种动态效果，这些都可以有，但没必要，因为我的目的就是想
简简单单地写文章。


<div class="archive">
  <div class="timeline" id="timeline">
    {% assign posts_by_year = site.posts | group_by_exp:"post", "post.date | date: '%Y' " %}
    {% for group in posts_by_year %}
      <div class="archive-title">
        <h4 class="archive-year">{{ group.name }}</h4>
      </div>

      <ul>
      {% for post in group.items %}
        <li><div style="width:4rem;float:left;">{{ post.date | date: "%b %-d" }}</div> <a href="{{ site.url }}{{ site.baseurl }}{{ post.url }}" class="archive-item-link" title="{{post.title}}">{{ post.title }}</a></li>
      {% endfor %}
      </ul>

    {% endfor %}
  </div>
</div>