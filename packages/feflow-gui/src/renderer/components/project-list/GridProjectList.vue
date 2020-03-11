<template>
    <div class="grid-projects">
    <div class="create">
        <router-link to="/create">
            <i class="create-icon"></i>
        </router-link>
    </div>
    <div class="project-item" v-bind:key="index" v-for="(item, index) in projects" @click="createProjectService(item)">
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
        <div class="project-setting"
            @click.stop="showSettingPanel(index)"
            @contextmenu.prevent="showSettingPanel(index)"
        >
            <div class="setting-icon" />
            <div class="dropdown" :class="{'dropdown-show' : showSettig === true && index === selectedIndex}">
                <ul class="menu">
                    <li @click.stop="deleteProject(item.name, item.path)">删除</li>
                </ul>
            </div>
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
    height: 240px;
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
.project-setting .dropdown {
    position: absolute;
    left: -92px;
    top: 24px;
    width: 200px;
    z-index: 100;
    outline: none;
    margin: 0;
    padding: 5px 0;
    list-style: none;
    background: #fff;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.1);
    border-radius: 2px;
    display: none;
}
.project-setting .dropdown-show {
    display: block;
}
.project-setting .dropdown:before {
    content: '';
    position: absolute;
    left: 50%;
    top: -4px;
    margin-left: -6px;
    z-index: -1;
    display: block;
    width: 10px;
    height: 10px;
    background-color: #fff;
    transform: rotate(45deg);
}
.project-setting .dropdown:after {
    content: '';
    display: block;
    position: absolute;
    border-color: transparent;
    border-width: 6px;
    border-style: solid;
    left: 50%;
    top: -12px;
    margin-left: -6px;
    border-bottom-color: #fff;
}
.project-setting .menu li {
    font-size: 14px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
<script>
import electron from 'electron'
import { deleteProject } from '../../bridge/index'
const { ipcRenderer } = electron

export default {
  props: ['projects'],
  data() {
    return {
        showSettig: false,
        selectedIndex: null
    }
  },
  mounted() {
    document.addEventListener('click', () => {
        this.showSettig = false
    });
  },
  methods: {
    createProjectService(project) {
      const { path, name } = project
      ipcRenderer.send('create-project-service', { routeName: 'project-service', projectPath: path, projectName: name })
    },
    showSettingPanel(index) {
        this.showSettig = true
        this.selectedIndex = index
    },
    deleteProject(name, path) {
        deleteProject(name, path)
        this.toast('项目删除成功', '', 'success')
    },
    toast(title, msg, type = 'info', isPersistent = false) {
      let opt = {
        title,
        message: msg,
        duration: 0
      }
      return this.$notify[type](opt)
    }
  }
}
</script>