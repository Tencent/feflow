<template>
  <el-container class="project-index">
    <!-- 侧边导航 -->
    <side-bar v-model="activeTabId" :project-sides="projectSides" :project-current="activeTabId" :is-project-page="true"></side-bar>
<!--     <project-side-bar v-model="activeTabId"></project-side-bar>-->
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
  import SideBar from '../SideBar'
  import ProjectCommand from './ProjectCommand'
  import ProjectWhistle from './ProjectWhistle'
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
            name: '代理',
            icon: 'static/img/project-service/service-whistle.png',
            component: 'ProjectWhistle'
          }
      ]
      }
    },
    components: {
      ProjectSideBar,
      ProjectCommand,
      ProjectWhistle,
      SideBar
    },
    methods: {
    }
  }
</script>
<style lang="less" scoped>
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
    color: #333;
    background: #FFFFFF;
    border-bottom: 1px solid #F3F4F5;
  }
}
</style>
