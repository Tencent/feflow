title: 脚手架开发
---

目前feflow有两款内置脚手架工具，为generator-now-activity、generator-now-business	

- generator-now-activity: 是由IVWEB团队开发的一款生成`now-activity`项目脚手架的插件 

- generator-now-business: 是由IVWEB团队开发的一款生成`now-(h5|mobile|pc|web|app|qq)`项目脚手架的插件


## 脚手架简介

> 脚手架是指通过简单的指令帮助用户快速搭建好项目基本代码框架，从而减少重复性工作的工具。

相信你已经关注到feflow内置的脚手架工具是以'generator-'开头命名的，这是因为feflow的脚手架是利用[Yeoman](https://yeoman.io)工具的`yeoman-generator`来扩展构建的。

## feflow脚手架设计思路

我们需要给每个工程类型的项目创建一个generator，按照目前前端技术栈的发展情况来看，一个团队一般会有3～5个generator。通过工具上层的CLI将generator类插件暴露给开发者使用。

在generator之下，需要开发一系列服务和集成规范、包括与Git仓库打通，即通过脚手架初始化项目时，对开发者进行鉴权，之后根据开发者定义的项目名称在远程仓库里创建项目仓库并授予开发者权限。整体系统架构如下：

![架构](http://7tszky.com1.z0.glb.clouddn.com/FiwG7VvpYL3Tleaii9Q9dowGNJXv)

> 后续开发包括但不限于数据统计、分析各个业务仓库信息等功能。

## 创建自定义generator

开发者用户完全可以创建属于自己的脚手架，可以是简单的页面模板，亦可以是一套包含用户交互的量身定制的项目，这取决于开发者初始化的策略与需求。

一起来创建一个generator脚手架吧！

### 自定义目录结构

开发者可以自定义模板目录，这里我们定义了一个`templates`模板目录，`index.js`为我们初始化项目的策略。

```category
├─── package.json
└─── generators/
     ├─── app/
     |    ├─── templates/
     |    |    ├─── src/
     |    |    ├─── _cilintrc.js
     |    |    ├─── _eslintrc.js
     |    |    ├─── _fis-conf.js
     |    |    ├─── _package.json
     |    |    ├─── _project.js
     |    |    ├─── _README.md
     |    |    ├─── _editorconfig
	 |    |    ├─── _gitignore
	 |    |    └─── vcmrc
	 |    └─── index.js
	 └─── utils.js
```

```package.json
{
  "name": "generator-demo",
  "version": "0.1.0",
  "description": "生成自定义generator",
  "files": [
    "generators"
  ],
  "main": "generators/index.js",       // 入口文件
  "keywords": [
    "yeoman-generator"
  ],
  "dependencies": {
    "yeoman-generator": "^1.0.1"
  }
}
```

`package.json`可通过`npm init`或手动创建生成，也可利用`generator-generator`初始化。

!> name 必须以'generator-'开头，便于Yeoman依赖文件系统来寻找可用的generator。keywords属性必须包含'yeoman-generator'。


### 初始化Generator

通过继承Generator来扩展自定义的Generator，并将模块暴露给外部接口。

```javascript
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts)
	}
	
    /*
	 * Generator 运行周期
	 */

	initializing() {   // 初始化方法，检查并获取当前项目状态配置
		...
	}

	prompting() {      // 与用户进行信息交互
		... 
		return this.prompt([
			{
				type: 'input',
				name: 'username',
				message: '请输入您的姓名：',
				default: 'feflow-user'	
			},
			{
				type: 'confirm',
				name: 'generator_ins',
				message: '是否对编程感兴趣',
				default: true
			}
		]).then((answers) => {
			if(/\d+/g.test(answers.username)) {
				console.log('姓名不能包含数字!');
				return this.prompting()
			}
			console.log(`姓名：${answers.username}`);
			console.log('兴趣：编程');
		})
	}

	configuring() {    // 保存配置并通过创建.editorconfig文件和其他元数据文件来配置项目
		...
	}

	default() {        // 如果方法名未匹配优先级，则由default处理
		...
	}

	writing() {        // 处理模板
		...
	}

	conflicts() {      // 处理文件冲突
		...
	}

	install() {        // 安装依赖
		...
	}

	end() {            // 结束部分，输出结束信息
		...
	}
}
```
![#2](http://ov6wf6qsi.bkt.clouddn.com/image/blog/a.png)
## 运行Generator

进入项目根目录。

```shell
// 全局安装yo
npm install -g yo    

// 在本地的全局npm安装目录下安装自定义的Generator，以便调试
npm link            

// 运行本地Generator
yo [project name]      
```

## 连通Git code

`@tencent/feflow-utils`库具有获取当前RTX用户、申请项目BadjsID、数据上报等功能。<br>
`@tencent/git-code-api`库确保用户可创建gitcode项目，并自动提交项目。

```javascript
const Generator = require('yeoman-generator');
const git = require('../git');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.props = {};
	}
	prompting() {
		return this.prompt({
			type: 'confirm',
			name: 'createGitRepo',
			message: '是否需要创建远程Git仓库',
			default: true
		},{
		  type: 'input',
		  name: 'projectName',
		  message: '请输入活动的名称 (now-activity):',
		  default: 'now-activity-default'
		}, {
		  type: 'input',
		  name: 'description',
		  message: '请输入活动描述信息：:'
		}, {
		  type: 'input',
		  name: 'version',
		  message: '请输入版本 (1.0.0):',
		  default: '1.0.0'
		}).then((answers) => {
			if(answers.createGitRepo) {
				// 检查git.code.oa.com是否存在当前用户,返回promise
			}
		}).then((result) => {
			if (result && result.success) {                 // 若用户存在
				let userId;
				try {
					const userData = JSON.parse(result.data);
					const currUser = userData[0];
					if (currUser) {
						userId = currUser.id;
					}
				} catch (ex) {
				}
				if (userId) {
					this.props.userId = userId;             // 存储用户id
					return git.createProject(this.props.projectName, this.props.description);
				} else {
					log.info('检测到您当前不在Git code平台的开发名单之内，请先联系5000加入开发权限');
				}
			}	
		}).then((result) => {
			if (result && result.success) {
		        const cloneResult = git.cloneProject(this.props.projectName);    // 将项目拷贝到本地
		        if (cloneResult) {
		        	this.props.autoCommit = true;
		        }
		        try {
		        	const currProject = JSON.parse(result.data);
		        	if (currProject) {
		            	const projectId = currProject.id;
			            return git.addProjectMembers(projectId, this.props.userId);  // 授予用户master权限
		          	}
		        } catch (ex) {

		        }
			}
		}).then((result) =>{
			if (result && result.success) {
				log.info('您被ivwebgit授予仓库master权限');
			} else if (result && result.msg){
				log.error('授权失败:'+ result.msg);
			}
		})
	}
}
```
!> 注意：确保具有调用GitCodeAPI接口的权限。

### 扩展功能

目前内置的脚手架还可为项目自动生成BadjsID、离线包ID，用户也可根据自己团队的项目需求，扩展相应的功能。
