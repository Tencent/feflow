title: 打包构建
---

项目开发满意后，你可能想部署到正式环境中，那么首先就得把项目代码构建成浏览器能运行的版本。运行 `felfow build` 就会在项目根目录下生成一个打包后的目录，不同脚手架、不同构建器生成的目录以及目录里面的内容都各不相同。

以教程中的项目为例，运行 `feflow build` 就会生成一个 `dist` 目录，里面的目录结构如下：

```sh
|- cdn
    |- <bizName> # 目录名根据 feflow.json 中的业务名称属性 bizName 决定，里面包含 JS、CSS 和图片等静态资源
        |- img # 图片资源
|- offline
    |- offline.zip # 离线包
|- webserver
    |- <bizName> # 目录名根据 feflow.json 中的业务名称属性 bizName 决定，里面包含了页面入口
        |- index.html # 首页页面入口
```

你现在可以把打包后的文件部署在服务器上。