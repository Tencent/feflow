(function encologies() {
    'use strict';

    /* eslint-disable no-var */
    var chunk = function (array, number) {
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

    var encologiesTags = document.querySelector('.encologies-tags');
    var encologiesTagItems = Array.from(document.querySelectorAll('.encologies-tags__item'));
    var encologiesContentsWrap = document.querySelector('.encologies-contents');
    var encologiesContents = Array.from(document.querySelectorAll('.encologies-contents__item'));

    if (encologiesTags) {
        encologiesTags.addEventListener('click', function (event) {
            var target = event.target || {};
            if (target.nodeName.toLocaleLowerCase() !== 'li') {
                return;
            }

            // 标签着色
            encologiesTagItems.forEach(function (item) {
                item.className = 'encologies-tags__item';
            });
            target.className = 'encologies-tags__item encologies-tags__item--active';

            // 内容过滤
            var text = target.innerText;
            var filterContents = encologiesContents.filter(function (content) {
                const { tag = '' } = content.dataset;
                return tag === text;
            });
            // 分组
            var filterGroups = chunk(filterContents, 3);
            var outerHTML = filterGroups.reduce(function (result, contents) {
                const content = contents.reduce(function (contentsResult, content) {
                    return contentsResult + content.outerHTML;
                }, '');
                return result + '<li class="encologies-contents__group">' + content + '</li>';
            }, '');

            encologiesContentsWrap.innerHTML = outerHTML;
        });
    }
})();