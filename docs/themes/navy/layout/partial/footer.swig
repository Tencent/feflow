<footer id="footer" class="wrapper">
  <div class="inner">
    <div id="footer-copyright">
      &copy; {{ moment(Date.now()).year() }} <a href="https://github.com/feflow" target="_blank">{{ config.author }}</a><br>
      Documentation licensed under <a href="https://tldrlegal.com/license/mit-license" target="_blank">MIT</a>.
    </div>
    <div id="footer-links">
      <a class="footer-link">
        <i class="fa fa-wechat" id="wechat-trigger"></i>
        <span class="wechat-qrcode" id="wechat-qrcode">
          <img src="https://qpic.url.cn/feeds_pic/ajNVdqHZLLBJ9HDnzZNt8rBft0KhyZ9cczicFiaVVvSibzBKUUlbywBVg/" />
          <em class="wechat-qrcode-icon"></em>
        </span>
      </a>
      <a href="https://github.com/{{ config.github }}" class="footer-link" target="_blank"><i class="fa fa-github-alt"></i></a>
    </div>
  </div>
</footer>
