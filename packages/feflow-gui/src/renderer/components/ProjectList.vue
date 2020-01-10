<template>
    <div class="project-list">
        <div class="title-bar">
            <div class="title">我的项目</div>
            <div class="switch">
                <i class="grid-icon"></i>
                <i class="list-icon"></i>
            </div>
        </div>
        <grid-project-list></grid-project-list>
    </div>
</template>
<script>
  import GridProjectList from './GridProjectList'
  export default {
    name: 'project-list',
    components: { GridProjectList },
    methods: {

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
    background: url(../assets/grid-selected.png) no-repeat;
    width: 18px;
    height: 18px;
    display: inline-block;
    margin-right: 20px;
}
.project-list .title-bar .switch .list-icon {
    background: url(../assets/list-normal.png) no-repeat;
    width: 18px;
    height: 18px;
    display: inline-block;
}

</style>