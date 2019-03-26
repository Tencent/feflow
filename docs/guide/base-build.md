# Build And Bundle

After developing the project, you may want to deploy it to the production environment. First, you should build the project into a version that the browser can run. Running `felfow build` can do it. It will generate a directory in the project root directory.  Different scaffolding or different builders will generate different directories and contents.

In our tutorial, you can see a directory named `dist` after running `feflow build`. The directory structure is below:

```sh
|- cdn
    |- <bizName> # The directory name is determined by the field `bizName` in feflow.json, it contains JS, CSS, images and other assets.
        |- img # image assets.
|- offline
    |- offline.zip # offline package.
|- webserver
    |- <bizName> # The directory name is determined by the field `bizName` in feflow.json, it contains page entry.
        |- index.html # home page entry.
```

Now you can deploy these files on the server.
