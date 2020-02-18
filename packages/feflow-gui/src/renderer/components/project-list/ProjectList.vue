<template>
    <div class="project-list">
        <div class="title-bar">
            <div class="title">我的项目</div>
            <div class="switch">
                <i class="grid-icon" :class="{active : currIndex === 0}" @click="switchClickHandle(0)"></i>
                <i class="list-icon" :class="{active : currIndex === 1}" @click="switchClickHandle(1)"></i>
            </div>
        </div>
        <grid-project-list v-if="currIndex === 0"></grid-project-list>
        <list-project-list v-if="currIndex === 1"></list-project-list>
    </div>
</template>
<script>
  import GridProjectList from './GridProjectList'
  import ListProjectList from './ListProjectList'
  export default {
    name: 'project-list',
    components: { GridProjectList, ListProjectList },
    data () {
      return {
        currIndex: 0
      }
    },
    methods: {
      switchClickHandle (index) {
        this.currIndex = index
      }
    }
  }
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

</style>