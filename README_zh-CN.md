![banner](https://user-images.githubusercontent.com/18289264/35855826-34885a0c-0b6f-11e8-9ba2-98272cb9a27a.png)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Tencent/feflow/blob/master/LICENSE)
[![](https://img.shields.io/travis/Tencent/feflow.svg?style=flat-square)](https://travis-ci.org/Tencent/feflow)
[![Codecov](https://img.shields.io/codecov/c/github/Tencent/feflow/master.svg?style=flat-square)](https://codecov.io/gh/Tencent/feflow/branch/master)
[![Package Quality](http://npm.packagequality.com/shield/feflow-cli.svg)](http://packagequality.com/#?package=feflow-cli)
[![npm package](https://img.shields.io/npm/v/feflow-cli.svg?style=flat-square)](https://www.npmjs.org/package/feflow-cli)
[![NPM downloads](http://img.shields.io/npm/dt/feflow-cli.svg?style=flat-square)](https://npmjs.org/package/feflow-cli)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/feflow/feflow/pulls)
[![Join the chat at https://gitter.im/feflow/feflow-cli](https://badges.gitter.im/feflow/feflow-cli.svg)](https://gitter.im/feflow/feflow-cli?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![developing with feflow](https://img.shields.io/badge/developing%20with-feflow-1b95e0.svg)](https://github.com/feflow/feflow)

致力于提升研发效率和规范的工程化解决方案，使用 [Node.js](https://nodejs.org/en/)编写.

## 特性

- 强大的插件机制，易于扩展.
- 和Yeoman集成，很容易通过Yeoman脚手架进行项目的初始化创建.
- 支持多种主流构建，包括webpack, fis等等
- 定义了一系列规范，包括Commit规范和ESLint规范.
- CLI的内核和插件层分离，当和最新版本不兼容时会采取全量更新和增量更新策略。

## 安装

``` bash
$ npm install feflow-cli -g
```

## 快速使用

**初始化项目**

``` bash
$ feflow init
$ cd <folder>
```

**本地开发**

``` bash
$ feflow dev
```

**代码检查**

``` bash
$ feflow lint
```

**生产环境打包**

``` bash
$ feflow build
```

**部署文件**

``` bash
$ feflow deploy
```

**安装 脚手架或插件**

``` bash
$ feflow install <package>
```

## 文档

* 中文文档 <https://feflowjs.com/zh/guide/>

## 整体架构
![](https://qpic.url.cn/feeds_pic/ajNVdqHZLLDsuocibo3TZ3GE5TMmVywG0lRyiayfI8D3icgW8FrkFKFOQ/)

## 如何贡献

1. 从目前已经存在的issue或者提出一个新的issue去讨论新的特性或者存在的bug.
2. 在Github上Fork [仓库](https://github.com/feflow/feflow)_，然后在master或者其它分支上开始进行您的修改.
3. 编写测试用例表明某个bug被修复掉了或者新的特性可以正常工作.
4. 提交PR直到它被merge或者发布出去了. :) 记得把您添加进 [AUTHORS_](AUTHORS).

感谢所有为本项目贡献代码的人
<a href="https://github.com/feflow/feflow/graphs/contributors"><img src="https://opencollective.com/feflow/contributors.svg?width=890&button=false" /></a>

## 版本日志

[版本日志](CHANGELOG.md)

## 许可证

[MIT](https://tldrlegal.com/license/mit-license)
