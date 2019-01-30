name: feflow-plugin-svgtocn
tag: '插件'
logo: ''
master: i-solar
overview: termtosvg 录制的 svg 文件中文美化插件
description: termtosvg 录制的 svg 文件对中文显示不太友好，本插件会让中文正常显示
screenshot: ''
lastestVersion: '0.0.1'
updateTime: '2019-01-14'
github: 'https://github.com/i-solar/feflow-plugin-svgtocn'
agreement: 'MIT'
layout: encologies-detail
---

#### 安装

这是一款 [Feflow](https://github.com/feflow/feflow) 的插件，需要先安装 [Feflow](https://github.com/feflow/feflow)：

```sh
npm i feflow-cli -g
```

然后再用 Feflow 安装本插件

```sh
feflow install feflow-plugin-svgtocn
```

#### 使用

```sh
feflow svgtocn <filename> [<filename> ...]
```

#### 效果

例如 termtosvg 录制屏幕如下：

![feflow](https://pub.idqqimg.com/0364c0997c0e46c19d9f34bc1653e161.svg)

经过该插件处理后的如下：

![convert-feflow](https://pub.idqqimg.com/3321a46b34c249ba945fb73749026bbb.svg)