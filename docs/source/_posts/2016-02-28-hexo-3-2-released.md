title: Hexo 3.2 Released
---
It has been a long time that Hexo is poor at handling large website. ([#710], [#1124], [#283], [#1187], [#550], [#1769], etc.) We tried hard to solve this problem and there're several improvements in Hexo 3.2.

## It's all about speed

### Caching rendered contents

Rendered contents are cached in the warehouse. This saves a lot of time and made hot processing (2nd-time processing) **1.7x faster**.

Version | 3.1 | 3.2
--- | --- | ---
Cold processing | 6.094s | 6.454s
Hot processing | 5.154s | 3.002s

### Lazy load language files of highlight.js

[highlight.js is slow][#1036]. Especially when it try to detect the language. Lazy load language files make processing faster and don't have to load bunch of unused language files. However there're some limitations:

- Auto detect must be disabled.
- You have to specify language in code block.

You can set auto detect disabled in `_config.yml`.

``` yaml
highlight:
  auto_detect: false
```

### Templates precompilation

Theme templates are precompiled if possible. It makes generation speed **2x faster**.

Version | 3.1 | 3.2
--- | --- | ---
Cold generation | 27.2s | 13.6s
Hot generation | 24.4s | 12.6s

The following renderers have already supported this feature.

- [hexo-renderer-ejs]
- [hexo-renderer-jade]
- [hexo-renderer-swig]

And it's easy to implement precompilation for renderers. Just add a `compile` function to the renderer. Take EJS renderer for example:

``` js
var ejs = require('ejs');
var assign = require('object-assign');

function ejsRenderer(data, locals) {
  return ejs.render(data.text, assign({filename: data.path}, locals));
}

ejsRenderer.compile = function(data) {
  return ejs.compile(data.text, {
    filename: data.path
  });
};

module.exports = ejsRenderer;
```

## Include/exclude source files

You can include/exclude specified source files in `_config.yml`.

``` yaml
include:
  - .htaccess

exclude:
  - tmp/**/*
```

More info: [changelog], [benchmark results].

[#710]: https://github.com/hexojs/hexo/issues/710
[#1124]: https://github.com/hexojs/hexo/issues/1124
[#283]: https://github.com/hexojs/hexo/issues/283
[#1187]: https://github.com/hexojs/hexo/issues/1187
[#550]: https://github.com/hexojs/hexo/issues/550
[#1769]: https://github.com/hexojs/hexo/issues/1769
[#1036]: https://github.com/hexojs/hexo/issues/1036
[hexo-renderer-ejs]: https://github.com/hexojs/hexo-renderer-ejs
[hexo-renderer-jade]: https://github.com/hexojs/hexo-renderer-jade
[hexo-renderer-swig]: https://github.com/hexojs/hexo-renderer-swig
[changelog]: https://github.com/hexojs/hexo/releases
[benchmark results]: https://docs.google.com/spreadsheets/d/1nLW3fPCtrkfMolz8UnUiKq5lqys6bIcZqrfksuvQHA0/edit?usp=sharing