<main class="encologies">
    <section class="encologies-detail encologies-inner wrapper">
        <ul class="encologies-detail__screenshots">
            <h2 class="encologies-detail__header">截图展示</h2>
            <li class="encologies-detail__screenshots-item">
                <img
                    class="encologies-detail__screenshots-image"
                    src="{{ page.screenshot }}"
                    alt="截图"
                >
            </li>
        </ul>
        <div class="encologies-detail__contents">
            <div class="encologies-detail__contents-intro encologies-detail__line">
                <p class="encologies-detail__contents-name">{{ page.name }}</p>
                <p class="encologies-detail__contents-overview">{{ page.overview }}</p>
                <p class="encologies-detail__contents-description">{{ page.description }}</p>
            </div>
            <div class="encologies-detail__contents-bases encologies-detail__line">
                <h2 class="encologies-detail__header">基本信息</h2>
                <table>
                    <tbody>
                        <tr class="encologies-detail__contents-item">
                            <td class="encologies-detail__contents-tip">最新版本</td>
                            <td>{{ page.lastestVersion }}</td>
                        </tr>
                        <tr class="encologies-detail__contents-item">
                            <td class="encologies-detail__contents-tip">维护者</td>
                            <td>{{ page.master }}</td>
                        </tr>
                        <tr class="encologies-detail__contents-item">
                            <td class="encologies-detail__contents-tip">更新时间</td>
                            <td>{{ page.updateTime }}</td>
                        </tr>
                        <tr class="encologies-detail__contents-item">
                            <td class="encologies-detail__contents-tip encologies-detail__contents-github">
                                Github
                                <i></i>
                                <span>· {{ page.agreement }}</span>
                                <a href="{{ page.github }}"></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="encologies-detail__contents-uses">
                <h2 class="encologies-detail__header">如何使用</h2>
                <div class="article-content">
                    {{ page_anchor(page.content) }}
                </div>
            </div>
        </div>
    </section>
</main>