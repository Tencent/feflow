title: 自定义脚手架
---

当运行 `feflow init` 的时候，Feflow 的内置插件会调用一个脚手架来创建项目。那么，如何创建一个自己的脚手架呢？

其实不难，我们充分利用了社区的力量，只要你的脚手架是一个 Yeoman 脚手架即可。如果你会开发 Yeoman 脚手架，那么你已经基本能够开发一个自己的脚手架了；如果你不会，文章后面的部分也会简单地讲解一下。

## 开发一个 Yeoman 脚手架

如果你已经会开发一个 Yeoman 脚手架了，可以跳过这个章节。但要注意以下要点：

* 脚手架项目下 `package.json` 文件的 `description` 字段不能为空。因为在用户选择脚手架时，Feflow 需要用这个字段来提供脚手架说明。

如果你没有 Yeoman 脚手架的开发经验，那也别急，接下来会给一个入门指导，更详细的开发文档请阅读[官方文档](https://yeoman.io/authoring/)。

### 准备工作

全局安装 `yo` 和 `generator-generator`：

```sh
npm install yo generator-generator -g
# or yarn global add yo generator-generator
```

这里借助了 Yeoman 以及他们写的脚手架生成器，目的是为了快速让大家创建出自己的脚手架。这不是必须选项，但在本教程中最好是按这个步骤来，否则下面可能没法继续。

### 生成脚手架模版

现在，只需一行命令即可生成一个脚手架模版：

```sh
yo generator
```

再次强调，**生成过程中询问的 `Description` 一定要填写**，Feflow 会使用它来提供脚手架说明。

你可能会注意到，**生成出来的脚手架模版的项目名是以 `generator-` 开头的**，如果你自己手动创建一个脚手架，这也是必须的。

让我们来看一下生成的脚手架模版的主要目录结构：

```sh
├── generators/
|   └── app/
│       ├── index.js
│       └── templates/
│           └── dummyfile.txt
```

其中，`generators/app/index.js` 文件就是脚手架生成项目的逻辑，而 `generators/templates/` 文件夹就是一个项目模版。后面我们主要就是在这两个地方做定制，改造出自己的脚手架。

### 创建自己的脚手架

#### 项目模版

对于团队来说，一般都会有自己的项目目录结构规范，或者是有现成的项目模版，那要转换成 Yeoman 脚手架的项目模版就很简单了，直接找个项目或者把项目模版复制粘贴到 `generators/templates/` 文件夹下即可。但是要接入 Feflow 还需要做些工作。

对于个人或者还没有项目模版的团队来说，首要任务当然是规划好自己的项目模版了。在本文示例中，我们将创建一个非常简单的、支持 React 的项目模版。

##### 创建模版

我们的模版主要的目录结构如下：

```sh
|- src # 示例源码
    |- index.html # HTML 入口
    |- index.js # JS 入口，也是 Webpack 打包的入口
|- _babelrc # 处理 JSX 的配置
|- feflow.json # 这个文件是必须的，作为项目和 Feflow 的桥梁
```

其中，如果项目中含有 `.babelrc` 这样的文件，推荐在模版中将 `.` 换成 `_`，写成 `_babelrc` 这样的形式。

另外，`feflow.json` 是必须的配置文件，Feflow 会读取其中的构建器配置来对 src 中的源码进行打包构建。

这里要说明一下，Feflow 定义了一个构建器的概念，实际上它指的就是把构建的代码抽离出项目形成的 NPM 包。这样做的好处在于，团队内部的项目遇到构建工具升级的时候，无需对每个项目都进行一遍升级，只需要升级构建器并更改项目中 `feflow.json` 中的配置即可。其他的好处例如节省本地空间、节省项目安装依赖包的时间、统一构建规范等等。

下面是我们这个项目示例的 `feflow.json` 的配置：

```json
{
    // builderType 指明了构建器的名称
    "builderType": "builder-feflow-example",
    "builderOptions": {
        // 你可以在这里加入自定义构建器构建流程的配置项，例如是否需要压缩 HTML 等
    }
}
```

> 构建器 builder-feflow-example 只适用于本教程示例脚手架生成的项目，其他脚手架生成的项目需要适配构建器，关于构建器的开发请阅读 [自定义构建器](./advance-builder-custom.html) 这一章。

##### 动态模版内容

如果你想在你的项目模版中加入动态的内容，例如根据询问用户得到的答案来填充项目名称，你就可以在项目模版下的 `package.json` 中这样写：

```json
{
  "name": "<%= name %>"
}
```

Yeoman 模版支持 <%= *variable* > 这样的语法来填充动态内容，其中的 *variable* 是如何传进来将会在后面看到。

### 项目生成逻辑

有了项目模版之后，我们还缺少根据项目模版创建一个项目的逻辑。最简单逻辑就是复制一份模版到当前目录下，当然，高级点的脚手架一般都会有如下过程：

1. 询问并接收用户的输入；
1. 执行一些自定义的脚本；
1. 根据用户输入和脚本执行的结果渲染项目模版，并生成于当前目录下。 

上述的这些逻辑统统都写在 `generators/app/index.js` 文件中。通常来说，这个文件都满足如下格式：

```js
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // 初始化阶段
    initializing () { /* code */ },
    // 接收用户输入阶段
    prompting () { /* code */ },
    // 保存配置信息和文件
    configuring () { /* code */ },
    // 执行自定义函数阶段
    default () { /* code */ },
    // 生成项目目录阶段
    writing () { /* code */ },
    // 统一处理冲突，如要生成的文件已经存在是否覆盖等处理
    conflicts () { /* code */ },
    // 安装依赖阶段
    install () { /* code */ },
    // 结束阶段
    end () { /* code */ }
}
```

Yeoman 提供了一个基础的生成器类 `Generator`，我们基于它扩展自己的生成逻辑。`Generator` 类定义了八个生命周期，它们会按上述代码的顺序依次执行。

示例脚手架的生成逻辑可[阅读这里](https://github.com/feflow/generator-feflow-example/blob/master/generators/app/index.js)

### 调试

现在，你的脚手架就定制好了，让我们来试一试吧。先安装在 Feflow 主目录下：

```sh
cd <your-path>/generator-startkit-demo
npm link
cd ~/.feflow
npm link generator-startkit-demo
```

然后再编辑 `~/.feflow/package.json` 文件（可用 `vi ~/.feflow/package.json` 编辑），在 `dependencies` 字段中添加一行 `"generator-startkit-demo": "1.0.0"`（版本号随意）。目的是为了让 Feflow 找到你的脚手架。

现在，可以在你想创建项目的位置运行 `feflow init` 了。你会看到你的脚手架被展示出来了，选择它，就能开始项目的创建了。

> `generator-feflow-example` 的源码地址是 https://github.com/feflow/generator-feflow-example

## 更成熟的方案

上述的例子，仅仅是为了简单才这样设计，满足不了生产环境的使用，如果你想看更成熟的脚手架方案，我们现在就有，建议去看看：

* [generator-ivweb](https://github.com/feflow/generator-ivweb)