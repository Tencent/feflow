<template>
  <div class="project-list">
    <div class="title-bar">
      <div class="title">
        我的项目
      </div>
      <div class="switch">
        <i
          class="grid-icon"
          :class="{'grid-icon-active' : currIndex === 0}"
          @click="switchClickHandle(0)"
        />
        <i
          class="list-icon"
          :class="{'list-icon-active' : currIndex === 1}"
          @click="switchClickHandle(1)"
        />
      </div>
    </div>
    <grid-project-list
      v-if="currIndex === 0"
      :projects="projects"
    />
    <list-project-list
      v-if="currIndex === 1"
      :projects="projects"
    />
  </div>
</template>
<script>
import { FEFLOW_HOME_CONFIG_PATH } from '../../bridge/constants';
import { parseYaml } from '../../bridge/utils/index';
import GridProjectList from './GridProjectList';
import ListProjectList from './ListProjectList';

export default {
  name: 'ProjectList',
  components: { GridProjectList, ListProjectList },
  data() {
    return {
      currIndex: 0,
      projects: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    switchClickHandle(index) {
      this.currIndex = index;
    },
    init() {
      this.fetchProjects();
    },
    fetchProjects() {
      const feflowConfig = parseYaml(FEFLOW_HOME_CONFIG_PATH);
      const { projects } = feflowConfig;
      this.projects = projects;
    },
  },
};
</script>
<style scoped>
.project-list {
    width: 580px;
    padding: 0 50px;
}
.project-list .title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 47px;
    margin-bottom: 23px;
}
.project-list .title-bar .title {
    font-family: PingFangSC-Semibold;
    font-size: 20px;
    color: #333333;
}
.project-list .title-bar .switch .grid-icon {
    background: url(../../assets/grid-normal.png) no-repeat;
    width: 18px;
    height: 18px;
    display: inline-block;
    margin-right: 20px;
}
.project-list .title-bar .switch .grid-icon-active {
    background: url(../../assets/grid-selected.png) no-repeat;
    width: 18px;
    height: 18px;
    display: inline-block;
    margin-right: 20px;
}
.project-list .title-bar .switch .list-icon {
    background: url(../../assets/list-normal.png) no-repeat;
    width: 18px;
    height: 18px;
    display: inline-block;
}

.project-list .title-bar .switch .list-icon-active {
    background: url(../../assets/list-selected.png) no-repeat;
    width: 18px;
    height: 18px;
    display: inline-block;
}

</style>
