<a name="0.8.4"></a>
## [0.8.4](http://git.code.oa.com/feflow/feflow-cli/compare/v0.8.0...v0.8.4) (2017-07-27)


### Bug Fixes

* 修复当前版本和远程最新版本判断错误的bug. ([4ea48f9](http://git.code.oa.com/feflow/feflow-cli/commits/4ea48f9))


### Features

* 支持loading ([09fe22e](http://git.code.oa.com/feflow/feflow-cli/commits/09fe22e))



<a name="0.8.0"></a>
# [0.8.0](http://git.code.oa.com/feflow/feflow-cli/compare/v0.7.5...v0.8.0) (2017-07-24)


### Bug Fixes

* 当前的版本号显示package.json里面的版本. ([d7f6cd6](http://git.code.oa.com/feflow/feflow-cli/commits/d7f6cd6))


### Features

* Github oauth鉴权。 ([20069b6](http://git.code.oa.com/feflow/feflow-cli/commits/20069b6))
* 使用feflow的统一info和error输出格式. ([1341a22](http://git.code.oa.com/feflow/feflow-cli/commits/1341a22))



<a name="0.7.5"></a>
## [0.7.5](http://git.code.oa.com/feflow/feflow-cli/compare/v0.7.4...v0.7.5) (2017-07-14)


### Bug Fixes

* 修复高版本的npm依赖问题 ([3ecd745](http://git.code.oa.com/feflow/feflow-cli/commits/3ecd745))



<a name="0.7.4"></a>
## [0.7.4](http://git.code.oa.com/feflow/feflow-cli/compare/v0.7.3...v0.7.4) (2017-07-14)


### Bug Fixes

* 修复feflow安装时modules信息未写入的bug. ([2469c85](http://git.code.oa.com/feflow/feflow-cli/commits/2469c85))


### Features

* 支持-h, -H简写的命令 ([1b1f719](http://git.code.oa.com/feflow/feflow-cli/commits/1b1f719))



<a name="0.7.3"></a>
## [0.7.3](http://git.code.oa.com/feflow/feflow-cli/compare/v0.7.2...v0.7.3) (2017-06-22)


### Features

* 增加publish命令的usage ([bbd5297](http://git.code.oa.com/feflow/feflow-cli/commits/bbd5297))
* 增加增量更新功能 ([a062d98](http://git.code.oa.com/feflow/feflow-cli/commits/a062d98))



<a name="0.7.2"></a>
## [0.7.2](http://git.code.oa.com/feflow/feflow-cli/compare/v0.7.1...v0.7.2) (2017-05-31)


### Bug Fixes

* 版本bug. ([63113b0](http://git.code.oa.com/feflow/feflow-cli/commits/63113b0))



<a name="0.7.1"></a>
## [0.7.1](http://git.code.oa.com/feflow/feflow-cli/compare/v0.6.9...v0.7.1) (2017-05-30)


### Features

* cli client配置，支持fis3的全局依赖安装。 ([0fac072](http://git.code.oa.com/feflow/feflow-cli/commits/0fac072))
* 使用cluster模块，多进程安装全局依赖。 ([86453ad](http://git.code.oa.com/feflow/feflow-cli/commits/86453ad))



<a name="0.6.9"></a>
## [0.6.9](http://git.code.oa.com/feflow/feflow-cli/compare/v0.6.8...v0.6.9) (2017-05-17)


### Bug Fixes

* 脚手架bug修复。 ([f4f618f](http://git.code.oa.com/feflow/feflow-cli/commits/f4f618f))



<a name="0.6.8"></a>
## [0.6.8](http://git.code.oa.com/feflow/feflow-cli/compare/v0.6.7...v0.6.8) (2017-05-17)


### Features

* plugin接入功能完善。 ([2cda4fc](http://git.code.oa.com/feflow/feflow-cli/commits/2cda4fc))



<a name="0.6.7"></a>
## [0.6.7](http://git.code.oa.com/feflow/feflow-cli/compare/v0.6.6...v0.6.7) (2017-05-10)


### Bug Fixes

* 修复OSX平台报错env: node\r: No such file or directory. ([8af1069](http://git.code.oa.com/feflow/feflow-cli/commits/8af1069))



<a name="0.6.6"></a>
## [0.6.6](http://git.code.oa.com/feflow/feflow-cli/compare/v0.6.5...v0.6.6) (2017-05-10)


### Features

* 使用figlet来打印banner信息。 ([0a0a7d8](http://git.code.oa.com/feflow/feflow-cli/commits/0a0a7d8))



<a name="0.6.5"></a>
## [0.6.5](http://git.code.oa.com/feflow/feflow-cli/compare/v0.6.4...v0.6.5) (2017-05-06)


### Bug Fixes

* 修复generator重新安装写入config.json重复的bug. ([40632af](http://git.code.oa.com/feflow/feflow-cli/commits/40632af))
* 修复issues4，未初始化时，会记住用户上一次输入的命令。 ([21ef25a](http://git.code.oa.com/feflow/feflow-cli/commits/21ef25a))


### Features

* 使用init命令前先判断用户本地是否有安装好的脚手架，否则提示安装。 ([c826079](http://git.code.oa.com/feflow/feflow-cli/commits/c826079))



<a name="0.6.4"></a>
## [0.6.4](http://git.code.oa.com/feflow/feflow-cli/compare/v0.6.3...v0.6.4) (2017-05-06)


### Features

* 扫描器支持组件使用排名榜单查询。 ([da05198](http://git.code.oa.com/feflow/feflow-cli/commits/da05198))



<a name="0.6.3"></a>
## [0.6.3](http://git.code.oa.com/feflow/feflow-cli/compare/v0.6.2...v0.6.3) (2017-05-03)


### Features

* 使用核心命令时都需要检测是否完成初始化操作。 ([8418159](http://git.code.oa.com/feflow/feflow-cli/commits/8418159))



<a name="0.6.2"></a>
## [0.6.2](http://git.code.oa.com/feflow/feflow-cli/compare/v0.6.1...v0.6.2) (2017-05-02)


### Bug Fixes

* 修复异常报错。 ([a1e0a3a](http://git.code.oa.com/feflow/feflow-cli/commits/a1e0a3a))



<a name="0.6.1"></a>
## [0.6.1](http://git.code.oa.com/feflow/feflow-cli/compare/v0.6.0...v0.6.1) (2017-05-02)


### Features

* 在help里面显示install命令相关提示。 ([0416d0a](http://git.code.oa.com/feflow/feflow-cli/commits/0416d0a))



<a name="0.6.0"></a>
# [0.6.0](http://git.code.oa.com/feflow/feflow-cli/compare/v0.5.4...v0.6.0) (2017-05-02)


### Features

* 插件安装命令 ([744e06a](http://git.code.oa.com/feflow/feflow-cli/commits/744e06a))
* 暴露install函数. ([1234283](http://git.code.oa.com/feflow/feflow-cli/commits/1234283))
* 注册与运行generator. ([8368302](http://git.code.oa.com/feflow/feflow-cli/commits/8368302))
* 集成插件安装命令。 ([72f6c06](http://git.code.oa.com/feflow/feflow-cli/commits/72f6c06))



<a name="0.5.4"></a>
## [0.5.4](http://git.code.oa.com/feflow/feflow-cli/compare/v0.5.3...v0.5.4) (2017-04-22)


### Features

* feflow的功能性命令增加版本自动检查功能。 ([fba072a](http://git.code.oa.com/feflow/feflow-cli/commits/fba072a))



<a name="0.5.3"></a>
## [0.5.3](http://git.code.oa.com/feflow/feflow-cli/compare/v0.5.2...v0.5.3) (2017-04-22)



<a name="0.5.2"></a>
## [0.5.2](http://git.code.oa.com/feflow/feflow-cli/compare/v0.5.1...v0.5.2) (2017-04-21)


### Features

* 扫描功能支持ivweb团队所有的仓库 ([1ee1fc1](http://git.code.oa.com/feflow/feflow-cli/commits/1ee1fc1))



<a name="0.5.1"></a>
## [0.5.1](http://git.code.oa.com/feflow/feflow-cli/compare/v0.5.0...v0.5.1) (2017-04-19)


### Bug Fixes

* 变量传递问题,receiver ([ee70542](http://git.code.oa.com/feflow/feflow-cli/commits/ee70542))



<a name="0.5.0"></a>
# [0.5.0](http://git.code.oa.com/feflow/feflow-cli/compare/v0.4.3...v0.5.0) (2017-04-19)


### Features

* 集成feflow-scanner代码规范扫描器 ([589d0e4](http://git.code.oa.com/feflow/feflow-cli/commits/589d0e4))



<a name="0.4.3"></a>
## [0.4.3](http://git.code.oa.com/feflow/feflow-cli/compare/v0.4.2...v0.4.3) (2017-04-19)


### Performance Improvements

* 用户使用体验优化 ([fc7ed50](http://git.code.oa.com/feflow/feflow-cli/commits/fc7ed50))



<a name="0.4.2"></a>
## [0.4.2](http://git.code.oa.com/feflow/feflow-cli/compare/v0.4.1...v0.4.2) (2017-04-19)


### Bug Fixes

* 修复windows的HOME环境变量可能没有找到的问题 ([a77749b](http://git.code.oa.com/feflow/feflow-cli/commits/a77749b)), closes [#issues3](http://git.code.oa.com/feflow/feflow-cli/issues/issues3)



<a name="0.4.1"></a>
## [0.4.1](http://git.code.oa.com/feflow/feflow-cli/compare/v0.4.0...v0.4.1) (2017-04-07)


### Bug Fixes

* generator-now-business中的vcmrc文件丢失问题修复 ([ae84648](http://git.code.oa.com/feflow/feflow-cli/commits/ae84648))



<a name="0.4.0"></a>
# [0.4.0](http://git.code.oa.com/feflow/feflow-cli/compare/v0.3.5...v0.4.0) (2017-04-07)


### Features

* 升级generator ([5c9023d](http://git.code.oa.com/feflow/feflow-cli/commits/5c9023d))



<a name="0.3.5"></a>
## [0.3.5](http://git.code.oa.com/feflow/feflow-cli/compare/v0.3.4...v0.3.5) (2017-04-07)


### Features

* 用户初始化 ([68f518d](http://git.code.oa.com/feflow/feflow-cli/commits/68f518d))



<a name="0.3.4"></a>
## [0.3.4](http://git.code.oa.com/feflow/feflow-cli/compare/v0.3.3...v0.3.4) (2017-04-05)


### Bug Fixes

* 模板文件vcmrc丢失问题修复 ([dddce99](http://git.code.oa.com/feflow/feflow-cli/commits/dddce99))



<a name="0.3.3"></a>
## [0.3.3](http://git.code.oa.com/feflow/feflow-cli/compare/v0.3.0...v0.3.3) (2017-04-04)


### Bug Fixes

* 升级generator-now-business，修复repo url错误bug。 ([b845631](http://git.code.oa.com/feflow/feflow-cli/commits/b845631))


### Features

* 升级generator-now-activity和generator-now-business，支持windows ([abf30a6](http://git.code.oa.com/feflow/feflow-cli/commits/abf30a6))



<a name="0.3.0"></a>
# [0.3.0](http://git.code.oa.com/feflow/feflow-cli/compare/v0.2.0...v0.3.0) (2017-04-01)


### Features

* 集成业务脚手架，支持业务的now-starkit ([02866da](http://git.code.oa.com/feflow/feflow-cli/commits/02866da))



<a name="0.2.0"></a>
# [0.2.0](http://git.code.oa.com/feflow/feflow-cli/compare/v0.1.2...v0.2.0) (2017-03-30)


### Features

* 打通Git仓库创建流程和克隆 ([2fc1458](http://git.code.oa.com/feflow/feflow-cli/commits/2fc1458))



<a name="0.1.2"></a>
## [0.1.2](http://git.code.oa.com/feflow/feflow-cli/compare/v0.1.1...v0.1.2) (2017-03-26)


### Bug Fixes

* 修复generator找不到的问题 ([970843b](http://git.code.oa.com/feflow/feflow-cli/commits/970843b))



<a name="0.1.1"></a>
## [0.1.1](http://git.code.oa.com/feflow/feflow-cli/compare/v0.1.0...v0.1.1) (2017-03-26)


### Bug Fixes

* 在package.json中添加bin ([ed9f4ae](http://git.code.oa.com/feflow/feflow-cli/commits/ed9f4ae))



<a name="0.1.0"></a>
# [0.1.0](http://git.code.oa.com/feflow/feflow-cli/compare/8378ce6...v0.1.0) (2017-03-25)


### Features

* **initial:** initial commit ([8378ce6](http://git.code.oa.com/feflow/feflow-cli/commits/8378ce6))
* 工程初始化命令集成 ([49adc22](http://git.code.oa.com/feflow/feflow-cli/commits/49adc22))



