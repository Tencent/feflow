title: 快速开始
---

本教程适用于有一定开发经验或者需要快速用 `Feflow` 来开发的开发者。

## 安装 Feflow

`Feflow` 支持 Node 6.0+ 的版本，安装命令如下：

```sh
npm i feflow-cli -g
# or `yarn global add feflow-cli`
```

## 初始化 Feflow

依次运行下述命令来初始化 `Feflow`

```sh
feflow
feflow config set registry http://r.tnpm.oa.com
feflow config set proxy http://r.tnpm.oa.com:80
```

## 安装脚手架

推荐使用官方[通用脚手架](https://git.code.oa.com/feflow-plugin/generator-now-webpack)，运行以下命令安装：

```sh
feflow install @tencent/generator-now-webpack
```

## 创建项目

创建项目运行以下命令：

```sh
feflow init
```

然后根据终端的提示填写信息，对于需要填写 `Y/n` 的询问，暂时不用管，全部填写 `n`，如果你对每一项都非常感兴趣，可以阅读[更详细的教程](./start.md)。

## 开始开发

运行以下命令即可启用开发服务：

```sh
feflow dev
```

打开 http://127.0.0.1:8001 就能看到项目的首页，页面对应的是项目代码中 `src/pages/index/index.html` 文件。

## 打包构建

运行以下命令即可将项目代码进行打包构建：

```sh
feflow build
```

打包后的文件会生成在项目根目录的 `dist` 文件夹中。
