<header id="header" class="header">
  <div class="wrapper">
    <div id="header-inner" class="inner">
      <h1 id="logo-wrap">
        <a href="{{ url_for_lang('') }}" id="logo">Feflow</a>
      </h1>
      <nav id="main-nav">
        {{ header_menu('main-nav') }}
        <a href="https://github.com/feflow/feflow/releases" target="_blank" class="main-nav-link">发布日志</a>
        <iframe src="https://ghbtns.com/github-btn.html?user=feflow&repo=feflow&type=star&count=true" frameborder="0" scrolling="0" width="150px" height="20px"></iframe>
        <div id="search-input-wrap">
          <div id="search-input-icon">
            <i class="fa fa-search"></i>
          </div>
          <input type="search" id="search-input" placeholder="Search...">
        </div>
      </nav>
      <div id="lang-select-wrap">
        <label id="lang-select-label"><i class="fa fa-globe"></i><span>{{ lang_name(page.lang) }}</span></label>
        <select id="lang-select" data-canonical="{{ canonical_path_for_nav() }}">
          {% for lang in site.data.languages %}
            <option value="{{ loop.key }}"{% if page.lang === loop.key %} selected{% endif %}>{{ lang_name(loop.key) }}</option>
          {% endfor %}
        </select>
      </div>
      <a id="mobile-nav-toggle">
        <span class="mobile-nav-toggle-bar"></span>
        <span class="mobile-nav-toggle-bar"></span>
        <span class="mobile-nav-toggle-bar"></span>
      </a>
    </div>
  </div>
</header>
