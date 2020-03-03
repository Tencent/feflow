# [generator-example](https://github.com/Tencent/feflow/tree/master/examples/generator-example)

Feflow example template. based on React and Redux.

## Features

- ✔︎ Easy to create a project with react and redux
- ✔︎ Support multiple page development
- ✔︎ Built-in Rem, it's friendly to develop a mobile application
- ✔︎ Fast build speed and very small artifacts size

## Installation

You need to install [`feflow`](https://github.com/Tencent/feflow) first.

```sh
$ npm install @feflow/cli -g
```

Then install @feflow/generator-example

```sh
$ fef install @feflow/generator-example
```

## Usage

initialize project with interactive inquiry

```sh
$ fef init
```

### Params

- name. project name
- description. some description for your project
- version. project version

initialize project with selected generator

```sh
fef init --generator=@feflow/generator-example --config='{"version":"v0.1.0","description":"项目描述","name":"feflow-demo-v12"}'
```

Note: use arrow keys to select.
