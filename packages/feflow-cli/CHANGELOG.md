## [0.22.3](https://github.com/Tencent/feflow/compare/0.22.2...0.22.3) (2021-01-25)


### Bug Fixes

* package.json内容为空 ([77f803f](https://github.com/Tencent/feflow/commit/77f803f7efbf3a0a1aa75b32fb4f75dac97cbf8c))
* 上报信息添加 ([f79ac11](https://github.com/Tencent/feflow/commit/f79ac11079da986bd4c4ad8f7f050f33b446aa9c))
* 下载多语言插件异常捕获 ([fe87efd](https://github.com/Tencent/feflow/commit/fe87efd083bfbb98919a649a7ac7d5e097530475))
* 代码优化 ([5429698](https://github.com/Tencent/feflow/commit/54296986b70314c8a6cc548f1293ebda7e3f750f))
* 优化日志上报子进程创建 ([76bd892](https://github.com/Tencent/feflow/commit/76bd892cd57bf2913ccf1d3508fa82d0b2d0ecea))
* 修复 cli 自动更新失败的问题 ([20d0ec7](https://github.com/Tencent/feflow/commit/20d0ec703274f79a2c824523611f78f129af89cb))
* 修复package.json为空 ([a401f65](https://github.com/Tencent/feflow/commit/a401f65352352694a6e80721b09a917fc34a9116))
* 修复package.json为空场景 ([af17d57](https://github.com/Tencent/feflow/commit/af17d575ca6495fe9a998c0a21fa6c7ade88820c))
* 修复多语言插件更新失败的问题 ([9356640](https://github.com/Tencent/feflow/commit/93566406019e2cb6e1dc5de4b80032c8ae1fd770))
* 修复日志偶现打印失败 ([2f6b559](https://github.com/Tencent/feflow/commit/2f6b559a9551c6c2720b74c7745f1293f779c8aa))
* 修改信息提示登记 ([84410db](https://github.com/Tencent/feflow/commit/84410db5b0c25ac16f04906f114e37f6d1c83893))
* 修改各个组件logger使用 ([4c18733](https://github.com/Tencent/feflow/commit/4c187330010315db3d9212f99b6d8a5ef7c7a268))
* 修改套件logger使用 ([84dac33](https://github.com/Tencent/feflow/commit/84dac33bac2ac04459e56f8196459ed69d576b97))
* 修改测试用例 ([fe1aac8](https://github.com/Tencent/feflow/commit/fe1aac8175c1f37daf275f3ef4ff3da1f08b6238))
* 兜底package.json为空 ([f9e99ad](https://github.com/Tencent/feflow/commit/f9e99ad4118c72b6dd79346889afc91e37634aa7))
* 升级axios ([9375c01](https://github.com/Tencent/feflow/commit/9375c01e171ab10734669bf1d07e97a50ac97732))
* 多进程同时读写一个文件在高 node 版本容易报错  bad file descriptor,改为 nedb 来处理 ([7cc9617](https://github.com/Tencent/feflow/commit/7cc9617e05d1cfdc319bc0445f85cda778b2f7d6))
* 异步上报日志&已安装插件提示 ([b5cbfc7](https://github.com/Tencent/feflow/commit/b5cbfc711deb71ea09ed55919639dfdec4a13018))
* 异步上报日志优化 ([aebdc6e](https://github.com/Tencent/feflow/commit/aebdc6e81cbf5a848628ee51f10b4c6441a50f01))
* 添加更新子进程错误兼容检测和用户提示 ([60a1a4d](https://github.com/Tencent/feflow/commit/60a1a4def8541294abe1a119e30ed92f39c3a492))


### Features

* release 0.22.1 ([3037a23](https://github.com/Tencent/feflow/commit/3037a23ac7489015e142067164eeb3afc99e6126))
* 修改数据上报为子进程异步 ([1bf2993](https://github.com/Tencent/feflow/commit/1bf29930b8c69693fc03eb331d6f8e0030e3c5ea))
* 删除无用代码 ([8f5d4ff](https://github.com/Tencent/feflow/commit/8f5d4ff53b30473e6319a24d7b4720c5ab299dfd))
* 调整日志输出 ([0796524](https://github.com/Tencent/feflow/commit/07965241b432e8a1dd0be2c933830d0540db7eac))



## [0.22.2](https://github.com/Tencent/feflow/compare/0.21.1...0.22.2) (2020-12-17)


### Bug Fixes

* failed to check terminal when file does not exist ([e282816](https://github.com/Tencent/feflow/commit/e282816369fa13cf3dec09e9a68c4da6ed1d77e7))
* hang error when write log ([c9ae360](https://github.com/Tencent/feflow/commit/c9ae3600f44858773fe6134951a1927d51d8069e))
* log err when not found plugin && fix command when in windows ([#314](https://github.com/Tencent/feflow/issues/314)) ([5844c2d](https://github.com/Tencent/feflow/commit/5844c2da3c8b7541082f462588241d0848bcf3de))
* show err detail when in debug mode ([82423a7](https://github.com/Tencent/feflow/commit/82423a754bf2616f923d35ec8e8c162cb6bec9ac))
* 修复 windows 系统弹窗的问题 ([9c1beff](https://github.com/Tencent/feflow/commit/9c1beffaa6fb75b9c26c813a370800c683359ed9))
* 修复unix-like的系统下,部分参数会被shell解释的问题 ([4c7fe08](https://github.com/Tencent/feflow/commit/4c7fe089bf4bfc1af94312344516ee49956347e3))
* 替换 cli-markdown 为 cli-md ([843570e](https://github.com/Tencent/feflow/commit/843570ec1215b2ea7b4494646a9e8dc4e4b86a0e))
* 替换 markdown 回好看的样式 ([6cc3c23](https://github.com/Tencent/feflow/commit/6cc3c23d8bee1cbdd3ae01a7fb806f2d13e952dc))
* 替换cli-markdown ([#312](https://github.com/Tencent/feflow/issues/312)) ([d1c5f30](https://github.com/Tencent/feflow/commit/d1c5f30f98a4c48ddbba94fe8255fe46e1c22a40))
* 隐藏windows子进程弹框 ([c99c098](https://github.com/Tencent/feflow/commit/c99c0984a36e9e45b2612d6deb8b42351abb2f3a))
* 隐藏日志上报能力 ([8751e72](https://github.com/Tencent/feflow/commit/8751e728c5128bf28edce7623c1e5887c7fa2857))


### Features

* release 0.21.2 ([323ad4f](https://github.com/Tencent/feflow/commit/323ad4fef4c6cb72b2bdb75f001aa1658ad99e91))
* release 0.21.3 ([792c300](https://github.com/Tencent/feflow/commit/792c3000ae7a105a88d63486dcfc48a4ca144c7a))
* release 0.21.4 ([9fae523](https://github.com/Tencent/feflow/commit/9fae523f66a3ccdd26633ecc2b8ea6c5c646b58e))
* release 0.22.0 ([0c694f9](https://github.com/Tencent/feflow/commit/0c694f98a39685c0bf8c084e28cd62bbecee4677))
* set lerna config ([8ee45bc](https://github.com/Tencent/feflow/commit/8ee45bcdbe272724c098d0561067f4cd64b5af5a))
* set lerna config ([4b2c4f1](https://github.com/Tencent/feflow/commit/4b2c4f1b6e91974053e66c1291fb21478368f287))
* set lerna config ([5447472](https://github.com/Tencent/feflow/commit/54474727ff49c2a59ba715562419409fb8fe14cd))
* set lerna config ([2acf57b](https://github.com/Tencent/feflow/commit/2acf57be7fbf3a253d9787f43814da5c48947001))
* set lerna config ([795a142](https://github.com/Tencent/feflow/commit/795a142b31bce958a993a69e681ef18142d54ac4))
* set lerna config ([8fc5625](https://github.com/Tencent/feflow/commit/8fc5625ebb79e063257be59e231c47bd5d997620))
* set lerna config ([9d9550a](https://github.com/Tencent/feflow/commit/9d9550a77034e079ff12f30cb2c009239bccc944))
* set lerna config ([f5ebef6](https://github.com/Tencent/feflow/commit/f5ebef6781c3eefd62d7fe39838dc936219aafc0))
* set lerna config ([44d9b5f](https://github.com/Tencent/feflow/commit/44d9b5fb5c7f40691daba8c3239a2e78da1fb559))
* set lerna config ([3555920](https://github.com/Tencent/feflow/commit/3555920102dd98352b58f63638c9b3b5f66f4967))
* set lerna config ([0fa95f2](https://github.com/Tencent/feflow/commit/0fa95f2676f1762cd0470dfd939da382aac26731))
* set prepublish for feflow/report ([db58fba](https://github.com/Tencent/feflow/commit/db58fbaae2c5d69cc30132d582d929c74e420ba0))
* set prepublish for feflow/report ([834a44f](https://github.com/Tencent/feflow/commit/834a44fcd9e9168483282d73d955c089dedcec5b))
* set prepublish for feflow/report ([19dde5c](https://github.com/Tencent/feflow/commit/19dde5c64bd991be0648ca27e80f283bc45ba0a9))
* set prepublish for feflow/report ([acfcfac](https://github.com/Tencent/feflow/commit/acfcfac9963fbdd24319305f5f033d694c7ebdad))
* update report version ([1482348](https://github.com/Tencent/feflow/commit/1482348e05104dadbe2d291824b38ae3f16af6f0))
* **report:** 修复which在win上的问题 ([e457a98](https://github.com/Tencent/feflow/commit/e457a98098b949a0fca6be10417b8db115f68d85))
* 修复多次下载多语言插件的问题 ([59158e6](https://github.com/Tencent/feflow/commit/59158e6c0367e7a2cd26273d5a63424470eba2a7))
* 引入 cli-markdown 来支持 terminal 中 markdown 语法 ([8d2d42d](https://github.com/Tencent/feflow/commit/8d2d42dc96f18af8faa864405991650701e77057))
* 添加静默进程检测更新,减少用户等待 ([952cbff](https://github.com/Tencent/feflow/commit/952cbff8162f7d1a50f33f664dc17b1daa2ed423))



## [0.21.1](https://github.com/Tencent/feflow/compare/0.21.0...0.21.1) (2020-10-15)


### Bug Fixes

* add promiseRejection catch ([256e81d](https://github.com/Tencent/feflow/commit/256e81dcf600397cd217a91c77e7d1b4e6de7cc1))


### Features

* release 0.21.1 ([995ddbf](https://github.com/Tencent/feflow/commit/995ddbf3712be85b9ec587cb31b1e85da5c6515b))



# [0.21.0](https://github.com/Tencent/feflow/compare/v0.20.9...0.21.0) (2020-10-14)


### Bug Fixes

* change cgi ([d4dee6d](https://github.com/Tencent/feflow/commit/d4dee6df9af11e7cf496ae6a03d46e38ce2f02e1))
* check config before update ([28dceab](https://github.com/Tencent/feflow/commit/28dceab57461470d324d1f3fb88e3437206e4f48))
* install npm package ([d5d71d5](https://github.com/Tencent/feflow/commit/d5d71d54d6d3d4288b928014f34c641ab365d602))
* maker sure logger.log exists ([3ac2d1e](https://github.com/Tencent/feflow/commit/3ac2d1e6330191944be33243da81201d67e9b432))
* pick value from cmd instead of commander.store ([5d35548](https://github.com/Tencent/feflow/commit/5d35548e37c4261886065631eb916688bd4b6848))
* support picker with muti command in one plugin ([5b0fc86](https://github.com/Tencent/feflow/commit/5b0fc867e7c3e1366151070198789ae8b57be1dd))
* 上报校验 ([5b60a28](https://github.com/Tencent/feflow/commit/5b60a28cec15191c995d36c37f0e5bd71f9341c7))
* 修改错别字 ([5c316fb](https://github.com/Tencent/feflow/commit/5c316fb73651cd35422a097ba791ec9186496a13))
* 获取插件名称 ([7135db6](https://github.com/Tencent/feflow/commit/7135db64a2d89406e16f681747709444d48646e6))


### Features

* auto set package manager when first use ([0c23193](https://github.com/Tencent/feflow/commit/0c2319370d4c492b7ef4ea83d52f04c8abde094c))
* catch parse cache file ([c0d3acb](https://github.com/Tencent/feflow/commit/c0d3acb969a000a2419c6b910fd2dcc1c450a347))
* command picker with source ([29bbe4c](https://github.com/Tencent/feflow/commit/29bbe4c55933492af1ac9d89ac2f993e9dc08088))
* release 0.21 ([7156298](https://github.com/Tencent/feflow/commit/7156298d07ed2dec9e595f0a45f3e029446b4b5a))
* remove -h(--help) for subcmd ([b97b521](https://github.com/Tencent/feflow/commit/b97b521bb8aa69f36a26625f5d8d6dee3d4c7bbb))
* report cli err ([f6ced7e](https://github.com/Tencent/feflow/commit/f6ced7eceacb4ac978587019bedc953df3261af0))
* suppoort pick the same command from diffrence plugin ([fdfc6ee](https://github.com/Tencent/feflow/commit/fdfc6ee28712174cf68bf2aa2e54af79a6022baa))
* update version ([23d3377](https://github.com/Tencent/feflow/commit/23d33771d5ba9fe86caba9a6614333230f47694e))
* **report:** add example ([67397a6](https://github.com/Tencent/feflow/commit/67397a6a37c36af66ce172a67a202aa5b3a4e35d))
* **report:** pkg types ([8767c98](https://github.com/Tencent/feflow/commit/8767c9819a2b4974fa357494bc3d36dd6539aa83))
* **report:** report command error ([5bdd2d6](https://github.com/Tencent/feflow/commit/5bdd2d6e6bba4709543a1e908ddbe86134b46f53))
* **report:** set command source ([1af7b4d](https://github.com/Tencent/feflow/commit/1af7b4dd89ba597af1e53387cf59ab4952e573ba))
* **report:** support command with version ([9b9ea99](https://github.com/Tencent/feflow/commit/9b9ea99317f089a1aeafb7b1ff29a9e10977ff16))
* **report:** update version ([58a962f](https://github.com/Tencent/feflow/commit/58a962feca8924e28debc0b022b22e281b6ca4d9))
* update @feflow/report version ([35432c4](https://github.com/Tencent/feflow/commit/35432c4a198717dd2a4911e303104824b32e651d))


### Performance Improvements

* command picker ([33419e2](https://github.com/Tencent/feflow/commit/33419e2d4858bf05ef9e538f3bce94d490eceb2f))



## [0.20.9](https://github.com/Tencent/feflow/compare/v0.20.8...v0.20.9) (2020-07-14)


### Bug Fixes

* fix hook emit with arguments ([c659792](https://github.com/Tencent/feflow/commit/c659792edb752355d2bba3ead27b37357f558251))
* get username in linux ([#277](https://github.com/Tencent/feflow/issues/277)) ([3476aff](https://github.com/Tencent/feflow/commit/3476aff28f160eead46a7dd9c487ea5a70258657))
* install npm package ([7fc370f](https://github.com/Tencent/feflow/commit/7fc370f4636b5f99a8b9785b594df037cb0bbd20))
* 去掉冗余依赖 execa;修改 this.reporter.init 不存在的报错;去掉没有使用的变量 ([ec4c9a2](https://github.com/Tencent/feflow/commit/ec4c9a2a3432cee856edd1eccc82a4616660e070))
* **report:** fix git command ([803cde4](https://github.com/Tencent/feflow/commit/803cde4202ce1a96fd640abe6409a9066ee1a340))


### Features

* update report version ([1eca90c](https://github.com/Tencent/feflow/commit/1eca90cbe8e85c7a2a1b9c2543ee645fea14e580))
* **report:** plugin name from options ([4d81c4a](https://github.com/Tencent/feflow/commit/4d81c4a9c30f597577dafaf26c0b20ceda7ea73f))
*  remove plugin cmd link when uninstall plugin ([604b959](https://github.com/Tencent/feflow/commit/604b959f7d421f9ef5ae25e9230d060212701298))
* add register event to Commander, and allow link npm plugin to global with install option -g ([2221b2a](https://github.com/Tencent/feflow/commit/2221b2a85f6d904908d4c0de951707311a34650d))
* add upgrade command ([#279](https://github.com/Tencent/feflow/issues/279)) ([409b079](https://github.com/Tencent/feflow/commit/409b079b6f13d0735b39dea04e4bf2366c6ee4cc))
* command source ([d801a4f](https://github.com/Tencent/feflow/commit/d801a4f33d50d77802751403d8602fa8d91525c5))
* only updated once an hour later ([5dbb8f3](https://github.com/Tencent/feflow/commit/5dbb8f3017443e7ca5cd08c24e779beb4dcdb2a4))
* optimize performance and fix bugso ([936185c](https://github.com/Tencent/feflow/commit/936185c1161590afa5de58bc086cff2ff26d8098))
* report url ([e6ec008](https://github.com/Tencent/feflow/commit/e6ec0087b03decc95df6815c8f64f4e6b04e9d06))
* support report init result ([6d43033](https://github.com/Tencent/feflow/commit/6d43033163353d4b39aae55f989daab0c133cf49))
* support report init result ([29fea39](https://github.com/Tencent/feflow/commit/29fea393355078f65b9f147b32b040f376ac7c15))
* support report init result ([#288](https://github.com/Tencent/feflow/issues/288)) ([05a0ea2](https://github.com/Tencent/feflow/commit/05a0ea22c6990d4b586390340b1397f6c3feab43))
* support the uninstall hook, update after run ([d0d1f5b](https://github.com/Tencent/feflow/commit/d0d1f5bf430d7ca414799dc4f42b662ccce0e0ed))
* 提供官方命令 doctor 展示用户环境信息 ([beb7663](https://github.com/Tencent/feflow/commit/beb7663f98a514148da0561e84f4d24a8c4879e2))
* 支持 fef help xxx 展示插件对应的 usage 信息 ([17a99e6](https://github.com/Tencent/feflow/commit/17a99e6c9b000b6fbf74913fc2f7fd0ecb079f84))
* **examples:** add generators for feflow-generaotr-* & feflow-devkit-* ([#282](https://github.com/Tencent/feflow/issues/282)) ([0491954](https://github.com/Tencent/feflow/commit/04919543ed079cbe8b2479139430046057b039c5))
* **report:** format usrname string ([802fec0](https://github.com/Tencent/feflow/commit/802fec06b1ddabf6c9f8565d81c198529f160cd1))
* **report:** get project from git ([692f9e8](https://github.com/Tencent/feflow/commit/692f9e85b6a3b1b898a2de760397e0b237e83812))
* **report:** get username from linux ([dd5f4f8](https://github.com/Tencent/feflow/commit/dd5f4f8860da014bbbd48c64b613f6606215f7b1))
* **report:** mount report on ctx ([93fb8c0](https://github.com/Tencent/feflow/commit/93fb8c0324ca47742fcf41fafb09c323642d73d1))
* **report:** point log ([12486c5](https://github.com/Tencent/feflow/commit/12486c53e776513d4684e44f78111c933c3ca4ab))
* **report:** report feflow version ([c213fd9](https://github.com/Tencent/feflow/commit/c213fd9214caf63d3576c3eda44e1704b3c112cc))
* **report:** report generator and devkit ([86ca850](https://github.com/Tencent/feflow/commit/86ca8500a8119636396a7d9b097b7c473e715636))
* **report:** reset timeout ([9f5be87](https://github.com/Tencent/feflow/commit/9f5be87b90ae0c623daef77b16fe8c0b27fdda14))
* **report:** sniff user network and save ([9e1a7d1](https://github.com/Tencent/feflow/commit/9e1a7d15037ea4e7129d79d2850be51238a8827d))
* **report:** update ([c0220eb](https://github.com/Tencent/feflow/commit/c0220eb35667ca0d0ecc9d77fbc801f1c7bef140))
* **report:** update report version ([dbb351c](https://github.com/Tencent/feflow/commit/dbb351c99de2025779078a2c3c581fb72974e051))



## [0.20.8](https://github.com/Tencent/feflow/compare/v0.20.7...v0.20.8) (2020-06-17)


### Bug Fixes

* use -f when fetch tags and check tag ([ce014ee](https://github.com/Tencent/feflow/commit/ce014eea6808d2f93f1dbcbb7ed691a9b81f92fa))


### Features

* report version usage ([bc2c0d6](https://github.com/Tencent/feflow/commit/bc2c0d6092b23213ac05bb76c7d3ae05e05e5a08))



## [0.20.7](https://github.com/Tencent/feflow/compare/v0.20.5...v0.20.7) (2020-06-15)


### Bug Fixes

* fetch tags fail ([c44b20f](https://github.com/Tencent/feflow/commit/c44b20fb557ebdb447ccebcd2f442e01facd7272))
* unknown terminal prompts ([#274](https://github.com/Tencent/feflow/issues/274)) ([f1f5349](https://github.com/Tencent/feflow/commit/f1f5349aca1d92c2697e015372c9e874c14072bd))


### Features

* report invisible ([#272](https://github.com/Tencent/feflow/issues/272)) ([d5f2cfb](https://github.com/Tencent/feflow/commit/d5f2cfb28505651e4354a5bfd11563c4610c5d74))
* update changelog ([15a0c24](https://github.com/Tencent/feflow/commit/15a0c2473e3575679f148ae43e3360ea5eb107ae))
* **install:** use public account when git http ([532dc92](https://github.com/Tencent/feflow/commit/532dc9239dbda51914adf4c22c01d29ab9ffd56b))



## [0.20.5](https://github.com/Tencent/feflow/compare/v0.20.3...v0.20.5) (2020-06-09)


### Features

* add git ssh check timeout ([ed5d176](https://github.com/Tencent/feflow/commit/ed5d17669ffab3b39382268c3f10efcfb9ff31bc))
* add postinstall script to initialize bin path ([4993355](https://github.com/Tencent/feflow/commit/499335552364a4b88a8a35c67b54e892e256c094))



## [0.20.3](https://github.com/Tencent/feflow/compare/v0.20.2...v0.20.3) (2020-06-05)


### Bug Fixes

* exit when error ([1b75ccf](https://github.com/Tencent/feflow/commit/1b75ccf150411de23e9652acc5acdb0c14e489d0))


### Features

* register bin path to all terminal ([bef62e3](https://github.com/Tencent/feflow/commit/bef62e387192bfc9e0ff826310a22913cd5249ed))



## [0.20.2](https://github.com/Tencent/feflow/compare/v0.20.1...v0.20.2) (2020-06-04)


### Bug Fixes

* **universal-plugin:** fix circual dependencies ([4c3938f](https://github.com/Tencent/feflow/commit/4c3938f09e495eb0813d0892f5c6c40a6bbae66e))
* checkout tag fail ([450725e](https://github.com/Tencent/feflow/commit/450725e93cc53d97c10117c80128290437d09f8a))
* exception could not be caught ([662b565](https://github.com/Tencent/feflow/commit/662b565d1caf035ef2efcb3c05bbc9a0f3f8d4c5))
* fix feflow warn color too light in item2 light mode issue[#263](https://github.com/Tencent/feflow/issues/263) ([c620571](https://github.com/Tencent/feflow/commit/c6205717c992f9ed33836d55c8ed8459c626a84b))
* upgrade circularly ([ba80367](https://github.com/Tencent/feflow/commit/ba80367ef5641b32476d506dd2661bbdeebc737b))
* upgrade circularly ([#266](https://github.com/Tencent/feflow/issues/266)) ([8acea94](https://github.com/Tencent/feflow/commit/8acea94d307060624ddb117d154b2a74b408d2c2))


### Features

* fef list will show pkg name and version ([#265](https://github.com/Tencent/feflow/issues/265)) ([00b936c](https://github.com/Tencent/feflow/commit/00b936cc33cffe7d37d2d6a1454baf4abbc94718))
* show universion plugin version on fef list command ([2e74beb](https://github.com/Tencent/feflow/commit/2e74beb4ecb43b83c51b97e959e1333e87b261b4))



## [0.20.1](https://github.com/Tencent/feflow/compare/v0.20.0...v0.20.1) (2020-05-29)


### Features

* add cmd command to feflow context ([a7ddf59](https://github.com/Tencent/feflow/commit/a7ddf597dcc79331c673b4c68c802832a52d3273))



# [0.20.0](https://github.com/Tencent/feflow/compare/v0.20.0-alpha.5...v0.20.0) (2020-05-28)


### Bug Fixes

* HOOK_TYPE_AFTER will never called ([37bdd78](https://github.com/Tencent/feflow/commit/37bdd789b50bad6012033363a45421eb7d5a7e83))
* HOOK_TYPE_BEFORE ([d66140a](https://github.com/Tencent/feflow/commit/d66140a905931b42f7919b6237f245149127c570))
* invalid command ([5ebd329](https://github.com/Tencent/feflow/commit/5ebd329bbf078ca9035b3458a13f04ba88166d02))
* log ([4357600](https://github.com/Tencent/feflow/commit/4357600397a6bb8a3e1c654fe2e7aca94ceb0586))
* reload the configuration after the update ([34f1856](https://github.com/Tencent/feflow/commit/34f1856e69e75bcdc216a99a0569a6027c0e519d))
* **report:** plugin name ([03a9d09](https://github.com/Tencent/feflow/commit/03a9d094e1056e7b1a155ef8fffb545bc9cc74bb))


### Features

*  feflow对象增加参数cmd，值为当前执行的feflow命令 ([8191364](https://github.com/Tencent/feflow/commit/8191364ac579f0410c0c71dbc027ca255b90dc00))
* register with pkg ([824dd4c](https://github.com/Tencent/feflow/commit/824dd4cdc140d66f70f7e62696544c5f0d33d47b))
* the child plugin will trigger the automatic update capability of the parent plugin ([d1b978c](https://github.com/Tencent/feflow/commit/d1b978c4c070f1b599089a68327ab0fb58f2ad74))
* **report:** double report ([cd69d72](https://github.com/Tencent/feflow/commit/cd69d721266df6bab18d212fad448932f9c7eca3))
* **report:** got plugin name from commander ([8bd57b8](https://github.com/Tencent/feflow/commit/8bd57b80871eeb8f7c32efb8dd1a394a6c0a01b0))
* **report:** update cli report ([2529397](https://github.com/Tencent/feflow/commit/2529397d603d1c77325ee314d8d63a4fd9c7092c))
* report hook ([5a7d77c](https://github.com/Tencent/feflow/commit/5a7d77c173b46b25288a330ae9e84a782de426fd))
* update version ([12c79c9](https://github.com/Tencent/feflow/commit/12c79c9e129b0562d3be663bc196b226d41d6e47))



# [0.20.0-alpha.5](https://github.com/Tencent/feflow/compare/v0.20.0-alpha.4...v0.20.0-alpha.5) (2020-05-27)


### Bug Fixes

* command run error ([9617c5d](https://github.com/Tencent/feflow/commit/9617c5ddc5590d7bcfdf8fc0e8eb68f4eed098b1))
* when there are no dependent plugins, no dependencies can be established ([a971a42](https://github.com/Tencent/feflow/commit/a971a42df3757c1ce3210c247d8fab66c7ac40e5))


### Features

* optimize the logger ([b988ad2](https://github.com/Tencent/feflow/commit/b988ad2af7ded2f84aa331816baa45749f0b1204))
* support ssh check before clone repo ([8f97fa8](https://github.com/Tencent/feflow/commit/8f97fa87e035391ba505f17b67abf956b746f90d))



# [0.20.0-alpha.4](https://github.com/Tencent/feflow/compare/v0.20.0-alpha.1...v0.20.0-alpha.4) (2020-05-27)


### Bug Fixes

* dep install ([8d818bb](https://github.com/Tencent/feflow/commit/8d818bb74a9d4b9b1e24cba8e06e8703a34abbc4))
* get tag miss ([c0a8eb2](https://github.com/Tencent/feflow/commit/c0a8eb29a569c3f50de3bc616830ad700a25a86c))


### Features

* dep install/uninstall/list ([6201b88](https://github.com/Tencent/feflow/commit/6201b88965defbe9d9288ecfb166ca38dcbce699))
* dep run ([bd00334](https://github.com/Tencent/feflow/commit/bd00334a488aa5537cdb1754fa073d24b5102fb9))
* dep run ([7262d79](https://github.com/Tencent/feflow/commit/7262d7916a34f499aec7c05474744a5318abaa5b))
* dep version ([a7d7cb5](https://github.com/Tencent/feflow/commit/a7d7cb534756ed2e919ba2093ecea434a1a13bab))
* move universal plugin into plugin type ([7e26964](https://github.com/Tencent/feflow/commit/7e26964479f7a330c7a813de02b228927b534549))
* run commands inherit stdio ([eb7caee](https://github.com/Tencent/feflow/commit/eb7caee77987eb4f96e09286e5d549c20f4407f9))
* stash dep ([4deecc2](https://github.com/Tencent/feflow/commit/4deecc2b1ae28b3ff3e81406b0a4cc40e8bfb9bb))
* uninstall package ([40bf2dc](https://github.com/Tencent/feflow/commit/40bf2dc5ab23e471cac2dfc0b9826af4918922d7))
* upgrade hook ([987d4d7](https://github.com/Tencent/feflow/commit/987d4d7adde3da5f0b7431a40447ac71aef4d8e7))
* **list:** list universal plugin ([ce2f681](https://github.com/Tencent/feflow/commit/ce2f6818decb70c44d1106b9a181dbff0833e72e))
* **plugin:** check universal plugin version and update ([04f4486](https://github.com/Tencent/feflow/commit/04f4486f9683e49ad27997cd4624ef7bb79d0a4b))



# [0.20.0-alpha.1](https://github.com/Tencent/feflow/compare/v0.20.0-alpha.0...v0.20.0-alpha.1) (2020-05-19)



# [0.20.0-alpha.0](https://github.com/Tencent/feflow/compare/v0.19.2...v0.20.0-alpha.0) (2020-05-19)


### Bug Fixes

* error taking hook parameter ([634ab47](https://github.com/Tencent/feflow/commit/634ab4777a820f451936bd9c59ace4a2099db3ef))
* repo dosen't has tag version case ([7503f7e](https://github.com/Tencent/feflow/commit/7503f7ebc7a57b3b823f14e2ee90df12f2336754))
* **universal_plugin:** change universal plugin config path ([f76b73b](https://github.com/Tencent/feflow/commit/f76b73b63940d8d9f460f984804e1c47a366f76a))
* **universal_plugin:** check plugin config path ([8f71a08](https://github.com/Tencent/feflow/commit/8f71a082a9bb3557fd27c793d060c5388206d903))
* compile fail ([d04eb91](https://github.com/Tencent/feflow/commit/d04eb913968cb7265563b660b43c568824f6a4ac))
* link select ([f24792d](https://github.com/Tencent/feflow/commit/f24792dcc105db64505f3a9a7b07c5018f6a3e4b))
* register as a system command with the specified name ([a8bb7a2](https://github.com/Tencent/feflow/commit/a8bb7a276506df71f3683fd6ddda08b38805e08d))


### Features

* support install using package name ([638e3c7](https://github.com/Tencent/feflow/commit/638e3c786f59713f1acd26582c43b3dd5476fc21))
* **universal-package:** support download latest version ([c70dd66](https://github.com/Tencent/feflow/commit/c70dd66eb7c7b9b96a336551c39b7ad4070c917a))
* installed as the system command and supports hooks ([f0970b2](https://github.com/Tencent/feflow/commit/f0970b23b878d2e30be9f6d17ec4fbe65b3417f4))
* **plugin:** add plugin install success tip ([bf3a34a](https://github.com/Tencent/feflow/commit/bf3a34ad88cccd6138e94c0ec1d5aaf83a57cc83))
* **universal_plugin:** change plugin name regex ([8384b58](https://github.com/Tencent/feflow/commit/8384b5871204a7e90780fa0fab712504c11b0b94))
* add feflow-plugin prefix when from git ([a0c3066](https://github.com/Tencent/feflow/commit/a0c3066583d69baa5e1b5680781d9f7a8d20438d))
* **universal_plugin:** replace execa to cross-spawn ([9da8153](https://github.com/Tencent/feflow/commit/9da8153ba8f06497633b49a123bf189790dee7c7))
* add system command registry ([4eb3e5a](https://github.com/Tencent/feflow/commit/4eb3e5a017c8be63fb79af58441352c47d5e24fc))
* **install:** support install repo from git ([80960cd](https://github.com/Tencent/feflow/commit/80960cd468c55004056b6599c9b8a9bf2d7085a0))
* **universal_plugin:** replace shelljs to execa ([d7223ac](https://github.com/Tencent/feflow/commit/d7223acef619123d0542f7825369d9b89add2e8d))
* define universal folder and file name ([bc80050](https://github.com/Tencent/feflow/commit/bc80050f81f6aaab1f7ceccd0c9df10a7c2bbcd7))
* run universal plugin ([46be839](https://github.com/Tencent/feflow/commit/46be8394b3e432a4732cffe682d9bc7997396b6c))



## [0.19.2](https://github.com/Tencent/feflow/compare/v0.19.0...v0.19.2) (2020-05-15)


### Bug Fixes

* fix message ([24d07e4](https://github.com/Tencent/feflow/commit/24d07e4d21939ea13fcbb503cebf7ca81035f8d6))
* while load devkits,check the directoryPath first; make error specific ([9cbc591](https://github.com/Tencent/feflow/commit/9cbc591bdc98bfa198123674fc7898bb35ae6de7))


### Features

* **install:** add install error log info ([49ec214](https://github.com/Tencent/feflow/commit/49ec2149b78b08cfdd97d7125bccb165688abbb7))



# [0.19.0](https://github.com/Tencent/feflow/compare/v0.19.0-alpha.5...v0.19.0) (2020-05-14)


### Bug Fixes

* **install:** cli and plugins update when use yarn as package manager ([f450bc2](https://github.com/Tencent/feflow/commit/f450bc2e36ae69f205c8de15d8840632b8837df1))


### Features

* pack to tarball ([9c12c3f](https://github.com/Tencent/feflow/commit/9c12c3f7a30a4466756aafaf976765c41d67f99b))
* **pack:** cli parse args ([521383b](https://github.com/Tencent/feflow/commit/521383b14da06fdf2cbd7ae3e0adb7120689e721))



# [0.19.0-alpha.5](https://github.com/Tencent/feflow/compare/v0.19.0-alpha.4...v0.19.0-alpha.5) (2020-04-27)


### Bug Fixes

* **install:** use add/remove when select yarn as package manager ([ab5a06b](https://github.com/Tencent/feflow/commit/ab5a06bc667816b5be7111c6ce2a0d1a214048b1)), closes [#221](https://github.com/Tencent/feflow/issues/221)


### Features

* **example:** JSON Schema ([#218](https://github.com/Tencent/feflow/issues/218)) ([17c0f9c](https://github.com/Tencent/feflow/commit/17c0f9c6be25c0d25d145cb149b07eae53292e5f))



# [0.19.0-alpha.4](https://github.com/Tencent/feflow/compare/v0.19.0-alpha.3...v0.19.0-alpha.4) (2020-04-14)


### Bug Fixes

* auto update ([33f9b94](https://github.com/Tencent/feflow/commit/33f9b94261e6c382e38a638c0f9fcf2e6cfff247))



# [0.19.0-alpha.3](https://github.com/Tencent/feflow/compare/v0.19.0-alpha.0...v0.19.0-alpha.3) (2020-04-10)


### Bug Fixes

* **core:** allow-root when update cli ([2d764dd](https://github.com/Tencent/feflow/commit/2d764dd16b2453958fbea058a887dded905fc4c6))
* **help:** parameter format ([#212](https://github.com/Tencent/feflow/issues/212)) ([b3bb4a4](https://github.com/Tencent/feflow/commit/b3bb4a4ba2a668839bfe97cc5ff46d5817dc3ed8))


### Features

* **help:** add config help info ([b437682](https://github.com/Tencent/feflow/commit/b4376829467c05e2b3518b14769f31ccdf9cc9bf))
* **help:** support array command description ([#214](https://github.com/Tencent/feflow/issues/214)) ([b7549da](https://github.com/Tencent/feflow/commit/b7549da89317638f2974d7168ade1423ef2c8b3a))



# [0.19.0-alpha.0](https://github.com/Tencent/feflow/compare/v0.18.4...v0.19.0-alpha.0) (2020-04-09)


### Bug Fixes

* fix help command without option ([#211](https://github.com/Tencent/feflow/issues/211)) ([754348f](https://github.com/Tencent/feflow/commit/754348fdb23c52c43f2745ae68965bf3c8512998))
* **devkit:** spelling error ([c059638](https://github.com/Tencent/feflow/commit/c0596382fd3dc0e8c95fad6dbaac0cb4df7ddbb9))


### Features

* **cli:** support auto-update params ([115e742](https://github.com/Tencent/feflow/commit/115e74279c339e16f1d2815e5daf99d252ba12a2))
* **devkit:** support plugin/devkit sub command help ([#207](https://github.com/Tencent/feflow/issues/207)) ([17be24d](https://github.com/Tencent/feflow/commit/17be24d8c5bbb2eb3c3faedc1f441e219997210a))
* support devkit.js/devkit.yaml/devkit.yml/devkitrc/package.json format ([2ddeccb](https://github.com/Tencent/feflow/commit/2ddeccb1e50983f378c51c493016a7f5ce949010))



## [0.18.4](https://github.com/Tencent/feflow/compare/v0.18.3...v0.18.4) (2020-04-09)


### Features

* disable check ([f8ff642](https://github.com/Tencent/feflow/commit/f8ff642b5e75896938d042bc6c643453d2efedbd))



## [0.18.3](https://github.com/Tencent/feflow/compare/v0.18.2...v0.18.3) (2020-03-25)


### Bug Fixes

* **command:** do not display version info when has a command ([063549b](https://github.com/Tencent/feflow/commit/063549bac8405f7c96b67f12b3bd36efc8c4a3d0))



## [0.18.2](https://github.com/Tencent/feflow/compare/v0.18.1...v0.18.2) (2020-03-22)


### Bug Fixes

* **core:** plugin version check ([d7d0f2f](https://github.com/Tencent/feflow/commit/d7d0f2f221365a2a33e27d29e87746709fb81984))


### Features

* **devkit:** support projectPath for devkit ([9505e04](https://github.com/Tencent/feflow/commit/9505e04ceea326495138982f0e2cba8b8cf20c2d))
* add generator.json to npm file ([cf3b21a](https://github.com/Tencent/feflow/commit/cf3b21aaf7875dfae2a74f5e8131287fa9a35435))



# [0.18.0](https://github.com/Tencent/feflow/compare/v0.18.0-alpha.2...v0.18.0) (2020-03-04)


### Features

* config params ([f5fcf5c](https://github.com/Tencent/feflow/commit/f5fcf5c8720f6df21930f0817922e12ee2fab39c))
* **generator-example:** generator json schema ([e411acd](https://github.com/Tencent/feflow/commit/e411acd83b73b8dd3eaef0be451f1de8ec27ad6e))
* **generator-example:** support initialize project with params ([187119c](https://github.com/Tencent/feflow/commit/187119c87834078392eac77e073602c4211fa54e))



# [0.18.0-alpha.2](https://github.com/Tencent/feflow/compare/v0.18.0-alpha.1...v0.18.0-alpha.2) (2020-03-02)


### Features

* **hook:** add feflow hooks ([a8076ec](https://github.com/Tencent/feflow/commit/a8076ece163013892ad9a6762f81e046275a2196))



# [0.18.0-alpha.1](https://github.com/Tencent/feflow/compare/v0.17.1...v0.18.0-alpha.1) (2020-02-29)


### Bug Fixes

* **package-manager:** npm and yarn source ([3384f8f](https://github.com/Tencent/feflow/commit/3384f8f04c057cb37666b673521516b943160562))


### Features

* **devtool:** add devtool internal plugin ([4c98456](https://github.com/Tencent/feflow/commit/4c98456782a23af0c0900368c0696ee5160544ae))
* **init:** remove -g param ([1d91a32](https://github.com/Tencent/feflow/commit/1d91a3201949f660f22d34810a6f6e0d11335c74))
* **init:** support initialize project with selected generator ([fff9b24](https://github.com/Tencent/feflow/commit/fff9b244c8b3e44c6d659d1558551465d996aeb6))
* support cnpm when initialize ([6095912](https://github.com/Tencent/feflow/commit/6095912ff00140d2b29839bd478f8e1ca970d893))
* **devtool:** add internal devtool plugin ([ef053c5](https://github.com/Tencent/feflow/commit/ef053c544964c63be206004f0ae4c10dca8fd0ee))
* **devtool:** copy templates according to user input ([7557299](https://github.com/Tencent/feflow/commit/75572990fc7697f7693c40e71a60a615e43af7ea))
* **devtool:** create template logic ([41afeeb](https://github.com/Tencent/feflow/commit/41afeeb578d0e07d101137356d175e11b7a3fd1b))
* **devtool:** support feflow-plugin dev ([2f2323e](https://github.com/Tencent/feflow/commit/2f2323e7900bb6debc0245a110aba1391bf701ac))


### Performance Improvements

* **core:** network error check. ([9565309](https://github.com/Tencent/feflow/commit/9565309da4439d73924ae927e3dbf0f1ab867f73))



## [0.17.1](https://github.com/Tencent/feflow/compare/v0.17.0...v0.17.1) (2019-12-17)


### Bug Fixes

* local develop a scallfold cause upgrade check ([#172](https://github.com/Tencent/feflow/issues/172)) ([eab5fa3](https://github.com/Tencent/feflow/commit/eab5fa36d6e38cd2fa58761336ab9374edcfd2b6))


### Features

* support sub command description ([#168](https://github.com/Tencent/feflow/issues/168)) ([2cc18fb](https://github.com/Tencent/feflow/commit/2cc18fbd975af77cddd73d77fd8679bd3bfaa16b))



# [0.17.0](https://github.com/Tencent/feflow/compare/v0.17.0-alpha.3...v0.17.0) (2019-11-29)



# [0.17.0-alpha.3](https://github.com/Tencent/feflow/compare/v0.17.0-alpha.1...v0.17.0-alpha.3) (2019-11-28)


### Bug Fixes

* install packages when not exists ([#161](https://github.com/Tencent/feflow/issues/161)) ([#163](https://github.com/Tencent/feflow/issues/163)) ([721f1d8](https://github.com/Tencent/feflow/commit/721f1d82b984ace1ca2466e63e6e047a9dad76ca))



# [0.17.0-alpha.1](https://github.com/Tencent/feflow/compare/v0.17.0-alpha.0...v0.17.0-alpha.1) (2019-11-28)


### Bug Fixes

* run commands error when in a feflow project but not installed devkit ([#159](https://github.com/Tencent/feflow/issues/159)) ([a7b987d](https://github.com/Tencent/feflow/commit/a7b987d098ee84e0bf03958204412d2c4c63a143)), closes [#157](https://github.com/Tencent/feflow/issues/157)


### Features

* **example:** make example in private scope ([39d021b](https://github.com/Tencent/feflow/commit/39d021bab261854c88f0d0ff2937a10dfec48e48))



# [0.17.0-alpha.0](https://github.com/Tencent/feflow/compare/v0.16.2...v0.17.0-alpha.0) (2019-11-27)


### Bug Fixes

* **native:** fix install commands when client is first config ([680442f](https://github.com/Tencent/feflow/commit/680442f8c6920cb707ffd6e3fd07ac5a29f78c1b))
* get username from os.hostname ([#143](https://github.com/Tencent/feflow/issues/143)) ([c3b0db2](https://github.com/Tencent/feflow/commit/c3b0db22eec02fc1a55d1e602cb218a7ad161d9b))
* handle exception cases while no plugins ([#142](https://github.com/Tencent/feflow/issues/142)) ([aed5b58](https://github.com/Tencent/feflow/commit/aed5b5892ef656dba758b9ab13d6ed1ec11c2e74)), closes [#139](https://github.com/Tencent/feflow/issues/139)
* support windows report with proxy ([#149](https://github.com/Tencent/feflow/issues/149)) ([3cd0463](https://github.com/Tencent/feflow/commit/3cd046326b68e5f61174bb747fbcf4d950a84d93))


### Features

* **devkit:** support multiple builders. ([3e3f241](https://github.com/Tencent/feflow/commit/3e3f2411af781c10fe5cfc06cbdb2b84b84cbb38)), closes [#111](https://github.com/Tencent/feflow/issues/111)
* support feature cli update tip ([90ab127](https://github.com/Tencent/feflow/commit/90ab12773075d60457530d2de66647104679ed60))



## [0.16.2](https://github.com/Tencent/feflow/compare/v0.16.1...v0.16.2) (2019-11-21)


### Features

* add list command ([#137](https://github.com/Tencent/feflow/issues/137)) ([1b8bcc0](https://github.com/Tencent/feflow/commit/1b8bcc00f9cef5dc389c0ae3efb5a6ae1ba5837f))
* support dynamic show help commands ([#140](https://github.com/Tencent/feflow/issues/140)) ([3ec5fab](https://github.com/Tencent/feflow/commit/3ec5fab64837dbe120c44e241f36a22f0e6253d2))



## [0.16.1](https://github.com/Tencent/feflow/compare/v0.16.0...v0.16.1) (2019-11-21)


### Bug Fixes

* fix ts errors ([610f304](https://github.com/Tencent/feflow/commit/610f30445b54712da473c3741dd76b622d4c7cf4))


### Features

* report commands before execute ([#134](https://github.com/Tencent/feflow/issues/134)) ([ca20a16](https://github.com/Tencent/feflow/commit/ca20a16bb9d3d48b2ea5b421a97bff32ccd7c745))



# [0.16.0](https://github.com/Tencent/feflow/compare/v0.16.0-beta.8...v0.16.0) (2019-11-18)



# [0.16.0-beta.8](https://github.com/Tencent/feflow/compare/v0.16.0-beta.4...v0.16.0-beta.8) (2019-11-14)


### Bug Fixes

* **core:** client config through commands ([#126](https://github.com/Tencent/feflow/issues/126)) ([bdcea16](https://github.com/Tencent/feflow/commit/bdcea1654bfa6934128d3b7f15d807315c920822))
* **core:** fix init error when choose package manager ([ad90a9d](https://github.com/Tencent/feflow/commit/ad90a9d34c2d765b81f2414062b6e0b8f6010353))


### Features

* support config client through feflow command ([#125](https://github.com/Tencent/feflow/issues/125)) ([b68df16](https://github.com/Tencent/feflow/commit/b68df160e4ba7c1e06e9e05f255d3d6d1bde1d27))



# [0.16.0-beta.4](https://github.com/Tencent/feflow/compare/v0.16.0-beta.3...v0.16.0-beta.4) (2019-11-05)


### Features

* support project config file with js extension ([#122](https://github.com/Tencent/feflow/issues/122)) ([f2b2cee](https://github.com/Tencent/feflow/commit/f2b2ceeb4bc1762c78661529f1e3391087c2e2f9)), closes [#114](https://github.com/Tencent/feflow/issues/114)
* support running devkit commands on sub directory. ([#121](https://github.com/Tencent/feflow/issues/121)) ([bc819f4](https://github.com/Tencent/feflow/commit/bc819f44ac5359e4651def5834fcda9f6a35f580)), closes [#114](https://github.com/Tencent/feflow/issues/114)



# [0.16.0-beta.3](https://github.com/Tencent/feflow/compare/v0.15.8...v0.16.0-beta.3) (2019-11-04)


### Bug Fixes

* create project undefined when finished ([#116](https://github.com/Tencent/feflow/issues/116)) ([e052faf](https://github.com/Tencent/feflow/commit/e052faf0ee8fa3a21695a258e4b438b94f14c503))
* issue [#107](https://github.com/Tencent/feflow/issues/107) and issue [#106](https://github.com/Tencent/feflow/issues/106) ([#108](https://github.com/Tencent/feflow/issues/108)) ([a28d386](https://github.com/Tencent/feflow/commit/a28d38638fbf62219216de5a354db1cbb1030484))



## [0.15.8](https://github.com/Tencent/feflow/compare/v0.15.6...v0.15.8) (2019-05-30)


### Bug Fixes

* add some pkg ([#95](https://github.com/Tencent/feflow/issues/95)) ([c113162](https://github.com/Tencent/feflow/commit/c11316260e06dc41dd750d8d844fa8afc8157664))
* fix lint rule ([#96](https://github.com/Tencent/feflow/issues/96)) ([39e3aa5](https://github.com/Tencent/feflow/commit/39e3aa505691b2df37a880776676abfebd249ca9))



## [0.15.6](https://github.com/Tencent/feflow/compare/v0.15.5...v0.15.6) (2019-05-29)


### Bug Fixes

* fix eslint check ([#94](https://github.com/Tencent/feflow/issues/94)) ([feee34c](https://github.com/Tencent/feflow/commit/feee34c5860af871a4ea689532e70f7d3052c85c))



## [0.15.5](https://github.com/Tencent/feflow/compare/v0.15.4...v0.15.5) (2019-05-22)


### Features

* support active subgenerator ([#93](https://github.com/Tencent/feflow/issues/93)) ([234e6bc](https://github.com/Tencent/feflow/commit/234e6bce4778fcee2eddfc1f6e6207dadd16d90a))



## [0.15.4](https://github.com/Tencent/feflow/compare/v0.15.3...v0.15.4) (2019-04-24)


### Bug Fixes

* change package.json main file ([#90](https://github.com/Tencent/feflow/issues/90)) ([e6e7ee9](https://github.com/Tencent/feflow/commit/e6e7ee9332043b01f93776489a74c5714071b3ff))


### Features

* add unsafe-perm params to avoid node-sass problems ([#91](https://github.com/Tencent/feflow/issues/91)) ([26764dc](https://github.com/Tencent/feflow/commit/26764dcf8f624aecaa956bad2f15408ee67fec81))
* auto list help docs ([#83](https://github.com/Tencent/feflow/issues/83)) ([981e329](https://github.com/Tencent/feflow/commit/981e329f861924ec1a0b50119e1a28daa2b44dca))
* list plugins and generators ([#88](https://github.com/Tencent/feflow/issues/88)) ([984d62b](https://github.com/Tencent/feflow/commit/984d62b481f51f4d718005d3a05ae3a05e5be4ee))



## [0.15.3](https://github.com/Tencent/feflow/compare/v0.15.2...v0.15.3) (2019-02-27)


### Bug Fixes

* filter wrong command ([#78](https://github.com/Tencent/feflow/issues/78)) ([99b2381](https://github.com/Tencent/feflow/commit/99b238124636ae53d8c04ec3dbbdec3f488fc23a))
* stop update when full update error ([#74](https://github.com/Tencent/feflow/issues/74)) ([85e1633](https://github.com/Tencent/feflow/commit/85e163382ec4ef70d03b08ccc79345d5d358c067))



## [0.15.2](https://github.com/Tencent/feflow/compare/v0.15.1...v0.15.2) (2019-02-13)


### Bug Fixes

* fix Loadind_require_error ([f68dc5c](https://github.com/Tencent/feflow/commit/f68dc5c14f2474d8b45d692008f29fa51f5c803a))
* when install plugin in devDependencies cant use plugin ([#70](https://github.com/Tencent/feflow/issues/70)) ([9819083](https://github.com/Tencent/feflow/commit/98190833a8908962323d07d501b424572db9495e))


### Features

* add clean command ([#71](https://github.com/Tencent/feflow/issues/71)) ([632505f](https://github.com/Tencent/feflow/commit/632505f3679eceb664dbb0d9bb215b673e441fbf))



## [0.15.1](https://github.com/Tencent/feflow/compare/v0.15.0...v0.15.1) (2019-01-03)


### Bug Fixes

* update inquirer and yeoman-environment to fix windows bug ([67bf3e2](https://github.com/Tencent/feflow/commit/67bf3e24fada2ea2047a87db951e7b2d028da79d))
* update inquirer and yeoman-environment to fix windows bug ([d21d026](https://github.com/Tencent/feflow/commit/d21d02604b18289b1bfa8d5c98d451a794ad1d73))
* word for scaffold question is error ([501ded5](https://github.com/Tencent/feflow/commit/501ded5f8e31940b642cc0f1c991e127d045bd73))


### Features

* add test ([25f17ca](https://github.com/Tencent/feflow/commit/25f17ca456c41370daaf94614b3fec14e73818ef))
* 常用及通用的功能传递给 脚手架|builder|deploy 及插件使用 ([0845f32](https://github.com/Tencent/feflow/commit/0845f32cac9d20051968ef3e91aa5b17206cbe6f))



# [0.15.0](https://github.com/Tencent/feflow/compare/v0.15.0-alpha.1...v0.15.0) (2018-12-15)



# [0.15.0-alpha.1](https://github.com/Tencent/feflow/compare/v0.15.0-alpha.0...v0.15.0-alpha.1) (2018-12-15)


### Features

* add disable-check params ([d6542ad](https://github.com/Tencent/feflow/commit/d6542adb7b2c06be47ec337dc543ca2828a20be2))
* disable-check param for templates, builder and plugins ([3d4ea1d](https://github.com/Tencent/feflow/commit/3d4ea1dbb36905635760ec14a5da05f8f671084e))



# [0.15.0-alpha.0](https://github.com/Tencent/feflow/compare/v0.14.0...v0.15.0-alpha.0) (2018-12-08)


### Bug Fixes

* require deploy as internal plugins ([81c01c5](https://github.com/Tencent/feflow/commit/81c01c5b9a77bca06ecce5d4311cfc888726d400))


### Features

* install templates, builder and plugins with global-style ([bb509d8](https://github.com/Tencent/feflow/commit/bb509d8325a3d08ac6394f2ca1c749182f738846))



# [0.14.0](https://github.com/Tencent/feflow/compare/v0.13.6...v0.14.0) (2018-09-29)


### Features

* add deployer command ([1fcba76](https://github.com/Tencent/feflow/commit/1fcba76e6efc0ca9d1f5a579f54a2a4e21acebe1))
* 提供自动安装npm依赖选项 ([741a34d](https://github.com/Tencent/feflow/commit/741a34dae1c20cb92da59f2603838aa0bd532329))
* 添加eject功能 ([7b49e2f](https://github.com/Tencent/feflow/commit/7b49e2f0e574dcd2d21061c02b8284e7746f66fb))



## [0.13.6](https://github.com/Tencent/feflow/compare/v0.13.5...v0.13.6) (2018-08-08)


### Bug Fixes

* fix cod to code ([145e517](https://github.com/Tencent/feflow/commit/145e517e09ca42fc68e5ac33015a569935e24339))



## [0.13.5](https://github.com/Tencent/feflow/compare/v0.13.4...v0.13.5) (2018-07-04)


### Features

* config support js file(eg: feflow.js or feflow.json) ([4c7dfd8](https://github.com/Tencent/feflow/commit/4c7dfd8c0a1cad22dd7599e88017c7588466f618))



## [0.13.4](https://github.com/Tencent/feflow/compare/v0.13.2...v0.13.4) (2018-06-20)


### Bug Fixes

* don't check yeoman generators update when not in init command. ([9cb84f2](https://github.com/Tencent/feflow/commit/9cb84f2aa1b6a9f520a55af59642c961de6c1f05))


### Features

* support passing args when init project. ([1e63a49](https://github.com/Tencent/feflow/commit/1e63a495a41a5fe11166cb15377b34943f89296f))



## [0.13.2](https://github.com/Tencent/feflow/compare/v0.13.1...v0.13.2) (2018-04-28)


### Features

* 支持脚手架和构建器的分别增量更新机制. ([6c2fc65](https://github.com/Tencent/feflow/commit/6c2fc656d7a4403bf18f752e95d50d953984186c))



## [0.13.1](https://github.com/Tencent/feflow/compare/v0.13.0...v0.13.1) (2018-03-09)


### Bug Fixes

* **core:** increment update failed bug ([e5333cd](https://github.com/Tencent/feflow/commit/e5333cd1d056cd7be341f78e6563b34888ad127f))



# [0.13.0](https://github.com/Tencent/feflow/compare/v0.12.0...v0.13.0) (2018-02-06)


### Features

* check log dir when feflow init. ([a6b185d](https://github.com/Tencent/feflow/commit/a6b185da0074ebd15a1ad59a764b15c587f25411))
* don't record debug log to local log file. ([7b0859d](https://github.com/Tencent/feflow/commit/7b0859dd46fe2568153ea188c2c1b2911d38406f))
* record and seperate logs to local dir. ([c5f98b2](https://github.com/Tencent/feflow/commit/c5f98b24c73bebf6783bca02555b7f131c77197d))



# [0.12.0](https://github.com/Tencent/feflow/compare/v0.12.0-alpha.1...v0.12.0) (2017-12-11)



# [0.12.0-alpha.1](https://github.com/Tencent/feflow/compare/v0.12.0-alpha.0...v0.12.0-alpha.1) (2017-12-10)


### Features

* add feflow lint ([c235e8b](https://github.com/Tencent/feflow/commit/c235e8b0db7591ab31170e18dd037e945aaff484))
* ignore files ([b6d07fb](https://github.com/Tencent/feflow/commit/b6d07fbd161d43ad094238187987efae48ab7c3b))
* 新增feflow lint ([3814216](https://github.com/Tencent/feflow/commit/3814216b0ea16d0a9eab40ee86f9897a142bc985))



# [0.12.0-alpha.0](https://github.com/Tencent/feflow/compare/v0.11.3...v0.12.0-alpha.0) (2017-12-09)


### Features

* add dev and build command ([88414b2](https://github.com/Tencent/feflow/commit/88414b2a68762a0822187152b3ab10ba6e1a9eaf))
* intergate dev and build commands ([9a3efaa](https://github.com/Tencent/feflow/commit/9a3efaa1485216abe1f8b907d6d9f34633335fae))



## [0.11.3](https://github.com/Tencent/feflow/compare/v0.11.1...v0.11.3) (2017-11-25)


### Bug Fixes

* process should exit after client init success ([572eac5](https://github.com/Tencent/feflow/commit/572eac5dbd897c7a5e7d57f2385dfe96c3087f82))
* trim space after user input registry and proxy. ([cb25ea6](https://github.com/Tencent/feflow/commit/cb25ea6138d179b8ddfccf7060027314f28c8ab3)), closes [#6](https://github.com/Tencent/feflow/issues/6)



## [0.11.1](https://github.com/Tencent/feflow/compare/v0.11.0...v0.11.1) (2017-11-10)


### Bug Fixes

* upgrade action should after init client ([649a0ae](https://github.com/Tencent/feflow/commit/649a0aeddc9d26ca486938ae7d189f4832974d23))



# [0.11.0](https://github.com/Tencent/feflow/compare/v0.10.4...v0.11.0) (2017-11-09)


### Features

* check upgrade and force update when not compatible ([529568d](https://github.com/Tencent/feflow/commit/529568dc4a5a799e9422965fe67641518213abfd))
* force update to latest version when not compatible. ([2455888](https://github.com/Tencent/feflow/commit/245588806df48c2a2cf696fd1bd85c0228afaa4a))
* plugin increment update policy. ([7a3039d](https://github.com/Tencent/feflow/commit/7a3039d7aadd4e4477b4da68f6b18067305fee7d))



## [0.10.4](https://github.com/Tencent/feflow/compare/v0.10.3...v0.10.4) (2017-11-08)


### Features

* add compatiable version field in package.json ([d0fe38b](https://github.com/Tencent/feflow/commit/d0fe38be53b90c92f1a47f3ad21ea312f3482be4))



## [0.10.3](https://github.com/Tencent/feflow/compare/v0.10.2...v0.10.3) (2017-09-28)


### Bug Fixes

* install issue fix ([d3f181a](https://github.com/Tencent/feflow/commit/d3f181afe308303f7e348a1d50b5e48625d35c39)), closes [#1](https://github.com/Tencent/feflow/issues/1)


### Features

* get, set or list config items ([e311d83](https://github.com/Tencent/feflow/commit/e311d834034e6107db9ecc4310b4d98fa84ba9af))



## [0.10.2](https://github.com/Tencent/feflow/compare/v0.10.0...v0.10.2) (2017-09-10)


### Bug Fixes

* fix deps ([c28eb14](https://github.com/Tencent/feflow/commit/c28eb148921efbd552735fb28a8656fa28261ac6))
* npm registry and proxy can be set when initialized. ([a9a8119](https://github.com/Tencent/feflow/commit/a9a8119290b3771ba028f1500c6ff9f57af965b0))
* support yeoman generator app/index.js folder ([bedfaa9](https://github.com/Tencent/feflow/commit/bedfaa97bc6c51d42154ec8dd1537cf37f95d981))


### Features

* check node engine requirements ([499358d](https://github.com/Tencent/feflow/commit/499358de231c9984058ca8ef0f6c503a6556397e))
* init client before load external plugins ([2982f3d](https://github.com/Tencent/feflow/commit/2982f3d53a734c26b6785cbd0743449d52754c45))
* print banner when no args ([3fff39c](https://github.com/Tencent/feflow/commit/3fff39c6e2edc551c32146cba8c78cb49108b9bc))
* use yaml to store local config ([c7d3241](https://github.com/Tencent/feflow/commit/c7d32416b02b864b29102860cd9f786d11ba00f3))



# [0.10.0](https://github.com/Tencent/feflow/compare/626def22faea765f77521e60cdaec37a9534e084...v0.10.0) (2017-08-21)


### Features

* add uninstall plugin command. ([84de19a](https://github.com/Tencent/feflow/commit/84de19ae1564b394798154c0cebb33a023c5d055))
* command register mechanism. ([febe1c3](https://github.com/Tencent/feflow/commit/febe1c390edccc02e17d095448f07dec64667946))
* Initial commit ([626def2](https://github.com/Tencent/feflow/commit/626def22faea765f77521e60cdaec37a9534e084))
* support -v and --version command. ([fa14d9e](https://github.com/Tencent/feflow/commit/fa14d9e633fe9d2f259c6e8e19e2079b50fb00c6))



