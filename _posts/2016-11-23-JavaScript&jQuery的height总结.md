---
layout: post
date: 2016-11-23 14:08
status: public
title: JavaScript&jQuery的height总结
---

###jquery的各种高度
首先来说一说$(document)和$(window)，如下：
```javascript
$(document).height();   //整个网页的高度
$(window).height();       //浏览器可视窗口的高度
$(window).scrollTop();  //浏览器可视窗口顶端距离网页顶端的高度（垂直偏移）
```

**用一句话理解就是：当网页滚动条拉到最低端时**
```javascript
$(document).height() == $(window).height() + $(window).scrollTop()
```
注意，是拉到最低端！
当网页高度不足浏览器窗口时$(document).height()返回的是$(window).height()
假如您要获取整个网页的高度，不建议用$("html").height()、$("body").height()的高度
原因：
$("body").height()：body可能会有边框，获取的高度会比$(document).height()小； $("html").height()：在不同的浏览器上获取的高度的意义会有差异，说白了就是浏览器不兼容。
说道这里，提及边框和margin还有padding，我们自然想到了jquery的另外的两个高度，那就是innerHeight()和outerHeight()
innerHeight()和outerHeight()不适用于window 和 document对象，对于window 和 document对象可以使用.height()代替。innerHeight()和outerHeight()主要用来获取标签的高度。

####innerHeight()

![](~/14-23-36.jpg)
innerHeight：height + padding
outerHeight：height＋padding＋border，参数为true时：height＋padding＋border＋margin

innerHeight(value)
这个“value”参数可以是一个字符串（数字加单位）或者是一个数字,如果这个“value”参数只提供一个数字，jQuery会自动加上像素单位（px）。如果只提供一个字符串，任何有效的CSS尺寸都可以为高度赋值（就像100px, 50%, 或者 auto）。注意在现代浏览器中，CSS高度属性不包含padding, border, 或者 margin， 除非box-sizingCSS属性被应用。

####jquery高度，放到浏览器中试一下
```javascript
alert($(window).height());                           //浏览器当前窗口可视区域高度
alert($(document).height());                        //浏览器当前窗口文档的高度
alert($(document.body).height());                //浏览器当前窗口文档body的高度
alert($(document.body).outerHeight(true));  //浏览器当前窗口文档body的总高度 包括border padding margin
alert($(window).width());                            //浏览器当前窗口可视区域宽度
alert($(document).width());                        //浏览器当前窗口文档对象宽度
alert($(document.body).width());                //浏览器当前窗口文档body的宽度
alert($(document.body).outerWidth(true));  //浏览器当前窗口文档body的总宽度 包括border padding margin
```

####javascript的各种高度
```javascript
网页可见区域宽[仅针对body]： document.body.clientWidth
网页可见区域高[仅针对body]： document.body.clientHeight
网页可见区域宽[仅针对body]： document.body.offsetWidth (包括滚动条和边框，若滚动条和边框为0，则和clientWidth相等)
网页可见区域高[仅针对body]： document.body.offsetHeight (包括滚动条和边框，若滚动条和边框为0，则和clientHeight相等)
可视窗口宽度(包括滚动轴宽度)：window.innerWidth; //IE9+、Chrome、Firefox、Opera 以及 Safari
可视窗口高度，不包括浏览器顶部工具栏： window.innerHeight;//IE9+、Chrome、Firefox、Opera 以及 Safari
网页正文全文宽(不包括滚动轴的宽度)： document.body.scrollWidth
网页正文全文高：document.body.scrollHeight //假如网页中没有滚动轴，document.body.scrollWidth和window.innerWidth相等，document.body.scrollHeight和window.innerHeight相等。
网页被卷去的高： document.body.scrollTop
网页被卷去的左： document.body.scrollLeft
网页正文部分上： window.screenTop
网页正文部分左： window.screenLeft
屏幕分辨率的高（整个屏幕的高度）： window.screen.height
屏幕分辨率的宽（整个屏幕的宽度）： window.screen.width
屏幕可用工作区高度： window.screen.availHeight
屏幕可用工作区宽度： window.screen.availWidth
整个浏览器可用工作区高度： window.outerHeight
整个浏览器可用工作区宽度： window.outerWidth
```