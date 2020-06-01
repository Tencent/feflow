<template>
    <main class="project-index">
        <!-- 侧边导航 -->
        <side-bar v-model="activeTabId" :project-sides="projectSides" :project-current="activeTabId" :is-project-page="true"></side-bar>
        <!-- 侧边导航 -->

        <!-- 导航面板 -->
        <div class="project-pane">
            <div class="project-pane__header">
                <div class="project-pane__title">{{projectSides[activeTabId].name}}</div>
                <div class="project-pane__action">
                    <el-tooltip class="item" effect="dark" content="打开项目所在文件夹" placement="bottom">
                        <span class="project-pane__action-item project-pane__action-item--finder" @click="openInFinder"></span>
                    </el-tooltip>
                    <!-- TODO: 待开发 -->
                    <!-- <el-tooltip class="item" effect="dark" content="唤起编辑器打开项目" placement="bottom">
                        <span class="project-pane__action-item project-pane__action-item--editor" @click="openInEditor"></span>
                    </el-tooltip> -->
                </div>
            </div>
            <div class="project-pane__content">
                <keep-alive>
                <component :is="projectSides[activeTabId].component"></component>
                </keep-alive>
            </div>
        </div>
    </main>
</template>

<script>
import { getUrlParam } from '@/common/utils'
import { openFinder } from '@/common/native'

import SideBar from '../SideBar'
import ProjectCommand from './ProjectCommand'
import ProjectWhistle from './ProjectWhistle'
import ProjectProfile from './ProjectProfile'
import ProjectMonitor from './ProjectMonitor/monitor'

export default {
    name: 'project-index',
    data() {
        return {
            projectPath: getUrlParam('path'),
            activeTabId: 0,
            projectSides: [
                {
                    name: '主页',
                    icon: 'static/img/project-service/service-index.png',
                    component: 'ProjectProfile'
                },
                {
                    name: '任务',
                    icon: 'static/img/project-service/service-command.png',
                    component: 'ProjectCommand'
                },
                {
                    name: '代理',
                    icon: 'static/img/project-service/service-whistle.png',
                    component: 'ProjectWhistle'
                },
                {
                  name: '监控',
                  icon: 'static/img/project-service/service-monitor.png',
                  component: 'ProjectMonitor'
                }
            ]
        }
    },
    components: {
        ProjectCommand,
        ProjectWhistle,
        ProjectProfile,
        SideBar,
        ProjectMonitor
    },
    methods: {
        // 打开项目所在文件夹
        openInFinder() {
            openFinder(this.projectPath)
        },
        // 编辑器打开项目
        openInEditor() {}
    }
}
</script>
<style lang="less" scoped>
@import "../../assets/less/_function";
@imgpath: '~@/assets/img';

.project-index {
    display: flex;
    height: 100%;
    overflow: hidden;
}
.project-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;

    &__header {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        height: 60px;
        line-height: 60px;
        background: #FFFFFF;
        border-bottom: 1px solid #F3F4F5;
    }

    &__title {
        font-size: 20px;
        font-weight: bold;
        color: #333;
    }

    &__action {
        display: flex;

        &-item {
            width: 30px;
            height: 30px;
            border-radius: 4px;

            &:not(:last-child) {
                margin-right: 12px;
            }

            &--finder {
                background: #F3F4F5 url("@{imgpath}/index-finder.png") center no-repeat;
                background-size: 16px auto;
            }

            &--editor {
                background: #F3F4F5 url("@{imgpath}/index-editor.png") center no-repeat;
                background-size: 16px auto;
            }
        }
    }

    &__content {
        flex: 1;
        overflow-y: scroll;
        overflow-x: hidden;
    }
  &__title.bottom__transparent {
    border-bottom: none;
  }

  &__content {
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>
