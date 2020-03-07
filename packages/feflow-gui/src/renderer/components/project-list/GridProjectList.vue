<template>
    <div class="grid-projects">
    <div class="create">
        <router-link to="/create">
            <i class="create-icon"></i>
        </router-link>
    </div>
    <div class="project-item" v-bind:key="item.name" v-for="item in projects" @click="createProjectService(item)">
        <div class="project-screen">
            <img v-bind:src="item.banner || require('../../assets/default-project-banner.jpg')" />
        </div>
        <div class="project-info">
            <div class="project-name">
                {{ item.name }}
            </div>
            <div class="project-path">
                {{ item.path }}
            </div>
        </div>
        <div class="project-setting">
            <div class="setting-icon" @contextmenu.prevent="showSettingPanel" />
        </div>
    </div>
</div>
</template>

<style scoped>
.grid-projects {
    display: flex;
    flex-wrap: wrap;
    height: 450px;
    overflow-y: scroll;
}
.grid-projects .create {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 180px;
    height: 240px;
    background: #F3F4F5;
    border-radius: 5px;
    margin-right: 20px;
    margin-bottom: 20px;
}
.grid-projects .create .create-icon {
    background: url(../../assets/create.png) no-repeat;
    width: 40px;
    height: 40px;
    display: inline-block;
}
.grid-projects .project-item {
    position: relative;
    width: 180px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,0.10);
    margin-right: 20px;
    margin-bottom: 20px;
}
.grid-projects .project-item:nth-child(3n) {
    margin-right: 0;
}

.grid-projects .project-item .project-screen img {
    width: 180px;
    height: 140px;
    border-radius: 3px 3px 0 0;
    display: block;
}
.grid-projects .project-item .project-info {
    height: 100px;
    padding: 0 10px;
}
.grid-projects .project-item .project-name {
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #333333;
    padding-top: 30px;
    height: 22px;
}
.grid-projects .project-item .project-path {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999999;
    line-height: 16px;
    word-wrap: break-word;
}
.project-setting  {
    background: url('../../assets/project-setting.png');
    width: 16px;
    height: 16px;
    background-size: contain;
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>
<script>
import electron from 'electron'
const { ipcRenderer } = electron

export default {
  props: ['projects'],
  methods: {
    createProjectService(project) {
      const { path, name } = project
      console.log('??')
      ipcRenderer.send('create-project-service', { routeName: 'project-service', projectPath: path, projectName: name })
    },
    showSettingPanel() {
        alert('xxx');
    }
  }
}
</script>