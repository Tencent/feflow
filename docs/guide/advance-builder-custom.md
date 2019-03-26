# Customed Builder

It's easy to develop a builder. If you already have code for building in your project, it's very easy to extract it to a builder. In this article we will use a simple webpack builder as an example to introdcuce how to develop our own builder. Of course, Feflow does not limit your tech stack. You can use `Rollup`, `Parcel` or any thing you like.

> The example builder in this article is the same as the builder in [Customed Generator](./advance-scaffold-custom.md). You can read both for more details.

## Create a builder project

Create a new directory named `builder-feflow-example`. Then use `npm init` to initialize a NPM package.

**Attention: `name` field should be keep same as the directory name. The value of `main` field should be the entry file which Feflow excute. In this example it's `lib/index.js`**

> It's recommanded to name your builder with begginning of `builder-`. Though Feflow doesn't limit the name of builder, Feflow will find dependency package beginning with `builder-` to update when it update local builders.

## Edit entry file

Create or open the entry file of project you just create. In this example it is `lib/indexl.js`. Then you need to export a function recieves arguments:

```js
/**
 * The function exported to feflow
 * @param {string} cmd The command entered when user uses feflow to build. For example, feflow dev or feflow build
 * @param {string} ctx feflow context, the same as the plugin context
 */
module.exports = (cmd, ctx) => {
  if (cmd === "dev") {
    /* Local development */
  } else if (cmd === "build") {
    /* Production build */
  }
};
```

Feflow internal builder plugin will call `lib/index.js` and pass 2 arguments to the builder. The meaning of arguments is explained above. Currently it support two commands, which is `feflow dev` and `feflow build`. The first one if for local development. The second one is for production environment.

## Write building procedure

The building procedure of `builder-feflow-example` is pretty simple. You can visit [builder-feflow-example](https://github.com/feflow/builder-feflow-example) for more information.

Because the builders are seperated with projects. So it is important to focus on the points below:

1. Entry file and HTML file is in the project directory. So make sure that the path configured in Webpack is correct.
1. If your projects share the Loader of builders. Make sure that the `reasolveLoader.modules` includes the `node_modules` in builder directory. Otherwise Webpack will only search loaders in project directory.
1. Other issues related to the path must also pay attention.

## Advanced solution

The example above is only for readers to understand easily and it lack of a lot of abilities neccessary for development. If you want to find a advanced solution of React + Webpack, please visit

* [builder-webpack4](https://github.com/feflow/builder-webpack4)


