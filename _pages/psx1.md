---
title: "PS1"
permalink: /psx1/
layout: archive
author_profile: true
---

<style>
  /* 화면의 큰 제목(PS1 등) 숨기기 */
  .page__title { display: none; }

  /* 링크 스타일 설정 */
  .archive__item-title a {
    color: #888888 !important;   /* 기본: 회색 */
    text-decoration: none;       /* 밑줄 제거 */
  }
  
  /* 마우스 올렸을 때 & 클릭했을 때 */
  .archive__item-title a:hover, 
  .archive__item-title a:active {
    color: #000000 !important;   /* 검정 */
  }
</style>

{% for post in site.categories.psx1 %}
  <article class="archive__item">
    <h2 class="archive__item-title">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h2>
  </article>
{% endfor %}