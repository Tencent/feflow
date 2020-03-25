<template>
  <div>
    <main>
      <side-bar></side-bar>
      <section class="create-wrapper">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="创建项目" name="create">
            <create-page :is-selected="activeName == 'create'" />
          </el-tab-pane>
          <el-tab-pane label="导入项目" name="import">
            <import-page />
          </el-tab-pane>
        </el-tabs>
      </section>
    </main>
  </div>
</template>

<script>
import CreatePage from './create'
import SideBar from '../SideBar'
import ImportPage from './import.vue'
export default {
  name: 'add-page',
  components: { SideBar, CreatePage, ImportPage },
  // components: { SideBar },
  data() {
    return {
      activeName: 'create'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style scoped>
main {
  display: flex;
}
.create-wrapper {
  height: 550px;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  padding-left: 50px;
  padding-top: 45px;
  margin-top: 4px;
}
</style>

<style>
main .el-tabs__item.is-active {
  font-size: 20px;
  color: #000;
}
main .el-tabs__active-bar {
  background-color: #000;
}
main .el-tabs__item {
  color: #8a92af;
}
main .el-tabs__nav-wrap::after {
  height: 1px;
}
</style>

