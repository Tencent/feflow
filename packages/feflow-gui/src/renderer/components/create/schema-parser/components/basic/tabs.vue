<template>
  <div>
    <ul class="nav nav-tabs">
      <li
        v-for="(item, idx) in definition.items"
        :key="idx"
        :class="{'active': (idx === active)}"
      >
        <a
          href="#"
          @click.prevent="tab(idx)"
        >{{ item.title }}</a>
      </li>
    </ul>
    <div class="tab-content">
      <div
        v-for="(item, idx) in definition.items"
        :key="idx"
        class="tab-pane"
        :class="{'active': (idx === active)}"
      >
        <form-group
          v-for="group in item.items"
          :key="`${group.key ? group.key.join('.') : ''}-${idx}`"
          :definition="group"
        />
      </div>
    </div>
  </div>
</template>

<script>
import objectMixin from '../mixins/object.js';

export default {
  mixins: [objectMixin],
  data() {
    return {
      active: 0,
    };
  },
  created() {
    const { active } = this.definition;

    if (typeof active === 'number') {
      this.active = active;
    }
  },
  methods: {
    tab(idx) {
      if (idx !== this.active) {
        this.active = idx;
      }
    },
  },
};
</script>
