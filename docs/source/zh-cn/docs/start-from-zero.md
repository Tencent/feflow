title: 开始
---

本教程适用于任何人，如果你需要快速用 `Feflow` 来开发，那么请看[快速开始](./index.md)

Feflow 是一个前端工程化工具，它能轻易地帮你完成从项目创建、开发、构建到发布的所有流程，这么说可能还是不明白，下面让我们通过几分钟的例子来亲自感受一下。

## 安装 Feflow

`Feflow` 支持 Node 6.0 以上的版本，你可以使用以下命令来安装：

```sh
npm i feflow-cli -g
# or `yarn global add feflow-cli`
```

如果你是第一次安装，那么需要运行一次 `Feflow` 来初始化：

```sh
feflow
```

这时你会看到如下界面：

![Feflow初始化](https://qpic.url.cn/feeds_pic/ajNVdqHZLLBnQ35KoavYEVib5rbiahTaHy5yk9XoTAauib7EYVzbD4zlw/)

这里让你填写的 npm registry 和 npm proxy 是为了让你用 `Feflow` 安装插件的时候保证网络畅通。比如说如果你的插件是在 tnpm 上，那么这里的 npm registry 要填写 http://r.tnpm.oa.com，而 npm proxy 要填写 http://r.tnpm.oa.com:80，这样一来，`Feflow` 在安装插件时，就会通过这个配置进行包的下载。

如果你不小心一路回车使用了默认配置，但是你的插件的私有仓库里，那么你还可以通过以下命令来配置。以 tpm 为例：

```sh
feflow config set registry http://r.tnpm.oa.com
feflow config set proxy http://r.tnpm.oa.com:80
```

> 关于 feflow config 命令的详解可以看[这里](.)

为了继续本教程，请务必配置执行上述命令哦。

## 安装脚手架

`Feflow` 的核心部分并没有一个脚手架，脚手架都是通过插件的形式来安装的。为了简单起见，你可以先使用我们团队提供的脚手架 `[generator-now-webpack]((https://git.code.oa.com/feflow-plugin/generator-now-webpack)` 来继续这个教程。可以用如下命令安装：

```sh
feflow install @tencent/generator-now-webpack
```

> 关于脚手架详细内容可以看[这里](.)

到这里，脚手架就安装成功了，下面就可以开始创建项目了。

## 创建项目

> 官方教程假设你已经知道如何打开终端或者 cmd.exe，并且知道 shell 的一些初级知识，例如命令、环境变量等，以及已经在电脑上安装好了 Node v8.0 以上的版本。

你可以直接运行以下命令开始项目的创建：

```sh
feflow init
```

执行命令后，就会让你选择脚手架了。

### 选择脚手架

![脚手架选择](https://qpic.url.cn/feeds_pic/Q3auHgzwzM7gVx6mBUxNNFeUGVZI0RzI7hcn2za3VW7ia9B1oP2L7OQ/)

Feflow 会让你从现有的脚手架中选择一个来创建项目，目前你只安装一个脚手架，所以只用选择 `基于 React + Redux + Webpack 的 web 业务开发解决方案` 就好。它是一个多页面脚手架，用它创建的项目自带 `React` 和 `Redux` 库，且使用 `Webpack` 作为构建工具。

> 关于官方推荐的脚手架的详细介绍可参考[此文档](.)

### 创建远程仓库

选择完脚手架后，紧接着你又看到如下界面：

![Git仓库创建](https://qpic.url.cn/feeds_pic/PiajxSqBRaEJyqw9knm4CLEQ4QRRbjFQZic6MXthn1acIt8Bvf0EJeDw/)

是的，你没有看错，你无需在 `工蜂（git.code.oa.com）` 中创建一个仓库然后再与本地仓库关联起来，这个过程 `Feflow` 会自动帮你完成。当然，如果你已经在 `工蜂（git.code.oa.com）` 中创建了一个仓库并且克隆到了本地，你可以在这里输入 `n` 并按下回车。本教程假设你并没有一个仓库，所以你需要在这里输入 `y`。

接下来，`Feflow` 会让你输入项目名称：

![项目名称](https://qpic.url.cn/feeds_pic/PiajxSqBRaEJCIiad6HuhWfgkc9DpRnK7h95uf1hhRJicIHchdyibHwfXg/)

每个团队的项目名称都需要一个规范，这样一眼就能从名称看出这是属于哪个业务、哪个平台的项目，方便项目归类和管理。但是，通常这个规范往往难以记住，特别是团队如果有新人来的时候，根本不知道有这个规范。`Feflow` 通过在创建项目的时候给予提示来解决这个问题。

如上图所示，`Feflow` 团队的项目名称规范是 `业务类别-项目类型-项目名字`，你可以参考，也可以输入其他你想输入的项目名称。

### 项目描述、版本号
输完项目名称之后，`Feflow` 还会让你输入项目描述和版本号，项目描述尽可能写详细，让团队其他成员能够知道这个项目是干什么的，版本号尽可能合理，最好有团队自己的版本规范。

### 接入 BadJS

接下来，`Feflow` 会让你选择是否需要接入 `BadJS`。`BadJS` 是我们团队监控项目质量的系统，你可以通过它定位到项目的报错，这里推荐使用：

![BadJS选择](https://qpic.url.cn/feeds_pic/PiajxSqBRaEJDTcTrNglmJFaXXtCDLlgGq6UZJTf7jrtAmIbRBQM3hA/)

一旦你确认选择之后，`Feflow` 会自动去申请 `BadJS ID`，并填充到生成的项目里面，这样一来，就省去了人工的步骤，同时又让项目有了质量保障。

> 关于如何使用 `BadJS` 来管理项目的质量请看[这篇文章](.)

### 申请离线包 ID

让我们继续走下去，下一步 `Feflow` 会让你选择是否自动申请离线包 ID：

![离线包选择](https://qpic.url.cn/feeds_pic/ajNVdqHZLLCKwy1cT4Tr3Z1wovA8Vzh2qATlnCHmEsGNX3Qpo89Y9w/)

> 离线包是我们团队提高页面加载速度的方案之一，简单地来说，它会将 `HTML`、`JS`、`CSS` 等静态文件存储在用户的设备上，下次打开页面时，会直接读取设备上的资源。当然，如果页面有更新，那么新的离线包会被下载下来，等到用户下次进页面时，就会启用新的离线包。而离线包 ID 则是离线包的唯一标识，能让页面下载指定的离线包。
>
> 关于离线包的详情可参考[这篇文章](.)

如果你考虑在项目中使用我们的离线包方案，那么就需要确认选择该项，这样的话 `Feflow` 就会自动申请 `离线包 ID` 并填充到生成的项目中，让页面有了使用离线包的能力。

### 申请 `Monitor id`

接下来，`Feflow` 会让你选择自动申请 `Monitor id`：

![MonitorId选择](https://qpic.url.cn/feeds_pic/ajNVdqHZLLBGx7WlUpaTpjSmwUqzPXgnWV7saiaTWjApBicTMBcxe2mg/)

> Monitor 是我们团队的数据监控系统，像页面PV、接口异常等都会上报到该系统，然后你就能在该系统上看到这些数据有多大的量，可以帮助发现业务的异常，也可以帮助知道业务的各种指标等。而一个 `Monitor id` 就对应着一种数据的上报。

如果你选择了该项，那么 `Feflow` 会自动申请页面PV 的 `Monitor id`、页面 BadJS 的 `Monitor id`，然后自动生成在项目中。如此一来，项目便具有了这些数据上报的能力。

### 接入 `Jenkins CI`

最后还有一步，`Feflow` 会问你是否接入 `Jenkins CI`：

![Jenkins选择](https://qpic.url.cn/feeds_pic/PiajxSqBRaELIkv2Wa0l9SxTJRTsRAq4oIt78dgcLSrK2SbsF4942HQ/)

如果你选择了该项，那么每次代码提交都会在我们团队的 `Jenkins CI` 平台进行构建。

现在，你的 `Feflow` 估计已经在创建项目了，你能从终端的实时日志中看到 `Feflow` 当前的状态。如果过程中还需要输入一些信息，那么按照提示输入即可。

## 开始开发

项目创建好后，在项目目录下运行 `npm i` 安装好依赖，然后再运行 `npx feflow dev` 或者 `feflow dev` 就能启动本地服务，服务默认运行在 http://127.0.0.1:8001。

打开 http://127.0.0.1:8001，你会看到初始态的一个页面。如果你想修改这个页面，则需要先大概了解一下项目的目录结构，知道去哪改。

项目的目录结构是由你所选择的脚手架决定的，以本教程所使用的脚手架为例，生成的项目主要结构如下：

```sh
|- src
    |- actions # 公共的 actions 目录
    |- assets # 公共的 JS、CSS、Images 目录
    |- middleware # 公共的 Redux 中间件 目录
    |- modules # 公共模块
    |- pages # 页面目录
        |- index # 首页
            |- actions # 页面级的 actions 目录
            |- assets # 页面级的 JS、CSS、Images 目录
            |- components # 页面级的公共组件目录
            |- reducers # 页面级的 reducers 目录
            |- index.html # HTML 入口
            |- index.js # 页面 Class
            |- index.less # pageComponent.js 中元素的样式，或者全局样式
            |- init.js # JS 入口
            |- pageComponent.js # React 根组件
            |- report.js # 配合 pageComponent.js 组件的上报工具
    |- reducers # 公共的 reducers 目录
|- config.json
|- feflow.json # Feflow 配置文件
|- project.js # 项目配置文件
```

其中，`src/pages/index/index.html` 就是 `http://127.0.0.1:8001` 展示的页面。你可以打开 `src/pages/index/pageComponent.js` 文件进行修改。

## 打包构建

如果你使用捷豹进行部署或者创建项目的时候自动接入 Jenkins CI，那么这一步可以直接跳过。因为捷豹会在部署前会帮我们打包构建，而 Jenkins CI 则是在我们 Git 提交时帮我们构建。

项目开发满意后，你可能想部署到正式环境中，那么首先就得把项目代码构建成浏览器能运行的版本。运行 `npx feflow build` 或者 `felfow build` 就会在项目根目录下生成一个打包后的目录，不同脚手架、不同构建器生成的目录以及目录里面的内容都各不相同。

以教程中的项目为例，运行 `feflow build` 就会生成一个 `dist` 目录，里面的目录结构如下：

```sh
|- cdn
    |- <bizName> # 目录名根据 feflow.json 中的业务名称属性 bizName 决定，里面包含 JS、CSS 和图片等静态资源
        |- img # 图片资源
|- offline
    |- offline.zip # 离线包
|- webserver
    |- <bizName> # 目录名根据 feflow.json 中的业务名称属性 bizName 决定，里面包含了页面入口
        |- index.html # 首页页面入口
```

你现在可以把打包后的文件部署在服务器上。

## 部署

### 捷豹部署

使用腾讯内部的捷豹部署是我们团队目前的部署方式之一，这里简单做个介绍。<未完待续>

### Jenkins CI

捷豹部署仍然需要我们在捷豹系统里面操作，更自动化的方式是接入我们团队内部的 `Jenkins CI`。`Feflow` 是默认支持接入的，如果你在创建项目时选择接入了，那么这时候项目根目录下就会有一个 `Jenkinsfile` 文件。

默认情况下，项目只要提交就会触发 `Jenkins CI` 帮你构建并将打包后的文件存在 `Jenkins CI` 的机器上。如果你想同步到捷豹上，则还需要在 `Jenkinsfile` 加上如下配置，加的位置文件中会做提示：

```sh
jbMap[<分支名，如 master>] = <捷豹单号，如 R010518>
```

一旦加上这个配置，`Jenkins CI` 服务就会将项目的指定分支打包出来的文件部署到捷豹上。

> 自动部署到其他平台可以通过编写自己的脚手架来实现，上述都是教程中所使用的脚手架的功能。

## 发布

### ARS 发布

<未完待续>

### 织云发布

<未完待续>