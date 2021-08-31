## Feflow report sdk


#### 上报feflow用户的使用情况、统计命令的调用次数、耗时以及成功率信息。


### Fef

上报分为两个版本，在`fef`中借助hook的能力，可以将上报分为两块，即`HOOK_TYPE_BEFORE`和`HOOK_TYPE_AFTER`hook中，分别对应着命令执行前和执行后，前者上报命令的基本信息，后者主要上报该命令的耗时、以及成功与否

#### 用法

```

import Report from "@tencent/report"

// sdk中会在hook中自动注册
// 不再需要手动调用
new Report(fakeCtx, cmd, args);

```

### Feflow 0.16.x

在老版本中，feflow并没有hook可以让sdk，所以还是得手动上报。

#### 用法
```
import Report from "@tencent/report"

const report = new Report(fakeCtx, cmd, args);

// 首次上报
report.report()

// ... 插件/脚手架执行

// 耗时上报
report.recallReport()
```

#### 对外 API
|api|参数|功能|
|--|--|--|
|init|cmd|组件初始化，添加 hooks|
|report|cmd, params(optional)|发送上报请求|
|reportInitResult|-|与init配合使用，发送上报数据|
|reportCommandError|err|发送命令报错信息|
|setCommandSource|commandSource|设置命令源|

### 单元测试TEST
执行前请将每个*.spec.ts文件中的src改成lib
```
npm test
```

