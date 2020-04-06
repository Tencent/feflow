<template>
  <div>
    <ul class="nav nav-tabs">
      <li v-for="(item, idx) in definition.items" :class="{'active': (idx === active)}" :key="idx">
        <a href="#" @click.prevent="tab(idx)">{{ item.title }}</a>
      </li>
    </ul>
    <div class="tab-content">
      <div
        v-for="(item, idx) in definition.items"
        class="tab-pane"
        :class="{'active': (idx === active)}"
        :key="idx"
      >
        <form-group
          v-for="group in item.items"
          :definition="group"
          :key="`${group.key ? group.key.join('.') : ''}-${idx}`"
        ></form-group>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import objectMixin from '../mixins/object.js'

export default {
  data() {
    return {
      active: 0
    }
  },
  created() {
    const active = this.definition.active

    if (typeof active === 'number') {
      this.active = active
    }
  },
  methods: {
    tab(idx) {
      if (idx !== this.active) {
        this.active = idx
      }
    }
  },
  mixins: [objectMixin]
}
</script>
