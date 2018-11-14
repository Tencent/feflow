title: 插件开发指引
---

以[feflow-plugin-deps](https://github.com/iv-web/feflow-plugin-deps)为例，讲讲如何开发一个feflow插件。

## 插件命名
所有的feflow插件需要以feflow-plugin-* 开头，插件开发完成需要发布到npm。

## 命令注册
命令需要以feflow.cmd.register进行注册，比如：

```
feflow.cmd.register('deps', 'Config ivweb dependencies', function(args) {
    console.log(args);
    // Plugin logic here.
});
```

说明：
* register有3个参数，第一个是子命令名称，第二个是命令描述说明信息，第三个是对应的子命令执行逻辑函数。
* feflow会将命令行参数args解析成Object对象，传递给插件处理函数

## 插件上下文
这里有一个非常巧妙的设计，通过使用node提供的module和vm模块，可以通注入feflow全局变量来访问到cli的实例。从而能够访问cli上的各种属性，比如config, log和一些helper等。

### 配置
可以通过feflow.version获取当前feflow的版本，feflow.baseDir 获取feflow跟目录（在用户目录下的.feflow），通过feflow.pluginDir 获取插件目录

### 日志
通过feflow.log来进行相关命令行日志输出

```
const log = feflow.log;
log.info()    // 提示日志，控制台中显示绿色
log.debug()   // 调试日志,  命令行增加--debug可以开启，控制台中显示灰色
log.warn()    // 警告日志，控制台中显示黄色背景
log.error()   // 错误日志，控制台中显示红色
log.fatal()   // 致命错误日志，，控制台中显示红色
```


