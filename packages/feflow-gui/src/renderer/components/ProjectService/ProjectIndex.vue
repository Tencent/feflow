<template>
  <el-container class="project-index">
    <!-- 侧边导航 -->
    <project-side-bar v-model="activeTabId"></project-side-bar>
    <!-- 侧边导航 -->

    <!-- 导航面板 -->
    <div class="project-pane">
      <div class="project-pane__title">{{projectSides[activeTabId].name}}</div>
      <keep-alive>
        <component :is="projectSides[activeTabId].component"></component>
      </keep-alive>
    </div>

  </el-container>
</template>

<script>
  import ProjectSideBar from './ProjectSideBar'
  import ProjectCommand from './ProjectCommand'

  export default {
    name: 'project-index',
    data() {
      return {
        activeTabId: 0,
        projectSides: [
        {
          name: '任务',
          icon: 'static/img/project-service/service-command.png',
          component: 'ProjectCommand'
        },
        {
          name: '主页',
          icon: 'static/img/project-service/service-index.png',
          component: 'ProjectDocs'
        }
      ]
      }
    },
    components: {
      ProjectSideBar,
      ProjectCommand
    },
    methods: {
    }
  }
</script>
<style lang="scss">
.project-index {
  display: flex;
  height: 100%;
}
.project-pane {
  flex: 1;
  display: flex;
  flex-direction: column;

  &__title {
    box-sizing: border-box;
    padding: 0 20px;
    height: 60px;
    line-height: 60px;
    font-size: 20px;
    font-weight: bold;
    color: #000;
    background: #DEDEDE;
  }
}
</style>