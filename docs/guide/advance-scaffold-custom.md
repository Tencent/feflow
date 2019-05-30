# Custom Generators

When you run `feflow init`, Feflow's internal plugin will use a scaffold to create a project. But how can we create our own scaffold?

It's very easy. We make use of the power of open source. All we need is just a Yeoman generator. If you know how to develop Yeoman generator, then you can basically develop your own generator. If you don't, then we will introdcuce it in the next part.

## Develop a Yeoman generator

If you have already know how to develop a Yeoman generator, you can just skip this part. However, here are some tips:

* The `description` field in your `package.json` should not be empty. Because Feflow need this field to tell users when they choose generators.

If you don't have experience in developing Yeoman generators, don't worry. We will give you a guide. More details can be found in [Yeoman Docs](https://yeoman.io/authoring/).

### Prepare

Install `yo` and `generator-generator` globally.

```sh
npm install yo generator-generator -g
# or yarn global add yo generator-generator
```

By this we use Yeoman and their generator to create our own generator quickly. This is not neccessary but we'd better follow these steps. Or we can not continue to next part.

### Generate scaffold

Now, we just need one command to generate scaffold：

```sh
yo generator
```

Attention again, **The `Description` in questions should be filled correctly**, Feflow will use it to provide introduction for generator.

You might notice that, **The name of project generated is begin with `generator-`**, If you manually create a scaffold, this is neccessary, too.

Let us look through the structure of directory we generated:

```sh
├── generators/
|   └── app/
│       ├── index.js
│       └── templates/
│           └── dummyfile.txt
```

`generators/app/index.js` is the logic of generating project. And `generators/templates/` directory is just a scaffold of project. Then we can just focus on these two places to custom our generators.

### Create our own generator

#### Project scaffold

For teamwork, we usually have our rules for project structure, or we use others' project scaffold. Then it's very easy to transform them to Yeoman generator scaffold. We can just find a project or copy the project scaffold to `generators/templates/`. But we need more work for Feflow.

For personally use or team without their own scaffold, the first mission should be planning your own scaffold. In our example, we will create a very simple and React supported project scaffold.

##### Create scaffold

The main structure of our scaffold is as below:

```sh
|- src # Demo source code.
    |- index.html # HTML entry
    |- index.js # JS entry, Webpack build entry
|- _babelrc # process JSX config
|- feflow.json # necessary
```

If we use files like `.babelrc`, we'd better transform `.` to `_` as `_babelrc`.

And, `feflow.json` is the neccessary configure file. Feflow will read the configuration and build source code in src directory.

Here we need to introduce the idea of **builder**. In fact it is a npm package about everything of building. The advantage of this is because when the project in a team has to update their building tools, they don't need to update for every project. All they need is to update the builder and the configration of `feflow.json`. Other advantages is about saving local space, saving time for installing dependencies for project, unify the project rules and so on.

Here is the `feflow.json` of our example:

```json
{
    // builderType is the name of builder
    "builderType": "builder-feflow-example",
    "builderOptions": {
        // You can add some options heare to custom building procedure. Such as if we need to uglify our html.
    }
}
```

> builder-feflow-example is only compatiable with the project generated in this handbook. Other generators need other builders. To know more about developing builders please read [Customed Builder](./advance-builder-custom.md).

##### Dynamic scaffold

If you want to add some dynamic content to your generator, such as asking users for project name to fill up ypur project. You can write thing like below in your `package.json`:

```json
{
  "name": "<%= name %>"
}
```

Yeoman scaffold support < %= *variable* > grammar to fill up dynamic content. And we can find out how to get *variable* in following part.

### Describe How to Generate project

With project scaffold, we still need code to describe how to create a project. The simplest logic is just copy a scaffold to current directory. Of course, advanced generator has these procedures:

1. Ask question for user's input.
1. Run some customed scripts.
1. Render the project scaffold according to user's input and scripts. And put them in current directory.

The logic above is all written in `generators/app/index.js`. Generally, the file support this format:

```js
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // 初始化阶段
    initializing () { /* code */ },
    // 接收用户输入阶段
    prompting () { /* code */ },
    // 保存配置信息和文件
    configuring () { /* code */ },
    // 执行自定义函数阶段
    default () { /* code */ },
    // 生成项目目录阶段
    writing () { /* code */ },
    // 统一处理冲突，如要生成的文件已经存在是否覆盖等处理
    conflicts () { /* code */ },
    // 安装依赖阶段
    install () { /* code */ },
    // 结束阶段
    end () { /* code */ }
}
```

Yeoman provide a basic class of `Generator`. We can extend our own generator based on it. `Generator` defines 8 life cycles. They will run as the sequence showed in code below.

[Read this](https://github.com/feflow/generator-feflow-example/blob/master/generators/app/index.js) for the generator example.

### Debug

Now your generator is ready. Let us have a try. Firstly we install it in Feflow main directory:

```sh
cd <your-path>/generator-startkit-demo
npm link
cd ~/.feflow
npm link generator-startkit-demo
```

Then we can edit `~/.feflow/package.json` (we can use `vi ~/.feflow/pakcage.json` to edit it). In `dependencies` we add `"generator-startkit-demo": "1.0.0"`(it can be any version). This is for help Feflow find your generator.

Now, you can run `feflow init` in any place you want to create your project. You will find that your generator is listed. Select it then we can generate our project.

> The source code of `generator-feflow-example` is here: https://github.com/feflow/generator-feflow-example

## Advanced Solution

The example above is designed as simple as possible. It can not support production environment. If you want to know about more advanced solution, we suggest you to visit our's solution:

* [generator-ivweb](https://github.com/feflow/generator-ivweb)
