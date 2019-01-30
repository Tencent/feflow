(function encologies() {
  'use strict';
  /* eslint-disable no-var, max-nested-callbacks, max-len */
  var pageWrapper = document.getElementById('encologies');
  if (!pageWrapper) {
    return;
  }

  var accessToken = 'acef7b6f616795ea99bc7ffc7156117db4b84ecd';
  var tags = ['all', 'generator', 'builder', 'plugin'];
  var tagMap = {
    '全部': 'all',
    '脚手架': 'generator',
    '构建器': 'builder',
    '插件': 'plugin'
  };
  var chunk = function(array, number) {
    return Array.isArray(array)
      ? array.reduce((list, item) => {
        var length = list.length;
        var lastItem = list[length - 1];

        if (Array.isArray(lastItem) && lastItem.length < number) {
          lastItem.push(item);
        } else {
          list.push([item]);
        }

        return list;
      }, [])
      : [];
  };

    // 根据名称获取标签
  var getTag = function(name) {
    if (/generator/.test(name)) {
      return 'generator';
    } else if (/builder/.test(name)) {
      return 'builder';
    }
    return 'plugin';

  };

    // 随机获取颜色
  var getColor = function() {
    var colors = ['#337bff', '#20bdff', '#7dedda', '#2197ff'];
    var colorIndex = Math.floor(colors.length * Math.random());
    var color = colors[colorIndex];

    return color;
  };

  var encologiesTags = document.querySelector('.encologies-tags');
  var encologiesTagItems = Array.from(document.querySelectorAll('.encologies-tags__item'));
  // var encologiesContentsWrap = document.querySelector('.encologies-contents');
  // var encologiesContents = Array.from(document.querySelectorAll('.encologies-contents__item'));
  var contentWrapper = document.getElementById('content');

  var bindTagEvent = function(htmlsMapTags) {
    encologiesTags.addEventListener('click', function(event) {
      var target = event.target || {};
      if (target.nodeName.toLocaleLowerCase() !== 'li') {
        return;
      }

      // 标签着色
      encologiesTagItems.forEach(function(item) {
        item.className = 'encologies-tags__item';
      });
      target.className = 'encologies-tags__item encologies-tags__item--active';

      // 内容过滤
      var text = target.innerText;
      var tag = tagMap[text];
      var tagIndex = tags.indexOf(tag);

      if (tagIndex > -1) {
        var html = htmlsMapTags[tagIndex];
        contentWrapper.innerHTML = html;
      }
    });
  };

  window.addEventListener('DOMContentLoaded', function() {
    // 请求数据并渲染
    var requests = window.encologyList.map(function(encologyInfo) {
      var request;
      var type = encologyInfo.type;
      var registry = encologyInfo.registry;
      // 内部生态走 tnpm
      if (type === 'inner') {
        request = window.axios.get('http://r.tnpm.oa.com/' + registry + '/latest')
          .then(function(response) {
            var body = response.data;
            var name = body.name && body.name.split('/').pop();
            var description = body.description;
            var master = body.author && body.author.name;
            var tag = getTag(name);
            var color = getColor();
            var firstLetter = name[0].toLocaleUpperCase();

            return {
              registry: encodeURIComponent(registry),
              type: type,
              name: name,
              tag: tag,
              description: description,
              master: master,
              color: color,
              firstLetter: firstLetter
            };
          });
      } else {
        // 外部生态走 github
        request = window.axios.get('https://api.github.com/repos/' + registry + '?access_token=' + accessToken)
          .then(function(response) {
            var body = response.data;
            var name = body.name;
            var description = body.description;
            var owner = body.owner || {};
            var master = owner.login || '';
            var tag = getTag(name);
            var color = getColor();
            var firstLetter = name[0].toLocaleUpperCase();

            return {
              registry: encodeURIComponent(registry),
              type: type,
              name: name,
              tag: tag,
              description: description,
              master: master,
              color: color,
              firstLetter: firstLetter
            };
          });
      }
      return request;
    });

    Promise.all(requests).then(function(responses) {
      // 标签对应的内容
      var contentsMapTags = [[], [], [], []];
      responses.forEach(function(response) {
        var index = tags.indexOf(response.tag);
        if (index > -1) {
          contentsMapTags[index].push(response);
        }
        contentsMapTags[0].push(response);
      });

      // 将内容变成 HTML
      var htmlsMapTags = ['', '', '', ''];
      contentsMapTags.forEach(function(contents, index) {
        var chunks = chunk(contents, 3);
        var html = '';
        chunks.forEach(function(list) {
          var rowHTML = '';
          list.forEach(function(item) {
            rowHTML = rowHTML
                            + '<div class="encologies-contents__item" data-tag="' + item.tag + '">'
                                + '<div class="encologies-contents__item-title">'
                                    + '<div'
                                        + ' class="encologies-contents__item-logo"'
                                        + ' style="background-color: ' + item.color + ';"'
                                    + '>' + item.firstLetter + '</div>'
                                    + '<div class="encologies-contents__item-info">'
                                        + '<p class="encologies-contents__item-name">' + item.name + '</p>'
                                    + '</div>'
                                + '</div>'
                                + '<p class="encologies-contents__item-description">' + item.description + '</p>'
                                + '<p class="encologies-contents__item-master">' + item.master + '</p>'
                                + '<a class="encologies-contents__item-link" href="detail.html?registry=' + item.registry + '&type=' + item.type + '"></a>'
                            + '</div>';
          });
          // 包裹 li 标签
          rowHTML = '<li class="encologies-contents__group">' + rowHTML + '</li>';
          html = html + rowHTML;
        });
        html = '<ul class="encologies-contents">' + html + '</ul>';

        htmlsMapTags[index] = html;
        html = '';
      });

      // 默认渲染全部
      contentWrapper.innerHTML = htmlsMapTags[0];
      encologiesTagItems[0].className = 'encologies-tags__item encologies-tags__item--active';

      bindTagEvent(htmlsMapTags);
    });
  });
}());
