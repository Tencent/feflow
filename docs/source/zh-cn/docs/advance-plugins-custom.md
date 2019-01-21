title: 自定义插件
---

Feflow 之所以强大离不开它的插件设计，你可以把 Feflow 看成是一个核心和一大堆插件组成的生态。

## 开发一个 Feflow 插件

**开发一个 Feflow 插件非常简单，并且任何程序都能成为 Feflow 插件。**

开发一个 Feflow 插件意味着给 Feflow 增加命令，例如你可以给 Feflow 增加一个 `add` 命令，让 Feflow 实现一个加法运算：

```sh
feflow add 1 2 3
# 输出 6
```

接下来，让我们就用这个例子来讲解一下如何开发一个 Feflow 插件。

## 创建项目

创建一个名为 `feflow-plugin-example` 的文件夹，并用 `npm init` 命令将它初始化。

**注意，所有 Feflow 插件的项目目录名都必须以 `feflow-plugin-` 开头，并且项目内的 `package.json` 文件中的 `name` 字段必须和项目目录名保持一致。**

## 编写逻辑

新建一个 `index.js` 文件，实现加法运算逻辑，这时候暂时先无需考虑和 Feflow 插件相关的事情，只需要专注于你的逻辑：

```js
/**
 * 加法运算器
 * @param  {Array} args 一些需要累加的数字
 * @return {number} 累加的和
 */
function add (args) {
    const sum = args.reduce((sum, item) => {
        return sum + item
    }, 0)

    console.log(sum)
    return sum
}
```

## 注册命令

加法逻辑写好了，现在需要实现的就是将这个程序变成 Feflow 插件，即注册一个 `add` 命令到 Feflow：

```js
feflow.cmd.register('add', '加法运算器', function(args) {
    // args 是 add 后面的参数，已被 minimist 库解析
    // 例如 `feflow add 1 2 3`，args 就是 { _: [1, 2, 3] }，
    // 再比如 `feflow add -x 1 -y 2 --z-value 3 4 5 6`，args 就是 { _: [ 4, 5, 6 ], x: 1, y: 2, 'z-value': 3 }
    // 调用主要的逻辑
    add(args._);
});
```

你无需担心 `feflow` 没有声明或者没有任何模块的引用，Feflow 在使用这个插件的时候，会自动将 `feflow` 变量注入到**入口文件**（由  `package.json` 中的 `main` 字段决定，这里是 `index.js`）的全局作用域中。

`feflow.cmd.register` 函数接收三个参数：

* 第一个是想要给 Feflow 增加的命令名称
* 第二个是对这个命令的描述说明信息（会在 feflow --help 中显示出来）
* 第三个是新增的命令对应的执行函数。

执行函数中，Feflow 会传递一个参数 args，它是一个对象，包含着 Feflow 运行该命令时所有在该命令后的参数。例如，运行 `feflow add 1 2 3` 时，args 就是 { _: [1, 2, 3] }。

## 插件调试

截至目前，你已经完成了一个插件，完整的代码可参考[这里](https://github.com/feflow/feflow-plugin-example/tree/e21b0b5c5f5b860e78e5d914f4ce4ccf366eee8d)。你可能迫不及待想试试。别急，让我们一步一步来。

1. 运行 `npm link` 将插件项目链接到 NPM 全局。
1. 运行 `cd ~/.feflow` 进入到 Feflow 主目录下。
1. 运行 `npm link feflow-plugin-example` 将插件安装在 Feflow 主目录下。
1. 编辑 `~/.feflow/package.json` 文件（可用 `vi ~/.feflow/package.json` 编辑），在 `dependencies` 字段中添加一行 `"feflow-plugin-example": "1.0.0"`。
1. 运行 `feflow add 1 2 3` 启用插件。

## 插件发布

插件开发完毕后，接下来就可以发布插件了，你可以发布到 NPM 上，也可以发布到私有 NPM 仓库里。如果发布到私有仓库，可能需要配置一下 Feflow 下载包的 `register` 和 `proxy`，配置方式参考[插件](./base-plugins-inner#全局配置插件)。

发布完之后，你就可以通过 `feflow install` 命令安装插件。

## 插件上下文

虽然你的插件已经可以用了，但是有些细节还能在优化一下。

`feflow` 这个全局变量还提供了许多其他功能，这些功能让你的插件与 Feflow 结合的更紧密。我们把 `feflow` 这个全局变量称为插件上下文。它可以访问到 Feflow 实例上的所有属性。

还是以 `feflow-plugin-example` 为例，在 `add` 函数中，我们用了一个 `console.log` 打印出运算结果，如果你致力于将插件打造成优秀的体验，你可以使用 `feflow.log.info` 来代替它。插件上下文提供了一个符合 Feflow 控制台输出规范的 API，这将保持插件与 Feflow 一致性的体验：

```
const log = feflow.log;
log.info()    // 提示日志，控制台显示 `Feflow INFO [打印内容]`，`Feflow INFO` 为绿色文字。
log.debug()   // 调试日志，需要在命令行增加 --debug 才可启用这个方法，控制台显示 `Feflow DEBUG [打印内容]`，`Feflow DEBUG` 为灰色文字。
log.warn()    // 警告日志，控制台显示 `Feflow WARN [打印内容]`，`Feflow WARN` 被黄色背景填充。
log.error()   // 错误日志，控制台显示 `Feflow ERROR [打印内容]`，`Feflow ERROR` 被红色背景填充。
log.fatal()   // 致命错误日志，控制台显示 `Feflow FATAL [打印内容]`，`Feflow FATAL` 被红色背景填充。
```

更多属性和方法可参照 [插件上下文 API](./advance-plugin-context.html)

### 非入口文件使用插件上下文

上面的例子中，我们可以直接在 `index.js` 入口文件中使用插件上下文，但如果在非入口文件直接这么使用的话，会报错，所以得通过模块之间传参传过去。

举个例子，现在我们再新建一个 `add.js` 文件，将 `index.js` 文件中的 `add` 函数移过去，`add.js` 和 `index.js` 就变成了下面这样：

```js
// add.js
// 整个模块接收一个插件上下文参数
module.exports = function add (feflow) {
    // 原函数逻辑
    return function (args) {
        const sum = args.reduce((sum, item) => {
            return sum + item
        }, 0)

        feflow.log.info(sum)
        return sum
    }
}

// index.js
// 通过模块传参将插件上下文传递过去
const add = require('./add')(feflow)
// 注册一个 add 命令
feflow.cmd.register('add', '加法运算器', function(args) {
    add(args._);
});
```

模块化后的完整代码可以参考[这里](https://github.com/feflow/feflow-plugin-example/tree/36127e14a6bc7ea0cd696a35f4b59255349d19bc)

## 注册多个命令

一个插件可以支持多个命令，所以我们不妨将 `feflow-plugin-example` 做的完善些，让它支持加减乘除四则运算。

最后，你可以在[这里](https://github.com/feflow/feflow-plugin-example) 看到我们最终的插件。
