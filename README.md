feflow
=========================================================
A command line tool aims to improve front-end engineer workflow.


### 安装Node.js
请直接前往[Node.js官网传送门](https://nodejs.org/en/download/)

### 安装tnpm
```sh
$ npm install @tencent/tnpm -g --registry=http://r.tnpm.oa.com --proxy=http://r.tnpm.oa.com:80 --verbose
```

### 安装feflow-cli和yeoman
```sh
$ tnpm install yo generator-generator @tencent/feflow-cli -g 
```

### 开始初始化项目
支持业务项目和活动项目初始化
``` sh
$ feflow init
```
运行命令后，您需要选择是初始化一个业务项目或者一个活动项目。会自动在[avweb Group](http://git.code.oa.com/groups/avweb)或者[now-activity Group](http://git.code.oa.com/groups/now-activity)里面创建仓库，并且克隆到本地，之后会本地生成目录结构和代码。
示例如下：
       ![3063DA66-CB79-4C34-A644-26185F13B2DE.png](/lewischeng/daily-record/uploads/CFFD858F11664465897016CC8C5F713F/3063DA66-CB79-4C34-A644-26185F13B2DE.png)

### Issues
反馈或建议地址：[issues](http://git.code.oa.com/feflow/discussion/issues)