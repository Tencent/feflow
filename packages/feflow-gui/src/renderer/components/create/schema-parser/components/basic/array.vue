<template>
  <ul v-if="definition.isFixed" class="list-group">
    <li v-for="idx in len" class="list-group-item drag-item" :key="idx - 1" drop="moveItem">
      <form-group
        v-for="group in definition.items"
        :definition="group"
        :key="`${group.key ? group.key.join('.') : ''}-${idx - 1}`"
        :index="idx - 1"
      ></form-group>
      <span
        type="button"
        v-if="!definition.isFixed"
        class="glyphicon glyphicon-remove"
        @click="remveItem(idx - 1)"
      ></span>
      <span
        type="button"
        v-if="!definition.isFixed && idx !== 1"
        class="glyphicon glyphicon-chevron-up"
        @click="upItem(idx - 1)"
      ></span>
      <span
        type="button"
        v-if="!definition.isFixed && idx !== len"
        class="glyphicon glyphicon-chevron-down"
        @click="downItem(idx - 1)"
      ></span>
    </li>
    <li slot="footer" class="list-group-item text-right">
      <button type="button" class="btn btn-primary" @click="addItem">添加</button>
    </li>
  </ul>
  <draggable v-else v-model="list" tag="ul" class="list-group" draggable=".drag-item">
    <li v-for="idx in len" class="list-group-item drag-item" :key="idx - 1" drop="moveItem">
      <form-group
        v-for="group in definition.items"
        :definition="group"
        :key="`${group.key ? group.key.join('.') : ''}-${idx - 1}`"
        :index="idx - 1"
      ></form-group>
      <span
        type="button"
        v-if="!definition.isFixed"
        class="glyphicon glyphicon-remove"
        @click="remveItem(idx - 1)"
      ></span>
      <span
        type="button"
        v-if="!definition.isFixed && idx !== 1"
        class="glyphicon glyphicon-chevron-up"
        @click="upItem(idx - 1)"
      ></span>
      <span
        type="button"
        v-if="!definition.isFixed && idx !== len"
        class="glyphicon glyphicon-chevron-down"
        @click="downItem(idx - 1)"
      ></span>
    </li>
    <li slot="footer" class="list-group-item text-right">
      <button type="button" class="btn btn-primary" @click="addItem">添加</button>
    </li>
  </draggable>
</template>

<script>
import arrayMixins from '../mixins/array.js'

export default {
  mixins: [arrayMixins]
}
</script>
