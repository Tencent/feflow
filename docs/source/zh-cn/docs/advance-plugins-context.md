title: 插件上下文 API
---

无论是开发脚手架、构建器还是插件，Feflow 都会通过传参或注入全局变量给开发者提供一个 Feflow 实例方便大家开发，这是个实例又被称为插件上下文，本章将列出所有插件上下文的 API。

## Feflow 运行环境相关 API

### feflow.version

返回当前 Feflow 的版本。string 类型。

### feflow.baseDir

返回 Feflow 的主目录。string 类型。

### feflow.rcPath

返回 Feflow 全局配置文件 `.feflowrc.yml` 的路径。string 类型。

### feflow.pkgPath

返回 Feflow 的 `package.json` 文件的路径。string 类型。

### feflow.pluginDir

返回 Feflow 的插件、构建器、脚手架等安装路径。string 类型。

### feflow.logDir

返回 Feflow 日志的路径。string 类型。

### feflow.config

返回 Feflow 的全局配置对象，即 `.feflowrc.yml` 读取出来的数据。object 类型。

### feflow.args

返回 feflow 命令经过解析的参数。如 `feflow init` 返回 `{ "": ["init"] }`。object 类型。

## Feflow 日志打印相关 API

Feflow 提供的工具类函数都放在 `feflow.log` 实例中，它包含以下属性和方法：

### feflow.log.info

控制台输出提示类日志的方法，Function 类型。

### feflow.log.debug

控制台输出调试类日志的方法，需要在命令行增加 --debug 才可启用这个方法，Function 类型。

### feflow.log.warn

控制台输出警告类日志的方法，Function 类型。

### feflow.log.error

控制台输出错误类日志的方法，Function 类型。

### feflow.log.fatal

控制台输出致命错误类日志的方法，Function 类型。

### feflow.log.i

`feflow.log.info` 方法的简写。

### feflow.log.d

`feflow.log.debug` 方法的简写。

### feflow.log.w

`feflow.log.warn` 方法的简写。

### feflow.log.e

`feflow.log.error` 方法的简写。

## Feflow 工具函数相关 API

Feflow 提供的工具类函数都放在 `feflow.utils` 对象中，它包含以下方法：

### feflow.utils.chalk

NPM 包 `chalk` 的引用，方便操作控制台输出字符的样式。Object 类型。

### feflow.utils.Loading(name, color)

控制台显示加载进度的构造函数。Function 类型。需要先 `new feflow.utils.Loading(name, color)` 生成一个实例 `loading`，然后再调用 `loading.success(message)` 或者 `loading.fail(message)` 方法表示成功加载或者加载失败。

## Feflow 命令相关 API

Feflow 命令相关 API都放在 `feflow.cmd` 实例中，它包含以下属性和方法：

#### feflow.cmd.alias

返回 Feflow 当前支持的所有命令以及它们的缩写。object 类型。

#### feflow.cmd.list()

返回 Feflow 当前支持的所有命令对应的执行函数。object 类型。

#### feflow.cmd.get(name)

返回 Feflow 特定的命令对应的执行函数。Function 类型。

#### feflow.cmd.register(name, desc, options, fn)

注册一个命令。Function 类型。