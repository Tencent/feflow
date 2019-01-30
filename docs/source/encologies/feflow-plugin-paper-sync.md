id: feflow-plugin-paper-sync
name: feflow-plugin-paper-sync
tag: '插件'
logo: ''
master: erwinliu
overview: 社区文章同步插件
description: 该插件可以把 IVWEB 社区的文章一键同步到 KM 上
screenshot: ''
lastestVersion: '1.0.4'
updateTime: '2018-11-27'
github: 'https://git.code.oa.com/feflow-plugin/feflow-plugin-paper-sync'
agreement: 'MIT'
layout: encologies-detail
---

0. 终端设置代理

因为 ivweb.io 是外网环境，所以要设置代理让终端走外网环境，简单的配置如下

    ```sh
    export https_proxy=http://web-proxy.tencent.com:8080
    export http_proxy=http://web-proxy.tencent.com:8080
    ```

1. 安装 `feflow-plugin-paper-sync`

    ```sh
    feflow install @tencent/feflow-plugin-paper-sync
    ```

2. 去社区找到自己想同步的文章 ID

    ![如何寻找文章ID](./images/article.png)

3. 执行命令同步文章

    ```sh
    feflow sync <id>
    # 例如 feflow sync 100335
    ```
