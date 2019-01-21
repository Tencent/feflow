(function() {
    'use strict';
  
    var wechatTrigger = document.getElementById('wechat-trigger');
    var wechatQrcode = document.getElementById('wechat-qrcode');
    var CLASS_NAME = 'qr-on';
  
    wechatTrigger.addEventListener('mouseover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        wechatQrcode.classList.add(CLASS_NAME);
    });

    wechatTrigger.addEventListener('mouseout', function(e) {
        e.preventDefault();
        e.stopPropagation();
        wechatQrcode.classList.remove(CLASS_NAME);
    });
  }());  