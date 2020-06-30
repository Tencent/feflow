[English](./README.md) | 简体中文

<h1 align="center">Feflow</h1>

<p align="center">
  🚀 Feflow 是一个致力于提升大前端开发效率的前端工程化工具.
</p>

<br>

[![npm][npm]][npm-url]
[![Build Status][build-status]][build-status-url]
[![deps][deps]][deps-url]
[![Install Size][size]][size-url]
[![Downloads][downloads]][downloads-url]
[![lerna][lerna]][lerna-url]
[![GitHub contributors][contributors]][contributors-url]
[![Issue resolution][issue-resolution]][issue-resolution-url]
[![PR's welcome][pr-welcome]][pr-welcome-url]

---

## 项目介绍 README
 
 Feflow 是腾讯开源的一款大前端领域的工程化方案，致力于提升开发效率和规范。致力于解决下面三个场景的问题。
 
 - 前端工作流（脚手架 + 开发套件）
 
   首先，前端类型的项目技术栈发展迅速，更替频繁。常见的前端团队业务包含：APP内的H5业务、商业化运营活动、RN/Hippy业务、小程序、组件类和 Serverless Faas 函数等等。
   
   Feflow 提供脚手架、开发套件的能力，让前端类型的项目从创建、本地开发、测试到发布上线可以通过一行命令触发执行。
  
- 面向终端组件平台 Raft 支撑

  对于终端开发而言，Feflow 提供底层工具能力，支持腾讯轻舟组件平台的打造。

- 工具链打造
  
  Feflow 提供 JS 版本的插件机制和多语言插件机制，可以轻松基于 Feflow 的插件能力来定制团队的开发工具链体系打造。Feflow 提供安装、卸载、数据采集、日志上报、链式安装、增量更新等底层能力  
  

---

## 快速上手 Getting Started

1. 使用环境
    - Feflow 从 v0.16.0 版本开始，不再支持 Node 8 以下的版本。
  
    - 安装 CLI
  $ npm install @feflow/cli -g
    ```
    npm install @feflow/cli -g
    ```
  
    - 命令行推荐
  Mac OSX 用户推荐使用 item2，windows 用户推荐使用 cmder
  
      安装完成后，可以输入 $ fef 看看是否安装成功。
      
 2. 开始使用     

    在 Feflow 里面有3类命令，分别是原生命令、开发套件命令和插件命令

- 原生命令
  - `fef config`
  - `fef help`
  - `fef info`
  - `fef install`
  - `fef uninstall`
  - `fef list`

 - 安装模板或者插件
 
   在 Feflow 中，使用 install 命令去安装一个一个模板（基于 Yeoman）或者插件。比如：
   ```js
    fef install @feflow/generator-example
   ```  
   输入这行命令，Feflow即会开始安装，示例脚手架源码：@feflow/generator-example，安装的模板和插件会由 Feflow 统一管理，并且放在 ~/.fef 文件夹下（windows 在用户目录下的 .fef 文件夹）。

 - 创建项目
 
   安装完模板后，再次运行 fef init 命令，这个时候 Feflow 会把所有通过 Feflow 安装的模板显示出来供用户选择。
   ```js
    fef init
   ``` 
   
  - 开发调试
  
    项目创建完成后，可以进入到 my-project项目中进行正常开发。 通过查看配置文件可以获取这个项目可以使用的套件命令。
    
  - 体验发布
  
    通过套件命令进行打包发布
    
    更多使用详细信息可前往下面查看:
    - [Github Wiki](https://github.com/Tencent/feflow/wiki)
    - [官网](https://feflowjs.com/)

---
## 常见问题 FAQ

- 如何使用feflow

   可以查看feflow官网 以及[使用文档](https://github.com/Tencent/feflow/wiki/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B)

- 如何开发feflow
  可以查看[开发者文档](https://github.com/Tencent/feflow/wiki/%E5%BC%80%E5%8F%91%E8%80%85%E6%96%87%E6%A1%A3)   

- 如何反馈
  
  - 提出issue, 戳[这里](https://git.code.oa.com/teflow/feflow/issues)
  - 联系主要负责人

---

## 发布日志

本项目遵从 [Semantic Versioning](http://semver.org/).
每次发布信息都会在 Github 的 [Releases](https://github.com/Tencent/feflow/releases) 中呈现.

---

## 行为准则 code of conduct

为了更好地推进、管理协同，维护良好的协同环境，建立如下制度：
- [Teflow 内部激励制度](https://git.code.oa.com/teflow/discussion/issues/18)
- [Teflow 版本发布制度](https://git.code.oa.com/teflow/discussion/issues/10)
- [Teflow 每月例会制度](https://git.code.oa.com/teflow/discussion/issues/8)

---

## 如何加入 How to Join

> 欢迎有意向的个人或团队联系 @lewischeng。

Teflow Oteam 中我们秉持着开放共建，开源协作的思想，欢迎个人和团队加入 Teflow Oteam 的协同生态，为了保持团队活跃和激励参与协同共建，我们为协作人员的加入和成长制定以下机制，为想要参与协同共建的人员提供参考：

#### 协同人员

我们把协同人员分为 PMC，核心贡献者，贡献者三个维度。

#### 成为贡献者

任何参与协同的人员都是 Teflow 团队所欢迎的，任何团队或个人只要`有意参与协同`，包括但不限于从以下的任何角度成为贡献者：

 * 协同共建 Teflow Oteam

    * 制定标准
    * 开发特性
    * 解决issue
    * 编写测试用例
    * 维护文档

 * 落地实施 Teflow Oteam

    在团队或个人项目中落地实施 Teflow Oteam，认同 Teflow Oteam 思想和标准，并帮助推动以下内容的实施

    * 改进意见
    * 功能需求
    * issue

 * 运营推广 Teflow Oteam

    帮助新项目成功接入使用 Teflow Oteam 下的共建工具：

    * 积极参加月度例会，码客，乐问等 Teflow Oteam 相关讨论，给出实用建议并被推动实施。
    * 帮助组织 Teflow Oteam 会议与日常活动
    * 撰写 Teflow Oteam 相关专利文档
    * 撰写 Teflow Oteam 相关 KM 文章
    * 开设 Teflow Oteam 相关课程


#### 成为核心贡献者

任何贡献者都有机会成为我们的核心贡献者，核心贡献者是 Oteam 承认的在协同共建，落地实施和运营推广表现突出活跃的贡献者，Teflow Oteam 定时对核心贡献者给予表彰和奖励。

* 突出贡献认定，包括但不限于以下事项：

    * 为 Teflow Oteam 中项目的执行定制标准，给出优秀建议并被采纳实施
    * 主导 Teflow Oteam 中某一项目的开发或者重大特性开发
    * 提出需求并落地实施 Teflow Oteam 项目中重大新特性
    * 撰写 Teflow Oteam 相关专利文档，并成功申请专利
    * 开设 Teflow Oteam 相关课程，成为讲师


#### PMC 成员

 任何核心贡献者都可以申请成为 Teflow Oteam 的 PMC 成员。PMC 成员人数原则上不超过贡献者人数的三分之一，同一个贡献团队 PMC 成员不应该超过2人。 成为 PMC 成员需要：

  * 成为核心贡献者，并提出申请。

  * 由 Teflow Oteam PMC 半数人员通过。

  * 参与 Teflow Oteam 月度例会，在月度例会中明确个人/团队人力投入。

  * 明确协同计划和目标，承担协同共建，落地实施和运营推广的主要工作。

---

## 团队介绍 Members

协同团队分布涉及 PCG、CSIG、IEG、WXG 、TEG 事业群。根据目前 Feflow 的发展规划、项目范畴，协同分工如下：
| 负责范畴 | 参与人员 | PMC |
| :-----:| :-----:| :-----:|
| 技术负责人 | --- | @lewischeng(PCG-腾讯看点)|
| 工具中台建设 | @erasermeng(CSIG-在线教育部)<br>@blurooochen(PCG-研发部)<br>@theoxli(CSIG-在线教育部)<br> | @erasermeng(CSIG-在线教育部) |
|Web 版本开发| （待认领）| @homkerliu(IEG-游戏直播业务部)|
|CLI 版本开发| @ruikunai(PCG-新闻产品技术部)<br>@yanzhanghu(PCG-移动商业产品部)<br>@karltao(TEG-研发管理部)<br>@bethonxyfu(PCG-腾讯看点)<br> @dntzhang(WXG-微信支付研发部)@lewischeng(PCG-腾讯看点)<br> | @lewischeng(PCG-腾讯看点)|
|桌面版本开发|@salomezhang(PCG-移动应用平台部)<br>@littledu(WXG-微信增值)<br>@sarahjhuang(IEG-游戏直播业务部)<br>@tentenli(IEG-游戏直播业务部)|@lewischeng(PCG-腾讯看点)|

目前，CLI 版本与 Web 版本已经略有成果，并稳步推进中。另外，工具中台、Web 版本也在前期筹备与招募阶段。为了能够继续有效推进协同快速进展，诚邀有意向的各团队及个人参与共建。


## 许可证

[MIT](LICENSE.txt)


[build-status]: https://travis-ci.org/Tencent/feflow.svg
[build-status-url]: https://travis-ci.org/Tencent/feflow
[contributors]: https://img.shields.io/github/contributors/Tencent/feflow.svg
[contributors-url]: https://github.com/Tencent/feflow/graphs/contributors
[deps]: https://img.shields.io/david/Tencent/feflow.svg
[deps-url]: https://david-dm.org/Tencent/feflow
[downloads]: https://img.shields.io/npm/dw/@feflow/cli.svg
[downloads-url]: https://www.npmjs.com/package/@feflow/cli
[issue-resolution]: https://isitmaintained.com/badge/resolution/Tencent/feflow.svg
[issue-resolution-url]: https://github.com/Tencent/feflow/issues
[lerna]: https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg
[lerna-url]: http://www.lernajs.io/
[npm]: https://img.shields.io/npm/v/@feflow/cli.svg
[npm-url]: https://www.npmjs.com/package/@feflow/cli
[pr-welcome]: https://img.shields.io/badge/PRs%20-welcome-brightgreen.svg
[pr-welcome-url]: https://github.com/Tencent/feflow/blob/next/.github/CONTRIBUTING.md
[size]: https://packagephobia.now.sh/badge?p=@feflow/cli
[size-url]: https://packagephobia.now.sh/result?p=@feflow/cli
