# 概览

欢迎来到feflow文档，如果在使用feflow的过程中遇到任何问题，请提交[issue](https://github.com/cpselvis/feflow-cli/issues/new)或者[Pull Requests](https://github.com/cpselvis/feflow-cli/pulls)。

## feflow是什么?

feflow是一个工程效率和规范的工具，贯穿整个项目的生命周期，从开发环境配置、初始化、代码构建、规范检查到发布上线。

截止到2017年8月，累计使用feflow创建超过40个项目，5次团队贡献代码行数统计，100+仓库规范检查。

## 安装


### 前置条件

安装feflow相当简单。 但是, 你需要首先安装Node.js:

如果你电脑里面已经安装了Node.js，恭喜你，请直接通过npm来安装feflow:

```bash
$ npm install feflow-cli -g
```

如果未安装Node.js，可以通过下面的指引来进行安装。

### 安装Node.js

安装Node.js的最好方式是通过Node Version Manager.
十分感谢nvm的创造者，他们提供了一个简单的脚本来自动安装nvm:

cURL:
```bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
```
Wget:
```bash
$ wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
```
一旦nvm安装成功，重启命令行终端并且允许下面的命令来安装Node.js:

```bash
$ nvm install stable
```

还有一种可供选择的路径，直接前往[Node.js官网](https://nodejs.org/en/)传送门.

## 开始使用feflow

如果是初次使用，feflow会在用户目录下创建.feflow文件夹、package.json和.feflowrc.yml配置文件。后续通过feflow install命令安装的脚手架和插件都会存放在这个文件夹下。

### 初次使用配置npm registry和proxy
feflow采用npm进行Yeoman脚手架和 feflow 插件安装，默认的npm registry为：http://registry.npmjs.org/ ， 你可以配置成cnpm的registry(https://registry.npm.taobao.org) 或者私有npm registry，如果有需要还可以配置proxy。如下：

```bash
? 请输入npm的registry: http://registry.npmjs.org/
? 请输入npm的proxy(默认为空):
```

### 初始化项目
初始化项目前需要安装Yeoman脚手架。当然，你可以根据业务需要，编写基于Yeoman的脚手架，然后发布到私有npm仓库里。那么如何安装一个Yeoman脚手架呢？

```bash
$ feflow install generator-webapp           # 安装一个现代webapp项目脚手架
$ feflow install generator-angular          # 安装一个angular项目脚手架
$ feflow install generator-react-webpack    # 安装一个react项目脚手架
```
当然您也可以通过 feflow install 一次性安装上面所有的脚手架，安装完成后通过 init 开始创建项目吧~

``` bash
➜  ~ feflow init
? 您想要创建哪中类型的工程? (Use arrow keys)
❯ Yeoman generator for AngularJS
  Yeoman generator for using React with Webpack via Babel
  Scaffold out a front-end web app
```

### 使用Feflow插件
feflow的大部分功能都是通过外部插件来进行扩展支持的。安装插件和安装脚手架一样简单，如下：

```bash
$ feflow install feflow-plugin-deps         # 安装一个IVWEB团队开发全局依赖包环境管理插件
```
然后就可以使用插件暴露出来的命令了。
```bash
$ feflow deps --global                      # 安装IVWEB团队基于React、Redux、FIS3环境全局依赖
```

## 建议
* windows用户推荐使用[cmder](http://cmder.net/), 也可以使用windows cmd或者powershell。不要使用Git bash, git bash对命令行支持的不友好。
* OSX用户可以使用高大上的iterm2，必备神器
