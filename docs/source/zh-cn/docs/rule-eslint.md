title: ESLint 规范
---

[ESLint](https://eslint.org/) 是目前最主流的 Javascript 和 JSX 代码检查的利器。

很多大公司比如 [Airbnb](https://github.com/airbnb/javascript) 和 [Google](https://google.github.io/styleguide/javascriptguide.xml) 都有一套自己的 Javascript 编码规范，而规范能够实施离不开 ESLint。像 Airbnb 就有大名顶顶的 [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)，而 Google 则有 [eslint-config-google](https://github.com/google/eslint-config-google)。但他们都适合他们自己的团队，并不适合 Feflow 团队。

经过调研和探索，Feflow 也推出了适用于自己团队的 ESLint 解决方案 —— [eslint-config-ivweb](https://github.com/feflow/eslint-config-ivweb)。这套方案最核心的理念是**基于 `eslint:recommend` 做规则的定制化**。

## 从一次生产事故说起

2017年4月13日，腾讯高级工程师小圣在做充值业务时，修改了苹果iap支付配置，将JSON配置增加了重复的key。代码发布后，有小部分使用了vivo手机的用户反馈充值页面白屏，无法在Now app内进行充值。最后问题定位是：vivo手机使用了系统自带的webview而没有使用X5内核，解析JSON时遇到重复key报错，导致页面白屏。

类似的问题其实很多： 比如变量未定义，方法被覆盖等等都会造成js代码执行时报错。那么如何避免呢？ESLint官方提供sharable config（可共享配置），前端团队可以根据自身团队情况定制ESLint规范配置。

## 规则定义准则

* 不重复造轮子，基于 eslint:recommend 配置并改进
* 能够帮助发现代码错误的规则，全部开启
* 目的是团队的代码风格统一，而不是限制开发体验

## eslint-config-ivweb 介绍
 eslint-config-ivweb是腾讯NOW直播IVWEB团队的ESLint配置。目前发布初版，目前大约有130条规则，包含可能存在的错误、最佳实践、变量、代码风格、ES6相关等5个大的规则板块。

仓库地址：https://github.com/feflow/eslint-config-ivweb
欢迎提交issue或者PR一起参与团队规则维护

##     部分规则说明
![](https://pub.idqqimg.com/pc/misc/files/20171011/7a4572cf1c4b4690895f80bce33a76a1.jpg)
包含3个信息： 最左侧是规则，中间是错误级别，右侧是解释说明含义。错误级别包含：error、warn和off三个级别。

 更加详细的规则说明可以前往： [规则文档](https://github.com/feflow/eslint-config-ivweb/blob/master/docs/RULE.md)

## 项目接入使用

基本理念： 项目代码太多，不影响历史代码。只针对有改动的代码（.js和.jsx后缀）才进行校验。

第一步：添加或者修改.eslintrc.js 配置文件

``` javascript
module.exports = {
    "env": {
        "es6": true,
        "browser": true,
        "node": true
    },
    "extends": ["eslint:recommended", "ivweb"],
    "globals": {
        "__inline": true,
        "IS_SERVER": true,
        "__uri": true
    }
};
```

有部分eslint:recommended提到的规则在ivweb中没有提到，因此最好配合eslint:recommend一起使用。

只需要同时继承eslint:recommend 和 ivweb 即可，确保 ivweb 放置在最后。部分eslint:recommend定义的规则有点严格，ivweb里面有做定制化的修改。

第二步：增加precommit的hook和eslint-config-ivweb依赖

此处我们使用husky来管理所有的Hook，同之前的commit message校验。

```
{
  "name": "with-lint-staged",
  "version": "0.0.1",
  "scripts": {
    "precommit": "lint-staged"
  },
  "lint-staged": {
    "src/*.{js,jsx}": [
      "eslint --fix",
      "git add"
    ]
  },
  "devDependencies": {
    "eslint": "^4.8.0",
    "eslint-config-ivweb": "^0.1.0",
    "husky": "^0.14.3",
    "lint-staged": "^4.2.3"
  }
}
```

##    答疑互动

Q： 为什么不直接使用airbnb团队的 eslint-config-airbnb？  
A： airbnb官方的规则过于庞大，有10多个规则文件。维护起来成本较高，选择基于轻量级的 eslint:recommend 基础之上定制团队ESLint规则更加简单，也便于维护。

Q： 我觉得eslint-config-ivweb有些规则不太合适，怎么办？  
A： 欢迎提交issue讨论或者直接提交PR。仓库地址：https://github.com/feflow/eslint-config-ivweb

Q： 为什么使用lint-staged？  
A： lint-staged只会对修改过的js文件行数进行代码规范检查，不会对所有的代码检查，更加合理和可操作。
