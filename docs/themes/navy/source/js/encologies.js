(function encologies() {
    'use strict';

    /* eslint-disable no-var */
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
            var outerHTML = filterContents.reduce(function (result, content) {
                return result + content.outerHTML;
            }, '');

            encologiesContentsWrap.innerHTML = outerHTML;
        });
    }
})();