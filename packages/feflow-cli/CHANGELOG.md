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

* **devkit:** spelling error ([c059638](https://github.com/Tencent/feflow/commit/c0596382fd3dc0e8c95fad6dbaac0cb4df7ddbb9))
* fix help command without option ([#211](https://github.com/Tencent/feflow/issues/211)) ([754348f](https://github.com/Tencent/feflow/commit/754348fdb23c52c43f2745ae68965bf3c8512998))


### Features

* support devkit.js/devkit.yaml/devkit.yml/devkitrc/package.json format ([2ddeccb](https://github.com/Tencent/feflow/commit/2ddeccb1e50983f378c51c493016a7f5ce949010))
* **cli:** support auto-update params ([115e742](https://github.com/Tencent/feflow/commit/115e74279c339e16f1d2815e5daf99d252ba12a2))
* **devkit:** support plugin/devkit sub command help ([#207](https://github.com/Tencent/feflow/issues/207)) ([17be24d](https://github.com/Tencent/feflow/commit/17be24d8c5bbb2eb3c3faedc1f441e219997210a))



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

* add generator.json to npm file ([cf3b21a](https://github.com/Tencent/feflow/commit/cf3b21aaf7875dfae2a74f5e8131287fa9a35435))
* **devkit:** support projectPath for devkit ([9505e04](https://github.com/Tencent/feflow/commit/9505e04ceea326495138982f0e2cba8b8cf20c2d))



# [0.18.0](https://github.com/Tencent/feflow/compare/v0.18.0-alpha.2...v0.18.0) (2020-03-04)


### Features

* **generator-example:** generator json schema ([e411acd](https://github.com/Tencent/feflow/commit/e411acd83b73b8dd3eaef0be451f1de8ec27ad6e))
* **generator-example:** support initialize project with params ([187119c](https://github.com/Tencent/feflow/commit/187119c87834078392eac77e073602c4211fa54e))
* config params ([f5fcf5c](https://github.com/Tencent/feflow/commit/f5fcf5c8720f6df21930f0817922e12ee2fab39c))



# [0.18.0-alpha.2](https://github.com/Tencent/feflow/compare/v0.18.0-alpha.1...v0.18.0-alpha.2) (2020-03-02)


### Features

* **hook:** add feflow hooks ([a8076ec](https://github.com/Tencent/feflow/commit/a8076ece163013892ad9a6762f81e046275a2196))



# [0.18.0-alpha.1](https://github.com/Tencent/feflow/compare/v0.17.1...v0.18.0-alpha.1) (2020-02-29)


### Bug Fixes

* **package-manager:** npm and yarn source ([3384f8f](https://github.com/Tencent/feflow/commit/3384f8f04c057cb37666b673521516b943160562))


### Features

* **devtool:** add devtool internal plugin ([4c98456](https://github.com/Tencent/feflow/commit/4c98456782a23af0c0900368c0696ee5160544ae))
* **devtool:** add internal devtool plugin ([ef053c5](https://github.com/Tencent/feflow/commit/ef053c544964c63be206004f0ae4c10dca8fd0ee))
* **devtool:** copy templates according to user input ([7557299](https://github.com/Tencent/feflow/commit/75572990fc7697f7693c40e71a60a615e43af7ea))
* **devtool:** create template logic ([41afeeb](https://github.com/Tencent/feflow/commit/41afeeb578d0e07d101137356d175e11b7a3fd1b))
* **devtool:** support feflow-plugin dev ([2f2323e](https://github.com/Tencent/feflow/commit/2f2323e7900bb6debc0245a110aba1391bf701ac))
* support cnpm when initialize ([6095912](https://github.com/Tencent/feflow/commit/6095912ff00140d2b29839bd478f8e1ca970d893))
* **init:** remove -g param ([1d91a32](https://github.com/Tencent/feflow/commit/1d91a3201949f660f22d34810a6f6e0d11335c74))
* **init:** support initialize project with selected generator ([fff9b24](https://github.com/Tencent/feflow/commit/fff9b244c8b3e44c6d659d1558551465d996aeb6))


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

* get username from os.hostname ([#143](https://github.com/Tencent/feflow/issues/143)) ([c3b0db2](https://github.com/Tencent/feflow/commit/c3b0db22eec02fc1a55d1e602cb218a7ad161d9b))
* handle exception cases while no plugins ([#142](https://github.com/Tencent/feflow/issues/142)) ([aed5b58](https://github.com/Tencent/feflow/commit/aed5b5892ef656dba758b9ab13d6ed1ec11c2e74)), closes [#139](https://github.com/Tencent/feflow/issues/139)
* support windows report with proxy ([#149](https://github.com/Tencent/feflow/issues/149)) ([3cd0463](https://github.com/Tencent/feflow/commit/3cd046326b68e5f61174bb747fbcf4d950a84d93))
* **native:** fix install commands when client is first config ([680442f](https://github.com/Tencent/feflow/commit/680442f8c6920cb707ffd6e3fd07ac5a29f78c1b))


### Features

* support feature cli update tip ([90ab127](https://github.com/Tencent/feflow/commit/90ab12773075d60457530d2de66647104679ed60))
* **devkit:** support multiple builders. ([3e3f241](https://github.com/Tencent/feflow/commit/3e3f2411af781c10fe5cfc06cbdb2b84b84cbb38)), closes [#111](https://github.com/Tencent/feflow/issues/111)



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



