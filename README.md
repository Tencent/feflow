![banner](https://user-images.githubusercontent.com/18289264/35855826-34885a0c-0b6f-11e8-9ba2-98272cb9a27a.png)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/feflow/feflow/blob/master/LICENSE)
[![](https://img.shields.io/travis/feflow/feflow.svg?style=flat-square)](https://travis-ci.org/feflow/feflow)
[![Codecov](https://img.shields.io/codecov/c/github/feflow/feflow/master.svg?style=flat-square)](https://codecov.io/gh/feflow/feflow/branch/master)
[![Package Quality](http://npm.packagequality.com/shield/feflow-cli.svg)](http://packagequality.com/#?package=feflow-cli)
[![npm package](https://img.shields.io/npm/v/feflow-cli.svg?style=flat-square)](https://www.npmjs.org/package/feflow-cli)
[![NPM downloads](http://img.shields.io/npm/dt/feflow-cli.svg?style=flat-square)](https://npmjs.org/package/feflow-cli)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/feflow/feflow/pulls)
[![Join the chat at https://gitter.im/feflow/feflow-cli](https://badges.gitter.im/feflow/feflow-cli.svg)](https://gitter.im/feflow/feflow-cli?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A command line tool aims to improve front-end engineer workflow and standard, powered by [Node.js](https://nodejs.org/en/).

[中文 README](README_zh-CN.md)

## Features

- ✔︎ Powerful plugin system, easy to extend.
- ✔︎ Integrate with Yeoman, easy to initialize project based on yeoman generators.
- ✔︎ Support multiple mainstream builder, including webpack, fis and etc.
- ✔︎ Define a series of standards including commit standard and ESlint standard.
- ✔︎ Seperate CLI core and plugins, it will force update when not compatible with latest version.

## Installation

``` bash
$ npm install feflow-cli -g
```

## Usage
```bash
# Create a project
$ feflow init

# Local development
$ feflow dev

# Code quality
$ feflow lint

# Build and package
$ feflow build

# Install plugins, yeoman generators and builders
$ feflow install package

# Config client
$ feflow config <key> <value>
```

## Docs

* 中文文档 <http://www.feflowjs.org/zh-cn/docs/>

## Architecture
![](https://qpic.url.cn/feeds_pic/ajNVdqHZLLDsuocibo3TZ3GE5TMmVywG0lRyiayfI8D3icgW8FrkFKFOQ/)

## Contributing

1. Check for open issues or open a fresh issue to start a discussion around a feature idea or a bug.
2. Fork [the repository](https://github.com/feflow/feflow)_ on GitHub to start making your changes to the **master** branch (or branch off of it).
3. Write a test which shows that the bug was fixed or that the feature works as expected.
4. Send a pull request and bug the maintainer until it gets merged and published. :) Make sure to add yourself to [AUTHORS_](AUTHORS).

## Changelog

[Changelog](CHANGELOG.md)

## License

[MIT](https://tldrlegal.com/license/mit-license)
