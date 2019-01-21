title: 自定义构建器
---

开发一个构建器并不困难，如果你的项目中已经有构建代码了，那么抽离成构建器轻而易举。本文会以一个简单的 Webpack 构建器为例，详细讲解如何开发出自己的构建器。当然，Feflow 并不限制构建器的技术选型，你用 `Rollup`、`Parcel` 也是完全没问题的。

> 文档中的示例构建器是 [自定义脚手架](./advance-scaffold-custom.html) 文档内的构建器，可以结合以来一起看。

## 创建构建器项目

新建一个目录，名为 `builder-feflow-example`，然后，用 `npm init` 初始化为一个 NPM 包。

**注意：`name` 字段和项目目录名保持一致，`main` 字段的值是 Feflow 要执行的入口文件，示例写的是 `lib/index.js`**

> 构建器名字推荐以 `builder-` 开头。虽然 Feflow 并不限制构建器的名字，但是 Feflow 在更新本地构建器时会找到 `builder-` 开头的依赖包进行更新。

## 编辑入口文件

创建或打开你刚刚创建的项目的入口文件，示例中是 `lib/index.js`，然后暴露出一个接收参数的函数：

```js
/**
 * 暴露给 Feflow 的函数
 * @param {string} cmd 用户在使用 feflow 构建时传给 feflow 的命令，例如执行 feflow dev 时 cmd 是 dev
 * @param {string} ctx feflow 上下文，和插件上下文一致
 */
module.exports = (cmd, ctx) => {
  if (cmd === "dev") {
    /* 本地开发构建逻辑 */
  } else if (cmd === "build") {
    /* 生产环境打包构建逻辑 */
  }
};
```

Feflow 内置的构建器调度插件会调用 `lib/index.js` 这个模块，并传入两个参数给构建器，参数的解释在上述代码中已经给出了。目前支持两种构建命令，一个是 `feflow dev`，一个是 `feflow build`，分别对应开发环境和生产环境的打包构建。

## 编写构建逻辑

`builder-feflow-example` 构建器的构建逻辑很简单，你可以前往仓库 [builder-feflow-example](https://github.com/feflow/builder-feflow-example) 查看。

由于构建器和项目是分离的，所以在编写 Webpack 配置时要注意几个点：

1. 入口文件以及 HTML 文件都是在项目目录下的，所以 Webpack 配置的路径一定要写对
1. 如果你的项目要共享构建器的 Loader，一定要让 resolveLoader.modules 包含构建器项目下的 node_modules，否则 Webpack 只会去找项目下安装的 Loader
1. 其他涉及到路径的问题也一定要注意

## 更成熟的方案

上述的例子，仅仅是为了简单而砍掉了很多开发必备的功能，如果你想看更成熟的 React + Webpack 打包方案，我们现在就有，建议去看看：

* [builder-webpack4](https://github.com/feflow/builder-webpack4)


