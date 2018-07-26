## jekyll-theme-Pure

基于Jekyll的博客主题模板，简洁轻量。

如果你喜欢这个博客模板，请在右上角star一下，非常感谢～

If you like this theme or using it, please give a ⭐️ for motivation ;)

如果想体验手机浏览效果，可以扫一下二维码：

![](screenshot/qr-code.png)

Using your smartphone to scan the QR Code


### Features 特性

#### CN

- 代码高亮
- Valine评论系统
- 响应式设计
- 社交图标
- Gulp
- SASS

#### EN

- Code highlight
- Valine Comment System
- Responsive design
- SNS Icon
- Gulp
- SASS

### Usage 快速开始

首先你需要安装Jekyll，请查看文档: [快速指南](http://jekyll.com.cn/docs/quickstart/)

如果你已经安装了Jekyll，请检查版本是否为3.0.x，你可以使用 ```gem update jekyll``` 命令进行升级。

使用 ```gem install jekyll-paginate``` 或 ```sudo gem install jekyll-paginate``` 安装Jekyll的分页插件。

>Pure主题基于Jekyll 3.2.1版本，不同版本之间可能存在部分差异，具体请参考[官方更新文档](https://jekyllrb.com/news/)

点击右上角Fork按钮在你的Github上创建分支，或者```clone```到本地。

``` git clone https://github.com/janessasmith/janessasmith.github.io.git ```

最后，在命令行输入 ```jekyll server``` 开启服务，就能在本地预览主题了。

如果需要部署到线上环境，请参照配置文档的 **开始** 章节进行操作。

### Document 配置文档

## Running the blog in local

In order to compile the assets and run Jekyll on local you need to follow those steps:

- Install [NodeJS](https://nodejs.org/)
- Run `npm install`
- Run `bower install`
- Run `gulp`

#### 代码高亮

模板引入了[Prism.js](http://prismjs.com)，一款轻量、可扩展的代码语法高亮库。主题采用的是tomorrow。

很多知名网站如[react](https://reactjs.org/)、[MDN](https://developer.mozilla.org/)、[css-tricks](https://css-tricks.com/)也在用它，就连 JavaScript 之父 [Brendan Eich](https://brendaneich.com/) 也在个人博客上使用。

遵循 [HTML5](https://www.w3.org/TR/html5/grouping-content.html#the-pre-element) 标准，Prism 使用语义化的 `<pre>` 元素和 `<code>` 元素来标记代码区块：

```
<pre><code class="language-css">p { color: red }</code></pre>
```

在Markdown中你可以这样写：

	 ```css
	    p { color: red }
	 ```

     ```javascript
		var Prism = require('prismjs');
        // The code snippet you want to highlight, as a string
        var code = "var data = 1;";
        // Returns a highlighted HTML string
        var html = Prism.highlight(code, Prism.languages.javascript, 'javascript');
	 ```

支持语言：

- HTML
- CSS
- Sass
- Less
- JavaScript
- JSON
- CoffeeScript
- Java
- C-like
- Swift
- PHP
- Go
- Python
- 等

#### Valine评论系统

这里推荐三种第三方社交评论插件：
- [Disqus](https://disqus.com/)：可惜已被墙
- [Gitment](https://imsun.github.io/gitment/)：基于github的issue实现，但需要用github账号登录
- [Valine](https://valine.js.org/)：Valine依赖于Leancloud的后端服务，需要注册账号，且免费版对API请求有限制，有文章阅读量统计相关功能。

最终采用Valine，其特点：

- 无后端实现
- 高速，使用国内后端云服务提供商 LeanCloud 提供的存储服务
- 开源，自定义程度高
- 支持邮件通知
- 支持验证码
- 支持Markdown

在配置文件 `_config.yml` 中找到Valine的相关配置。

```
# Comments 评论功能
Valine:
    el: 'xxx' #Valine 的初始化挂载器。可以是一个CSS 选择器，也可以是一个实际的HTML元素
    appid: 'xxx' #Leancloud应用的appId
    appkey: 'xxx' #Leancloud应用的appKey
    verify: false #验证码 默认false
    notify: true #评论回复提醒 默认false
    placeholder: 'ヾﾉ≧∀≦) Just go go~' #评论框占位符
```

详细使用和配置，可参考文档：[Valine官网文档](https://valine.js.org/)、[Valine配置介绍一](https://panjunwen.com/diy-a-comment-system/)、[Valine配置介绍二](https://www.xxwhite.com/2017/Valine.html)