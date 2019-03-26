# Plugin context API

No matter developing generators, builders or plugins, Feflow will use a parameter or inject a global variable to provide a Feflow instance for users to develop. This instance is also called plugin context. In this section we will list all the API of plugin context.

## Feflow context API

### feflow.version

return the version of Feflow which is a string.

### feflow.baseDir

return the base directory of Feflow which is a string.

### feflow.rcPath

return the path of configuration file `.feflowrc.yml` which is a string.

### feflow.pkgPath

return the path of `package.json` of feflow, which is a string.

### feflow.pluginDir

return the installing path of plugins, builders and generator of Feflow.

### feflow.logDir

return the path of log which is a string.

### feflow.config

return the global configuration of Feflow which is `.feflowrc.yml`. It will return an object.

### feflow.args

return the arguments resolved by feflow command. For example, `feflow init` will return `{ "": ["init"] }`. This is an object.

## Feflow log API

The utility functions provided by Feflow are stored in `feflow.log`. It includes the properties and methods listed below:

### feflow.log.info

The method of logging info. It's a function.

### feflow.log.debug

The method of logging debug details. It's a function.

### feflow.log.warn

The method of logging warnning. It's a function.

### feflow.log.error

The method of logging errors. It's a function.

### feflow.log.fatal

The method of logging fatals. It's a function.

### feflow.log.i

Alias of `feflow.log.info`.

### feflow.log.d

Alias of `feflow.log.debug`.

### feflow.log.w

Alias of `feflow.log.warn`.

### feflow.log.e

Alias of `feflow.log.error`.

## Feflow util API

The utility function provided by feflow is stored in `feflow.utils`. It includes the methods below:

### feflow.utils.chalk

Alias of NPM module `chalk`. It's convenient for console to log styles of charactors. It's an object.

### feflow.utils.Loading(name, color)

The constructor for console to show loading progress. It's a function. You need `new feflow.utils.Loading(name, color)` to generate a instance `loading`. Then call `loading.success(message)` or `loading.fail(message)` to show if the result is successful.

## Feflow command API

All command API are stored in `feflow.cmd`. It includes the properties and methods listed below:

#### feflow.cmd.alias

Return all the commands and alias of them in Feflow. It's an object.

#### feflow.cmd.list()

Return all the commands and the responding functions. It's an object.

#### feflow.cmd.get(name)

Return the specific function of a command. It's a function.

#### feflow.cmd.register(name, desc, options, fn)

Register a command. It's a function.
