<template>
  <div>
    <main>
      <side-bar></side-bar>
      <section class="market-wrapper">
        <div class="market-title">插件市场</div>
        <el-row :gutter="20">
          <el-col :span="8" v-for="(plugin, index) in plugins" :key="index">
            <div @click="handleJump(index)" class="box-card">
              <el-card :class="getRandomBgColor(index)">
                <h2 class="plugin-title">{{plugin.key}}</h2>
                <p class="plugin-text">{{plugin.value}}</p>
                <el-button>安装</el-button>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </section>
    </main>
  </div>
</template>

<script>
import SideBar from '../SideBar'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'market-page',
  // components: {  },
  components: { SideBar },
  data() {
    return {
      activeName: 'create'
    }
  },
  created() {
    this.getPlugins()
  },
  computed: {
    ...mapState({
      plugins: state => state.Market.plugins
    })
  },
  methods: {
    ...mapActions(['getPlugins']),
    handleJump(id) {
      //   直接调用$router.push 实现携带参数的跳转
      this.$router.push({
        path: `/market-info/${id}`
      })
    },
    getRandomBgColor(index) {
      const randomInde = Math.floor(Math.random() * 4) + 1
      return `el-bg-color-${randomInde}`
    }
  }
}
</script>

<style scoped>
main {
  display: flex;
}
.market-wrapper {
  height: 550px;
  overflow: scroll;
  box-sizing: border-box;
  width: 100%;
  padding-left: 50px;
  padding-top: 45px;
  margin-top: 4px;
  padding-bottom: 24px;
}
.market-title {
  padding: 12px 0px;
  font-size: 26px;
  /* font-weight: bold; */
}
.plugin-title {
  color: #fff;
  font-size: 18px;
}
.box-card {
  cursor: pointer;
}
.plugin-text {
  min-height: 56px;
  color: rgba(255, 255, 255, 05);
}
</style>

<style lang="less">
.el-col {
  min-width: 236px;
  margin-top: 12px;
}
.market-wrapper {
  .el-card {
    border-radius: 6px;
  }

  .el-bg-color-1 {
    background-color: #40a9ff;
  }
  .el-bg-color-2 {
    background-color: #d3adf7;
  }
  .el-bg-color-3 {
    background-color: #ffadd2;
  }
  .el-bg-color-4 {
    background-color: #08979c;
  }
  .el-button {
    // background-color: #fff;
    color: rgb(64, 158, 255);
    border-width: 0;
  }
}
</style>

