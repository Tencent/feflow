(function encologies() {
  'use strict';
  /* eslint-disable no-var, max-nested-callbacks, max-len */
  var pageWrapper = document.getElementById('encologies-detail');
  if (!pageWrapper) {
    return;
  }

  var accessToken = 'acef7b6f616795ea99bc7ffc7156117db4b84ecd';

  window.addEventListener('DOMContentLoaded', function() {
    var encologiesDetail = document.querySelector('.encologies-detail');
    var urlParams = new URLSearchParams(window.location.search);
    var registry = decodeURIComponent(urlParams.get('registry'));
    var type = urlParams.get('type');
    var markdown = new window.markdownit(); // eslint-disable-line new-cap

    // 请求数据并渲染
    var request;
    // 内部生态走 tnpm
    if (type === 'inner') {
      request = window.axios.get('http://r.tnpm.oa.com/' + registry + '/latest')
        .then(function(response) {
          var body = response.data;
          var name = body.name && body.name.split('/').pop();
          var description = body.description;
          var master = body.author && body.author.name;
          var updateTime = new Date(body._cnpm_publish_time).toLocaleDateString();
          var github = body.repository && body.repository.url && body.repository.url.replace('git@git.code.oa.com:', 'https://git.code.oa.com/');
          var readmeHTML = markdown.render(body.readme);

          return {
            name: name,
            description: description,
            master: master,
            lastestVersion: body.version,
            agreement: body.license,
            updateTime: updateTime,
            github: github,
            readmeHTML: readmeHTML
          };
        });
    } else {
      var readmeRequest = window.axios.get('https://raw.githubusercontent.com/' + registry + '/master/README.md')
        .then(function(response) {
          return response;
        }, function() {
          return window.axios.get('https://raw.githubusercontent.com/' + registry + '/master/readme.md');
        });
      // 外部生态走 github
      request = Promise.all([
        window.axios.get('https://api.github.com/repos/' + registry + '?access_token=' + accessToken),
        // package.json 获取版本号
        window.axios.get('https://raw.githubusercontent.com/' + registry + '/master/package.json'),
        // readme
        readmeRequest
      ]).then(function(responses) {
        var repoData = responses[0];
        var packageData = responses[1];
        var readmeData = responses[2];
        var body = repoData.data;
        var name = body.name;
        var description = body.description;
        var owner = body.owner || {};
        var master = owner.login || '';
        var updateTime = new Date(body.updated_at).toLocaleDateString();
        var readmeHTML = markdown.render(readmeData.data);
        var lastestVersion = packageData && packageData.data && packageData.data.version;
        var agreement = packageData && packageData.data && packageData.data.license;

        console.log(packageData, readmeData);

        return {
          registry: encodeURIComponent(registry),
          type: type,
          name: name,
          description: description,
          master: master,
          agreement: agreement,
          lastestVersion: lastestVersion,
          updateTime: updateTime,
          github: body.html_url,
          readmeHTML: readmeHTML
        };
      });
    }

    return request.then(function(data) {
      var html
                = '<div class="encologies-detail__contents">'
                    + '<div class="encologies-detail__contents-intro encologies-detail__line">'
                        + '<p class="encologies-detail__contents-name">' + data.name + '</p>'
                        + '<p class="encologies-detail__contents-description">' + data.description + '</p>'
                    + '</div>'
                    + '<div class="encologies-detail__contents-bases encologies-detail__line">'
                        + '<h2 class="encologies-detail__header">基本信息</h2>'
                        + '<table>'
                            + '<tbody>'
                                + '<tr class="encologies-detail__contents-item">'
                                    + '<td class="encologies-detail__contents-tip">最新版本</td>'
                                    + '<td>' + data.lastestVersion + '</td>'
                                + '</tr>'
                                + '<tr class="encologies-detail__contents-item">'
                                    + '<td class="encologies-detail__contents-tip">维护者</td>'
                                    + '<td>' + data.master + '</td>'
                                + '</tr>'
                                + '<tr class="encologies-detail__contents-item">'
                                    + '<td class="encologies-detail__contents-tip">更新时间</td>'
                                    + '<td>' + data.updateTime + '</td>'
                                + '</tr>'
                                + '<tr class="encologies-detail__contents-item">'
                                    + '<td class="encologies-detail__contents-tip encologies-detail__contents-github">'
                                        + 'Github'
                                        + '<i></i>'
                                        + (data.agreement ? '<span>· ' + data.agreement + '</span>' : '')
                                        + '<a href="' + data.github + '"></a>'
                                    + '</td>'
                                + '</tr>'
                            + '</tbody>'
                        + '</table>'
                    + '</div>'
                    + '<div class="encologies-detail__contents-uses">'
                        + '<div class="article-content">'
                            + '' + data.readmeHTML + ''
                        + '</div>'
                    + '</div>'
                + '</div>`'
            ;

      encologiesDetail.innerHTML = html;
    });
  });
}());
