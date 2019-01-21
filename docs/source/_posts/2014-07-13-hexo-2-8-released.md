title: Hexo 2.8 Released
---
Hexo 2.8 was rewritten, brings you better performance and many improvements. The following is the highlights in this version. You can check [detail](https://github.com/hexojs/hexo/releases/tag/2.8.0) on GitHub.

## Faster Processing Speed

Before Hexo 2.8, all source files have to be processed each time you use Hexo. In Hexo 2.8, the entire database will be saved to `db.json` so Hexo don't have to process all files again. Also, a new data type "**skip**" was added for processors to detect whether a file was changed or not.

Generating was also changed in Hexo 2.8. You can check the elapsed time of each file in console now. However, I found multi-process generating didn't affect generating speed a lot. Thus, `multi_thread` and `max_open_file` setting are deprecated in Hexo 2.8.

{% asset_img generate-console.png %}

## Draft Publish

You don't have to enter full file name to publish a post anymore. Draft publish system is rewritten in Hexo 2.8. `new_post_name` setting will be applied until drafts are published. Besides, you can choose which layout to apply when publishing.

``` bash
$ hexo publish [layout] <filename>
```

A new API `post.publish` was added to help you publish drafts more easily.

``` js
hexo.post.publish({slug: 'hello-world', layout: 'post'}, function(err, target){
  // ...
});
```

## Permalink

File name and permalink now share a more universal variable system. Every variables in file name can also be read in permalink. Here's a config for example:

``` yaml
permalink: :type/:title/
new_post_name: :type/:title.md
```

When you create a post, the post will be saved to `source/_posts/test/Hello-World.md` and the URL will be `http://localhost:4000/test/Hello-World/`.

``` bash
$ hexo new "Hello World" --type test
```

## Multi-language Support

With the new permalink introduced in the previous section, it's much easier to create a multi-language site. For example:

``` yaml
permalink: :lang/:title/
new_post_name: :lang/:title.md
```

Then you can create a post with `--lang` option:

``` bash
$ hexo new "Hello World" --lang en
# => This post will be saved to source/_posts/en/Hello-World.md
# => URL: http://localhost:4000/en/Hello-World/

$ hexo new "你好世界" --lang tw
# => This post will be saved to source/_posts/tw/你好世界.md
# => URL: http://localhost:4000/tw/你好世界/
```

You can define the default value of permalink variables in `permalink_defaults` setting. For example, we define the defualt language as English.

``` yaml
permalink_defaults:
  lang: en
```