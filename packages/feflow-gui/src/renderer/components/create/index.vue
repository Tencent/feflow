<template>
  <div id="create-wrapper">
    <main>
      <side-bar></side-bar>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="创建项目" name="create">创建项目</el-tab-pane>
        <el-tab-pane label="导入项目" name="import">导入项目</el-tab-pane>
      </el-tabs>
    </main>
  </div>
</template>

<script>
import SideBar from '../SideBar'
export default {
  name: 'landing-page',
  components: { SideBar },
  data() {
    return {
      activeName: 'second'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style>
</style>