# node-github-trending

### 关于

在网上看到 [分享一个自己写的github-trending小工具](http://www.jianshu.com/p/25722080c73d)，感觉挺有趣的，自己也经常去看 Github 的 Trending。文章中是使用 Python 实现的，而我最近在学习 NodeJS，就使用 NodeJS 来实现。

### 运行

#### 使用Node

直接使用 node 运行，但这样 shell 就不能关闭，并且如果出现异常就不能自动重启。

``` bash
# install dependencies
npm install

# run scraper.js
node scraper.js
```

#### 使用PM2

PM2 是一个带有负载均衡功能的Node应用的进程管理器。

``` bash
# install pm2
npm install -g pm2

# pm2 start scraper.js
pm2 start scraper.js
```

### 文件生成异常

根据日期重新生成。

``` bash
node scraper.js 2017-10-28 2017
```

### Node库
- [tmpvar/jsdom](https://github.com/tmpvar/jsdom) 解析页面信息
- [node-schedule/node-schedule](https://github.com/node-schedule/node-schedule) 定时任务
- [PM2](http://pm2.keymetrics.io/) 进程管理器
- [Moment.js](http://momentjs.com/) 轻量级时间格式化组件
- [caolan/async: Async utilities for node and the browser](https://github.com/caolan/async) 异步转同步

### 参考
- [分享一个自己写的github-trending小工具](http://www.jianshu.com/p/25722080c73d)
- [使用PM2将Node.js的集群变得更加容易](http://www.cnblogs.com/jaxu/p/5193643.html)
- [使用高大上的pm2代替forever部署nodejs项目](http://www.jianshu.com/p/fdc12d82b661)
- [nodejs部署方式-pm2(一)](http://www.tuicool.com/articles/773mmqN)
- [Nodejs异步流程控制Async](http://blog.fens.me/nodejs-async/)

### License
[Apache License, Version 2.0](https://opensource.org/licenses/Apache-2.0)
