<template>
  <div id="wrapper">
    <main>
      <side-bar></side-bar>
      <project-list></project-list>
    </main>
  </div>
</template>

<script>
  import SideBar from './SideBar'
  import ProjectList from './project-list/ProjectList'
  export default {
    name: 'landing-page',
    components: { SideBar, ProjectList },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>
<style scoped>
  #wrapper {
    height: 100%;
  }
  main {
    height: 100%;
    display: flex;
  }
</style>
