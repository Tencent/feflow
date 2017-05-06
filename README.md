### 安装Node.js
要求6.x版本以上，请直接前往[Node.js官网传送门](https://nodejs.org/en/download/)

### 安装tnpm
```sh
$ npm install @tencent/tnpm -g --registry=http://r.tnpm.oa.com --proxy=http://r.tnpm.oa.com:80 --verbose
```

### 安装feflow-cli
```sh
$ tnpm install @tencent/feflow-cli -g 
```

### 首次使用初始化
第一次使用feflow的核心命令，比如init、scan、install等等，会提示初始化信息。需要开发者输入outlook的用户名和密码方可使用，比如：

![tapd_10132111_base64_1493780274_87.png](/feflow/feflow-cli/uploads/0E0A589D79D3482ABB4D48B291B0170E/tapd_10132111_base64_1493780274_87.png)


初始化完成后需要重新运行命令，然后正式开始使用feflow吧~

### 安装脚手架
使用feflow install <plugin>命令来安装一个符合类型的插件，脚手架作为一个特殊的插件，需要以generator-作为前缀。

* 安装活动脚手架
```sh
$ feflow install @tencent/generator-now-activity
```
* 安装app业务脚手架
```sh
$ feflow install @tencent/generator-now-business
```

### 初始化项目
支持业务项目和活动项目初始化
``` sh
$ feflow init
```
运行命令后，您需要选择是初始化一个业务项目或者一个活动项目。会自动在[avweb Group](http://git.code.oa.com/groups/avweb)或者[now-activity Group](http://git.code.oa.com/groups/now-activity)里面创建仓库，并且克隆到本地，之后会本地生成目录结构和代码。

### 规范扫描
扫描命令：
```sh
$ feflow scan --receiver=您的邮箱 

Example:
$ feflow scan --receiver=lewischeng@tencent.com
```

扫描规则：

* Git commit规范扫描
   * 规则：判断master分支是否有.vcmrc文件
* avweb Group项目命名扫描
   * 规则：项目是否以now-(h5|pc|web|app|qq|mobile)-xxx来进行命名
* 项目描述信息扫描
   * 规则：描述信息大于或者等于5个字符

### 建议
* windows用户请使用windows cmd或者powershell。不要使用Git bash, git bash对命令行支持的不友好。
* OSX用户可以使用高大上的iterm2，必备神器

### Issues
反馈或建议地址：[issues](http://git.code.oa.com/feflow/discussion/issues)