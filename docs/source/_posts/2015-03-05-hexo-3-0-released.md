title: Hexo 3.0 Released
---
Hexo 3.0 has finally come out! After four beta and four RC versions, Hexo 3 become more stable and more powerful. Thanks for the contributors and testers! 

## What's Changed?

There're many improvements in Hexo 3. Better performance, API is easier to use, higher coverage, etc. Here're some notable changes:

- **[New CLI](https://github.com/hexojs/hexo/wiki/Breaking-Changes-in-Hexo-3.0#new-cli)**: Command line interface is separated into a stand-alone module: [hexo-cli]
- **[Slimmer Core Module](https://github.com/hexojs/hexo/wiki/Breaking-Changes-in-Hexo-3.0#slimmer-core-module)**: Generators, deployers and server are also separated from the main module.
- **[New Generator API](https://github.com/hexojs/hexo/wiki/Breaking-Changes-in-Hexo-3.0#new-generator-api)**: Generator API changed a lot in Hexo 3.
- **[Include Assets in a Post](https://github.com/hexojs/hexo/wiki/Breaking-Changes-in-Hexo-3.0#render-pipeline-changed)**: Serveral useful tag plugins are added in Hexo 3: `post_path`, `post_link`, `asset_path`, `asset_link`, `asset_img`.
- **[Async Tag Plugins](https://github.com/hexojs/hexo/wiki/Breaking-Changes-in-Hexo-3.0#async-tag-plugins)**: Tag plugins can do async jobs now!
- **[Timezone Support](https://github.com/hexojs/hexo/wiki/Breaking-Changes-in-Hexo-3.0#timezone-support)**: You can define the timezone of your site now.

More info: [Breaking Changes in Hexo 3.0], [changelog]

## How to Update?

1. Modify `package.json`.

    {% code %}
    {
      "hexo": {
        "version": ""
      }
    }
    {% endcode %}
    
2. Install [hexo-cli]. If any error occurred, try to remove hexo first.

    {% code %}
    $ npm install hexo-cli -g
    {% endcode %}
    
3. Install Hexo.

    {% code %}
    $ npm install hexo --save
    {% endcode %}
    
4. Install plugins. You don't have to install all the following plugins. It depends on your need.

    {% code %}
    $ npm install hexo-server --save
    $ npm install hexo-generator-index --save
    $ npm install hexo-generator-archive --save
    $ npm install hexo-generator-category --save
    $ npm install hexo-generator-tag --save
    $ npm install hexo-deployer-git --save
    $ npm install hexo-deployer-heroku --save
    $ npm install hexo-deployer-rsync --save
    $ npm install hexo-deployer-openshift --save
    {% endcode %}
    
5. Update plugins. Especially generators and filters. Since the API has breaking changes in Hexo 3.

More info: [Migration from 2.x to 3.0]

[Migration from 2.x to 3.0]: https://github.com/hexojs/hexo/wiki/Migrating-from-2.x-to-3.0
[hexo-cli]: https://github.com/hexojs/hexo-cli
[Breaking Changes in Hexo 3.0]: https://github.com/hexojs/hexo/wiki/Breaking-Changes-in-Hexo-3.0
[changelog]: https://github.com/hexojs/hexo/releases