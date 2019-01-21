title: 插件
---

目前为止，你可能接触到了 Feflow 的一些命令，现在，我要揭开它们的真面目，即它们都是 Feflow 内置插件注册的命令。

插件是 Feflow 的一个重要特性，本质上 Feflow 就是一个插件管理工具，每个插件可以在 Feflow 上注册多个命令，这样一来，Feflow 就支持很多命令了。

现在，就让我们来一览 Feflow 所有的内置插件以及他们注册的命令。

## 模块管理插件

该插件包含两个命令：

```sh
# 1. 安装包
feflow install <package-name>
# 2. 卸载包
feflow uninstall <package-name>
```

`feflow install <package-name>` 命令是迄今为止用的最多的命令之一，它可以将各种 NPM 模块安装至 `~/.feflow/node_modules` 下面。我们用它安装脚手架、构建器或者是插件。

`feflow uninstall <package-name>` 命令与上述命令相反，它用于卸载 Feflow 下的 NPM 模块。

由于这个插件可以安装或卸载任意 NPM 模块，所以我们称之为模块管理插件。有了这个插件，就方便了诸如脚手架、构建器、部署器、插件的管理。

## 脚手架调度插件

该插件包含一个命令：

```sh
feflow init
```

这个插件可以让用户从本地已经安装好的脚手架中选取一个用作项目的创建，因此我们把这个插件称为脚手架调度插件。

脚手架调度插件每次执行的时候，会自动更新本地所有有新版本的脚手架，如果你想跳过更新，可以加上一个 `--disableCheck` 的参数：

```sh
feflow init --disableCheck
```

> 关于脚手架的开发可以阅读[这里](./advance-scaffold-custom.html)

## 构建器调度插件

该插件包含两个命令：

```sh
# 1. 本地开发
feflow dev
# 2. 生成打包文件
feflow build
```

这个插件会获取项目根目录下 `feflow.js` 或者 `feflow.json` 配置文件中的 `builderType` 字段的值作为构建器的名字。如果你没有用 Feflow 安装过这个构建器，该插件则会自动帮你安装好，然后这个插件会委托构建器执行 `dev` 或者是 `build` 命令，实现构建过程。

因为构建器是独立的，这个插件会根据配置选择指定的构建器进行构建，所以我们把这个插件称为构建器调度插件。这种将构建器分离出来的方式有效的帮助了项目升级构建代码的过程。

> 关于构建器的开发可以阅读[这里](./advance-builder-custom.html)

## 部署器调度插件

该插件包含一个命令：

```
feflow deploy
```

这个插件会获取项目根目录下 `feflow.js` 或者 `feflow.json` 配置文件中的 `deployerType` 字段的值作为部署器的名字，然后委托部署器执行 `deploy` 命令，实现部署过程。

> 关于部署器的开发可以阅读[这里](./deployer-custom.html)

## 全局配置插件

这个插件可能一般用的比较少，它是用来在 ~/.feflow/.feflowrc.yml 文件中设置和获取配置项的，这个文件可以作为 Feflow 全局的配置文件使用。Feflow 内置插件会用到该文件中的两个配置项，一个是 `registry`，一个是 `proxy`，都是用于 Feflow 或插件下载包时需要走私有的仓库或者代理的情况。如果你自己开发了插件，并且想给用户一些自定义的配置，就可以利用该插件来添加这些配置，然后你的插件可以通过 Feflow 传过来的上下文获取到这些配置。

全局配置插件注册了一个 `config` 命令，并且支持 `set`、`get`、`list` 三个子命令，用法如下：

```sh
# 列出所有配置项
feflow config list
# 获取一个配置项
feflow config get <key>
# 添加或修改一个配置项
feflow config set <key> <value>
```

## 代码检查插件

Feflow 还内置了一个代码检查插件，可以方便你用 ESLint 检查项目的代码：

```sh
feflow lint [folder]
```

它还支持 `--ignore` 参数，允许检查时忽略一些目录或文件。

## 自定义插件

Feflow 除了内置一些核心插件外，还支持开发者编写自己的插件并注册到 Feflow 上，将 Feflow 打造成自己独有的一套工程化工具，关于如何开发一个自己的插件请阅读[自定义插件](./advance-plugins-custom.html)一章。