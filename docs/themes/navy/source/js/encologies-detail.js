(function encologiesDetail() {
    'use strict';

    /* eslint-disable no-var, no-undef */
    console.log('encologies', encologies);
    var id = location.search.match(/id=[^&]*/)[0].split('=')[1];
    var encology = encologies.filter(item => item.id == id)[0];
})();