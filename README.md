# <a href='https://feflowjs.com/'>Feflow</a>

Feflow is a workflow tool aims to improve front-end engineer workflow and standard, powered by Typescript.

[![build status](https://img.shields.io/travis/Tencent/feflow/master.svg?style=flat-square)](https://travis-ci.org/Tencent/feflow)
[![npm version](https://img.shields.io/npm/v/@feflow/cli.svg?style=flat-square)](https://www.npmjs.com/package/@feflow/cli)

## Learn Feflow

Before you use Feflow, you need to understand the basic concepts.

### Just the Basics

There are three type of commands in Feflow:

- **Native commands**: Commands that Feflow native provide, such as init, install, uninstall, info, help.
- **Devkit commands**: Commands extended by Feflow devkit, a devkit usually has a series of commands and used for a real world project, Feflow devkit must have `feflow-devkit` prefix.
- **Plugin commands**: Commands extended by Feflow plugin, Feflow plugin must have `feflow-plugin` prefix.

### Feflow config file

When you use Feflow to develop a project, Feflow will load config file and load devkit described in config file. Config load order is:
- .feflowrc.js,
- .feflowrc.yaml,
- .feflowrc.yml,
- .feflowrc.json,
- .feflowrc,
- package.json

## Installation

To install the stable version:

```sh
npm install @feflow/cli -g
```

This assumes you are using [npm](https://www.npmjs.com/) as your package manager.

### Create a project
This will use Feflow native command `init`

```sh
feflow init
```

### Develop a project
This will use Feflow devkit commands, eg:

- Local development

```sh
feflow dev
```

- Build for production

``` sh
feflow build
```

- Lint JS

```sh
feflow lint
```

- Deploy project

``` sh
feflow deploy
```

- Generate changelog

```sh
feflow changelog
```

## Change Log

This project adheres to [Semantic Versioning](http://semver.org/).
Every release, along with the migration instructions, is documented on the GitHub [Releases](https://github.com/Tencent/feflow/releases) page.

## License

[MIT](LICENSE.txt)
