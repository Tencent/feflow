# 概览

欢迎来到feflow文档，如果在使用feflow的过程中遇到任何问题，请提交[issue](https://github.com/iv-web/feflow-cli/issues/new)或者[Pull Requests](https://github.com/iv-web/feflow-cli/pulls)。

## feflow是什么?

feflow是一个工程效率和规范的工具，贯穿整个项目的生命周期，从开发环境配置、初始化、代码构建、规范检查到发布上线。

截止到2017年8月，累计使用feflow创建超过40个项目，5次团队贡献代码行数统计，100+仓库规范检查。

## 安装


### 前置条件

安装feflow相当简单。 但是, 你需要首先安装下面这些软件:

* Node.js
* Git

如果你电脑里面已经有了这些软件，恭喜你，请直接通过tnpm来安装feflow:

```bash
$ npm install feflow-cli -g
```

如果未安装Node.js和Git，可以通过下面的指引来进行安装。

### 安装Git

* Windows: 下载 & 安装 git.
* Mac: 通过Homebrew, MacPorts 或者 installer.
* Linux (Ubuntu, Debian): sudo apt-get install git-core
* Linux (Fedora, Red Hat, CentOS): sudo yum install git-core

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

## 建议
* windows用户推荐使用[cmder](http://cmder.net/), 也可以使用windows cmd或者powershell。不要使用Git bash, git bash对命令行支持的不友好。
* OSX用户可以使用高大上的iterm2，必备神器
