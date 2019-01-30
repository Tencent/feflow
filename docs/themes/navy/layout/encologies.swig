<script>
    window.encologyList = {{ encologyList() }};
</script>

<main class="encologies" id="encologies">
    <section class="encologies-inner wrapper">

        <ul class="encologies-tags">
            {% for tag in ['全部', '脚手架', '构建器', '插件'] %}
            <li class="encologies-tags__item">{{ tag }}</li>
            {% endfor %}
        </ul>

        <div id="content">
            <!-- JS 渲染的内容 -->
        </div>
    </section>
</main>