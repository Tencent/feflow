<main class="encologies">
    <section class="encologies-inner wrapper">

        <ul class="encologies-tags">
            {% for tag in encologiesTags() %}
            <li class="encologies-tags__item">{{ tag }}</li>
            {% endfor %}
        </ul>

        <ul class="encologies-contents">

            {% for encology in encologies() %}
            <li class="encologies-contents__item" data-tag="{{ encology.tag }}">
                <div class="encologies-contents__item-title">
                    {% if encology.logo %}
                        <div
                            class="encologies-contents__item-logo"
                            style="background-image: url({{ encology.logo }});"
                        ></div>
                    {% else %}
                        <div
                            class="encologies-contents__item-logo"
                            style="background-color: {{ encology.color }};"
                        >{{ encology.firstLetter }}</div>
                    {% endif %}
                    <div class="encologies-contents__item-info">
                        <p class="encologies-contents__item-name">{{ encology.name }}</p>
                        <p class="encologies-contents__item-overview">{{ encology.overview }}</p>
                    </div>
                </div>
                <p class="encologies-contents__item-description">{{ encology.description }}</p>
                <p class="encologies-contents__item-master">{{ encology.master }}</p>
                <a class="encologies-contents__item-link" href="{{ encology.id }}.html"></a>
            </li>
            {% endfor %}

        </ul>

    </section>
</main>