# Customed Plugin

Feflow is powerful because of its design of plugin system. You can regard it as a ecosystem with a core and a lot of plugins.

## Develop a Feflow plugin

**It is very easy to develop a Feflow plugin. Any program can become a Feflow plugin.**

Developing a Feflow plugin is the same as addition commands to Feflow. For example, you can add a `add` command to Feflow. Implement a add caculation for Feflow.

```sh
feflow add 1 2 3
# Output: 6
```

Next, let us use this example to explain how to develop a Feflow plugin.

## Create a project

Create a directory named `feflow-plugin-example`. And use `npm init` to initialize it.

**Attention. All the plugin projects should start with `feflow-plugin-`. And the `name` field in `package.json` should be the same as directory name**

## Write code

Create a `index.js` file. Implement addition caculation. Currently you don't need to think about things related Feflow plugin. You just need to finish your code.

```js
/**
 * Add caculation
 * @param  {Array} args Some numbers needed to be add
 * @return {number} Result of sum
 */
function add (args) {
    const sum = args.reduce((sum, item) => {
        return sum + item
    }, 0)

    console.log(sum)
    return sum
}
```

## Register the command

When the code is finished, now we need to make the program become a Feflow plugin. Which is register a `add` command to Feflow.

```js
feflow.cmd.register('add', 'Add caculator', function(args) {
    // args is the arguments after add which is resolved by minimist
    // For example, in `feflow add 1 2 3` args is { _: [1, 2, 3] }，
    // For another example, in `feflow add -x 1 -y 2 --z-value 3 4 5 6` args is { _: [ 4, 5, 6 ], x: 1, y: 2, 'z-value': 3 }
    // Call the main function
    add(args._);
});
```

You don't need to worry about `feflow` didn't decalre or require this module. When Feflow use this plugin, it will automatically inject `feflow` variable to the global context in **entry file**(which is decided by `main` field in `package.json`, in this example it is `index.js`).

`feflow.cmd.register` receives 3 arguments：

* The first one is the name of command added to Feflow.
* The second one is the description of command.（Which will show up in `feflow --help`）
* The third one is the excution funciton related to the new command.

When the function is called, Feflow will pass a `args`. This is a object includes all the arguments after the command when Feflow run this command. For example, when we run `feflow add 1 2 3`, args is `{ _: [1, 2, 3] }`.

## Debug the plugin

Now you have finished a plugin. The whole code can be found [here](https://github.com/feflow/feflow-plugin-example/tree/e21b0b5c5f5b860e78e5d914f4ce4ccf366eee8d). You might want to try it at once. No need to hurry. We will do it step by step.

1. Run `npm link` to link the plugin to global.
1. Run `cd ~/.feflow` to enter Feflow main directory.
1. Run `npm link feflow-plugin-example` to install the plugin into Feflow main directory.
1. Edit `~/.feflow/package.json` file（You can use `vi ~/.feflow/package.json` to edit it），Add `"feflow-plugin-example": "1.0.0"` to `dependencies` field.
1. Run `feflow add 1 2 3` to use the plugin。

## Publish the plugin

After finishing your plugin, the next thing is to publish the plugin. You can publish it to NPM or private NPM repository. If you want to publish it to private repository, you need to configure the `register` and `proxy` of Feflow. You can visit [Plugin](./base-plugins-inner) for more.

After publishing, you can use `feflow install` to install this plugin.

## Plugin context

Though your plugin can work now, there are still some details which can be optimized.

`feflow` as a global variable provide many other functions. These functions help you to combine you plugin with Feflow more perfectly. We regard this variable as context of plugin. It is accessable to any property in Feflow instance.

We still take `feflow-plugin-example` as an example. In `add` function, we use `console.log` to print result of calculation. If you want to make your plugin more graceful, you can try `feflow.log.info` to replace it. The plugin context provide API which obey the rule of Feflow console output rule. By this way plugin can provide the same user experience as Feflow.

```
const log = feflow.log;
log.info()    // Information log. Console show `Feflow INFO [content]`. `Feflow INFO` is in green color.
log.debug()   // Debug log. You need to add `--debug` to the command to show this log. Console show `Feflow DEBUG [content]`. `Feflow DEBUG` is in grey color.
log.warn()    // Warning log. Console show `Feflow WARN [content]`. `Feflow WARN` is in yellow background.
log.error()   // Error log. Console show `Feflow ERROR [content]`. `Feflow ERROR` is in red background.
log.fatal()   // Fatal log. Console show `Feflow FATAL [content]`. `Feflow FATAL` is in red background.
```

More method and properties can be found in [Plugin Context](./advance-plugins-context.md)

### Non-entry file use plugin context

In the example above, we can directly use plugin context in entry file `index.js`. However, if you try to directly use it in non-entry file, an error will show up. So you need to pass arguments to different modules.

For example, now we create a new file named `add.js`. And we move the `add` function from `index.js` to the new file. It will become the code below.

```js
// add.js
// The whole module recieve a plugin context argument
module.exports = function add (feflow) {
    // Original function
    return function (args) {
        const sum = args.reduce((sum, item) => {
            return sum + item
        }, 0)

        feflow.log.info(sum)
        return sum
    }
}

// index.js
// Pass plugin context through arguments
const add = require('./add')(feflow)
// Register the add command
feflow.cmd.register('add', 'Addition caculator', function(args) {
    add(args._);
});
```

You can visit the modulized code [here](https://github.com/feflow/feflow-plugin-example/tree/36127e14a6bc7ea0cd696a35f4b59255349d19bc)

## Register mutiple commands

A plugin can support mutiple commands. So we can make `feflow-plugin-example` more functional. We will make it support all four fundamental operations.

Finally, you can visit [here](https://github.com/feflow/feflow-plugin-example) to see our final plugin.
