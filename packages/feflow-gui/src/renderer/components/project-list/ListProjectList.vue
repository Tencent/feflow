<template>
    <div class="list-projects">
    <div class="create">
        <i class="create-icon" />
        创建项目
    </div>
    <div class="project-item" v-bind:key="item.name" v-for="item in projects" @click="createProjectService(item.path)">
        <div class="project-logo">
            <img src="https://static001.geekbang.org/static/time/icon/apple-touch-icon.jpg" />
        </div>
        <div class="project-info">
            <div class="project-name">
                {{ item.name }}
            </div>
            <div class="project-path">
                {{ item.path }}
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
.list-projects {
    height: 450px;
    overflow-y: scroll;
}
.list-projects .create {
    width: 600px;
    height: 72px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #8a92af;
}
.list-projects .create .create-icon {
    background: url(../../assets/create.png) no-repeat;
    width: 48px;
    height: 48px;
    display: block;
    margin-left: 10px;
    margin-right: 28px;
}
.list-projects .project-item {
    width: 600px;
    height: 72px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
}

.list-projects .project-item .project-logo {
    width: 48px;
    height: 48px;
    margin-left: 10px;
    margin-right: 28px;
}

.list-projects .project-item .project-logo img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: block;
}

.list-projects .project-item .project-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 72px;
}
.list-projects .project-item .project-name {
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #333333;
    height: 22px;
}
.list-projects .project-item .project-path {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999999;
    line-height: 16px;
    word-wrap: break-word;
}
</style>
<script>
import electron from 'electron'
const { ipcRenderer } = electron

export default {
  props: ['projects'],
  methods: {
    createProjectService(path) {
      ipcRenderer.send('create-project-service', { routeName: 'project-service', projectPath: path })
    }
  }
}
</script>