name: feflow-plugin-pic-optimize
tag: '插件'
logo: ''
master: zeyqiao
overview: Feflow图片压缩插件
description: png图片压缩原理是使用开源的压缩工具pngquant, pngcrush, optipng，依次串行对一张图片进行压缩和优化；jpg图片使用mozjpeg进行压缩和优化，自动转成progressive jpg；gif使用gifsicle进行压缩
screenshot: ''
lastestVersion: '1.0.14'
updateTime: '2018-12-21'
github: 'https://git.code.oa.com/zeyqiao/pic-optimize-plugin'
agreement: 'MIT'
layout: encologies-detail
---

这是个Feflow插件，原理是使用开源的压缩工具 pngquant, pngcrush, optipng，依次串行对一张图片进行压缩和优化：

* png图片压缩原理是使用开源的压缩工具pngquant, pngcrush, optipng，依次串行对一张图片进行压缩和优化
* jpg图片使用mozjpeg进行压缩和优化，自动转成progressive jpg
* gif使用gifsicle进行压缩

使用方式非常简单的，只需要两步。

因为需要从github上下载二进制文件，使用前请配置好代理。
```$xslt
export http_proxy=http://web-proxy.oa.com:8080
export https_proxy=$http_proxy
export ftp_proxy=$http_proxy
export all_proxy=$http_proxy
```


1. 安装插件
```
feflow install @tencent/feflow-plugin-pic-optimize
```

2. 运行插件。在项目根目录下运行插件，会自动遍历压缩src目录下的所有png文件。
```$xslt
feflow upic
```



