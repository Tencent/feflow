# Plugin

At present, you may meet some of Feflow's commands, and now I will uncover their true face. They are all registered by Feflow's inner plugins.

Plugin is an important feature of Feflow. In fact, Feflow is a plugin management tool, each plugin can register multiple commands on Feflow, so Feflow can support many commands.

Now let's take a look at all of Feflow's inner plugins and the commands they registered.

## Package Management Plugin

The plugin contains two commands:

```sh
# 1. install package
feflow install <package-name>
# 2. uninstall package
feflow uninstall <package-name>
```

`feflow install <package-name>` can install NPM modules under `~/.feflow/node_modules`. We can use it to install scaffolds, builders and plugins.

`feflow uninstall <package-name>` is the opposite of the above command. It is used to uninstall NPM modules.

The plugin can install or uninstall any NPM module, so we call it package management plugin. With this plugin, it's easy to manage such as scaffold, builder, deployer, and plugin.

## Scaffold Dispatch Plugin

This plugin contains one command:

```sh
feflow init
```

The plugin allows the user to select one of the local installed scaffolds for project creation, so it calls scaffold dispatch plugin.

Each time the plugin is executed, it will automatically update all local scaffolds. If you want to skip the update, you can add a `--disableCheck` parameter.

```sh
feflow init --disableCheck
```

> Read [this](./advance-scaffold-custom.md) can get more informations about scaffold developement.

## Builder Dispatch Plugin

This plugin contains two commands:

```sh
# 1. Local development
feflow dev
# 2. Generate bundle file
feflow build
```

The plugin will get the value of the `builderType` field as builder's name from the `feflow.js` or `feflow.json` configuration file which is in the project root. If you haven't installed the builder via Feflow, the plugin will automatically install it for you, and it will tell the builder to run `dev` or `build` command to finish the build process.

Builder is independent, and the plugin will select builder for building via configuration, so we call it builder dispatch plugin. This method effectively helps project migrate to new building code.

> Read [this](./advance-scaffold-custom.md) can get more informations about builder developement.

## Deployer Dispatch Plugin.

This plugin contains one command:

```
feflow deploy
```

The plugin will get the value of the `deployerType` field as deployer's name from the `feflow.js` or `feflow.json` configuration file which is in the project root, then tell the builder to run `deploy` command to finish the deploy process.

## Global Config Plugin

Perhaps the plugin is used less, it is always used to set or get the configuration items in ~/.feflow/.feflowrc.yml file. This file can be used as a Feflow global configuration file. The inner plugin will use two configuration items in the file, one is `registry` and the other is `proxy`, which is used when Feflow or the plugin needs private repository or proxy to download the package. If you develop a plugin and want to give users some custom configuration, you can use the plugin to add these configurations, and then your plugin can get these configurations from the context by Feflow.

Global config plugin registers a `config` command and supports three subcommands: `set`, `get`, `list`. The usage is as follows:

```sh
# list all the config items.
feflow config list
# Get a config item.
feflow config get <key>
# Add or modify a config item.
feflow config set <key> <value>
```

## Code Lint Plugin

Feflow also has a code lint plugin, so it is easy for you to check the project's code with ESLint:

```sh
feflow lint [folder]
```

It supports the `--ignore` parameter, which allows you to ignore some directories or files when checking.

## Custom Plugin

In addition to inner plugins, Feflow alse supports developers to write their own plugins and register them, so you can get a special engineering tool. If you want to know more about how to develop a plugin, please read [custom plugin](./advance-plugins-custom.md) chapter.
