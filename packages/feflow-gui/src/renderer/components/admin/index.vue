<template>
  <div class="main">
    <side-bar />
    <admin-page />
  </div>
</template>

<script>
import AdminPage from './admin';
import SideBar from '../SideBar';
export default {
  name: 'AdminPageIndex',
  components: { SideBar, AdminPage },
  data() {
    return {
    };
  },
  methods: {

  },
};
</script>

<style scoped>
.main{
  display: flex;
  height: 100%;
}
</style>

