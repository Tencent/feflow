title: Hexo 2.7 Released
---
Hexo 2.7 has been released with three new features. I'm going to introduce them below.

## Fragment Caching

Although Hexo is fast, it may become slow if you have thousands of source files or complicated categories or tags. Before the data model upgraded, I borrowed a feature from Ruby on Rails: **Fragment Caching**.

Fragment Caching saves contents within a fragment and serves the cache when the next request come in. A fragment will only be processed once. It can reduce database queries and decrease generation time significantly. For instance, a Hexo site with 300+ source files needs 6 minutes to generate. In Hexo 2.7, it only need 10 seconds!

It can be used in header, footer, sidebar or static contents that won't be changed during generating. For example:

``` js
<%- fragment_cache('header', function(){
  return '<header></header>';
}); %>
```

By using `fragment_cache` helper, contents in the function will be cached.

Partial helper also supports Fragment Caching, you only need to add a `{cache: true}` option when using partial.

``` js
<%- partial('header', {}, {cache: true}) %>
```

[Landscape] is updated and supports Fragment Caching now. You can check [this commit](https://github.com/hexojs/hexo-theme-landscape/commit/d2aedda61571d6994eb72d784ceda2f59d2a8631) to see what's changed.

## Relative Link

Relative Link is supported since Hexo 2.7. But your theme needs some modifications to support it. However, it's not as hard as you think. You just need to replace the following contents in templates

``` js
<%- config.root %><%- path %>
```

with `url_for` helper.

``` js
<%- url_for(path) %>
```

`url_for` helper will add `config.root` automatically for you. If you enable `relative_link` setting, it'll add a relative path.

[Landscape] is updated for Relative Link. You can check [this commit](https://github.com/hexojs/hexo-theme-landscape/commit/d29cbb83356373af27e7b98643f29a27804364af) to see what's changed.

## Server Middleware

Server Middleware would be familiar if you have ever used [Connect] or [Express] before. [Connect] passes a request through functions called **middleware**. You can make response to the coming in request in middleware.

In Hexo, middleware is served as a type of filter. You can add middleware by registering a new filter. For example:

``` js
hexo.extend.filter.register('server_middleware', function(app){
  app.use(function(req, res, next){
    res.setHeader('X-Powered-By', 'Hexo');
    next();
  });
});
```

This middleware add a header `X-Powered-By` and passes the request to the next middleware.

[Landscape]: https://github.com/hexojs/hexo-theme-landscape
[Connect]: http://www.senchalabs.org/connect/
[Express]: http://expressjs.com/