<template>
    <div
      class="project-sidebar"
      :class="{'is-collapse': isCollapse }">
      <!-- 导航栏 -->
      <ul class="project-sidebar__list">
        <li
          class="project-sidebar__item"
          :class="{ 'is-active': current === itemIndex }"
          v-for="(item, itemIndex) in projectSides"
          :key="itemIndex"
          @click="activeTab(itemIndex, item)">
          <i class="project-sidebar__item-icon" :style="{ backgroundImage: `url(${item.icon})` }"></i>
          <span class="project-sidebar__item-text">{{item.name}}</span>
        </li>
      </ul>
    </div>
</template>
<script>
export default {
  name: 'project-sidebar',
  model: {
    prop: 'activeTabId', // 绑定的值，通过父组件传递
    event: 'updateTabId' // Vue 内部会自动为父组件绑定该自定义事件
  },
  data() {
    return {
      current: 0,
      isCollapse: false,
      projectSides: [
        {
            name: '主页',
            icon: 'static/img/project-service/service-index.png',
            component: 'ProjectDocs'
        },
        {
          name: '任务',
          icon: 'static/img/project-service/service-command.png',
          component: 'ProjectCommand'
        },
        {
            name: '代理',
            icon: 'static/img/project-service/service-index.png',
            component: 'ProjectWhistle'
        }
      ]
    }
  },
  methods: {
    activeTab(index, item) {
      this.current = index

      // 子组件与父组件通讯，告知父组件更新
      this.$emit('updateTabId', this.current)
    }
  }
}
</script>
<style lang="less" scoped>
@rootClass: '.project-sidebar';

.project-sidebar {
  height: 100%;
  border-right: solid 1px #e6e6e6;

  &.is-collapse {
    #@{rootClass}__list {
      width: 54px;
    }
    #@{rootClass}__item-icon {
      margin-right: 0
    }
    #@{rootClass}__item-text {
      display: none;
    }
  }

  &__list {
    width: 160px;
    font-size: 14px;
    background: #434650;
    height: 100%;
    transition: width 0.3s ease-in-out;
  }

  &__item {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    color: #fff;
    background: #434650;
    height: 48px;
    line-height: 48px;

    &.is-active {
      background: #8A92AF;
    }

    &-icon {
      margin-right: 10px;
      width: 14px;
      height: 14px;
      background-size: 100% auto;
    }

    &-text {
      flex: 1;
    }
  }
}
</style>
