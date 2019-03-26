# Introduction

Welcome to Feflow, this document will help you get started quickly. And if you have any problems during use, please send feedback on [GitHub](https://github.com/feflow/feflow/issues).

![feflow](https://pub.idqqimg.com/3cb9b240fbbc4a5d946ceb96325be36f.svg)

## What is Feflow

Feflow (pronounced /ˈfefləʊ/) is a **front-end flow and rule tool** to improve engineering efficiency. The latest version is v0.15.1, and is hosted on Github: [feflow](https://github.com/feflow/feflow). At present, it has been used in many application, such as Now, Huayang Live, Huayang Friends, Mobile QQ Near Hand, Group Video, Group Gift, Huiyin, Tencent Myapp, Penguins and etc. With 80+ WEB/IOS/Andriod stable users, the cumulative production project reached 240+.

Feflow refers to the thinking of Pipeline and divides work into five steps: init, develop, build, test, deploy. And corresponding to five basic commands: init, dev, build, test and deploy.

In addition to serving basic development workflows and specifications, Feflow provides an easy-to-expand plug-in mechanism for creating a team-wide toolchain ecosystem.

![](https://qpic.url.cn/feeds_pic/ajNVdqHZLLD5vbArj0iaIkMLnGU3xPohibwRHibiaR3cibuy6RKYgHNCmFg/)

## Concept

Feflow only provides a CLI and kernel. The CLI is responsible for interacting with the command line terminal. The kernel provides update mechanism, plugin mechanism and standardized log output capability. Feflow does not have any built-in logic related to the business.

So, if you want to use Feflow in a team, you need to understand the following concepts:

- [Scaffold](#Scaffold)
- [Builder](#Builder)
- [Plugin](#Plugin)
- [Development-specification](#Development-specification)

### Scaffold

In many front-end teams, there is a problem that the project development is not intelligent**. Many developers develop new projects based on the original project copy. This results in different project directory structures developed by different people in a team. It is time-consuming and labor-intensive to transfer and maintain subsequent projects.

To solve this problem, Feflow introduced the community's mainstream scaffolding to initialize the project. The scaffold of Feflow is based on [Yeoman](https://yeoman.io/). It expands the standardized log and CLI tooling function to the scaffold through the context object. At the same time, it provides incremental updating mechanism for scaffolding. When creating the project, it will raise incremental updates when the local version and remote version are incompatible.

After introducing scaffolding, on the one hand, the team can maintain a unified technology stack and unified directory structure; on the other hand, it can also do some automated things when initializing the project, such as automatically creating remote Git repository and assigning developers master/developer rights limit, application monitoring Id, and internal CI/CD system to open quickly and so on.

### Builder

After the project is created, the next issue is local development and code packaging. The usual practice is to put the build script directly in the business project. Each business developer can modify it according to his own needs. The problem is that the build scripts of each project are different, the construction is not uniform, and each Projects need to repeatedly install build dependencies.

Feflow introduces the concept of a builder. Its basic idea is to manage the build scripts in a unified manner, and the maintenance is carried out by the students who are familiar with the build. The builder needs to be published to npm for version management, and it is recommended that each project use the same builder. After the builder is installed via feflow, it will be stored under `~/.feflow/node_modules` so that each project can share a set of build scripts.

### Plugin

In addition to providing basic functionality, Feflow also has a plug-in mechanism to easily extend subcommands. You can use the plugin to do a lot of automation, such as batch compression of images, building operational activities, local development SDK, code statistics and so on.

## Contributor
