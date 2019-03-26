# Start Development

After creating project, run `npm i` in the project to install dependencies. And run `feflow dev` to start local server. The service's location is http://127.0.0.1:8001.

Open http://127.0.0.1:8001, you can see a pure page. If you want to change the page, you should know the folder tree.

The project's directory structure is determined by the scaffolding of your choice. Take the scaffolding used in this tutorial as an example. The main structure of the generated project is as follows:

```sh
|- src
    |- assets # common JS、CSS、Images directory
    |- middleware # common Redux middleware directory
    |- modules # common module directory
    |- pages # pages directory
        |- index # home page
            |- actions # common actions directory in home page
            |- components # common components directory in home page
            |- reducers # common reducers directory in home page
            |- index.html # home page html
            |- index.js # home page Class
            |- index.less # pageComponent.js element style, or global style
            |- init.js # JS entry
            |- pageComponent.js # React root component
    |- reducers # common reducers directory
|- feflow.json # Feflow config file
```


Actually, `src/pages/index/index.html` is the page displayed by `http://127.0.0.1:8001`. You can modify the `src/pages/index/pageComponent.js` file to change the page.


