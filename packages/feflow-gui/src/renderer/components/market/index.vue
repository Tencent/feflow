<template>
  <div class="market">
    <main>
      <side-bar></side-bar>
      <section class="market-wrapper">
        <div class="market-title">插件市场</div>
        <el-row :gutter="20">
          <el-col :span="8" v-for="(plugin, index) in pluginsFormated" :key="plugin.key">
            <div @click="handleJump(index)" class="box-card">
              <el-card :class="getRandomBgColor(index)">
                <h2 class="plugin-title">{{plugin.key}}</h2>
                <p class="plugin-text">{{plugin.value}}</p>
                <el-button
                  plain
                  :loading="plugin.isBtnPendding"
                  :type="plugin.isInstalled?'info':'primary'"
                  @click.stop="handleBtnClick(plugin.isInstalled, plugin.key)"
                >{{plugin.isInstalled ? `卸载${plugin.isBtnPendding?"中":""}`: `安装${plugin.isBtnPendding?"中":""}` }}</el-button>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </section>
    </main>
  </div>
</template>

<script>
import _ from 'lodash'
import SideBar from '../SideBar'
import { mapActions, mapState } from 'vuex'
import Basic from './mixins/basic'

const claMap = {}

export default {
  name: 'market-page',
  components: { SideBar },
  mixins: [Basic],
  data() {
    return {
      activeName: 'create',
      paddingPlugin: []
    }
  },
  created() {
    this.getPlugins()
    this.getLocalPluginList()
  },
  computed: {
    ...mapState({
      plugins: state => state.Market.plugins,
      localPlugins: state => state.Market.localPlugins,
      taskMap: state => state.Market.taskMap
    }),
    pluginsFormated() {
      let _plugins = []
      if (!this.plugins.length) {
        return _plugins
      }
      _plugins = this.plugins.map((plugin, index) => {
        return {
          ...plugin,
          isInstalled: this.localPlugins.includes(plugin.key),
          isBtnPendding: this.paddingPlugin.includes(plugin.key)
        }
      })
      return _plugins
    }
  },
  methods: {
    ...mapActions(['getPlugins', 'getLocalPluginList']),
    handleJump(id) {
      //   直接调用$router.push 实现携带参数的跳转
      this.$router.push({
        path: `/market-info/${id}`
      })
    },
    getRandomBgColor(index) {
      if (claMap[index]) return claMap[index]
      const randomInde = Math.floor(Math.random() * 4) + 1
      const cln = `el-bg-color-${randomInde}`
      claMap[index] = cln
      return cln
    },
    handleBtnClick(isInstalled, fullPkgName) {
      if (!this.checkTaskValid(fullPkgName)) return
      if (this.paddingPlugin.length >= 2) {
        return this.toast('任务执行过多，请稍后再试', '', 'info')
      }
      this.paddingPlugin.push(fullPkgName)
      this.handleInstallAction(isInstalled, fullPkgName).then(code => {
        _.remove(this.paddingPlugin, function(n) {
          return n === fullPkgName
        })
      })
    }
  }
}
</script>

<style scoped>
main {
  display: flex;
  height: 100%;
}
.market-wrapper {
  overflow: scroll;
  box-sizing: border-box;
  padding-left: 50px;
  padding-top: 45px;
  margin-top: 4px;
  padding-bottom: 24px;
  padding-right: 50px;
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
  min-height: 43px;
  color: rgba(255, 255, 255, 05);
}
</style>

<style lang="less">
.el-col {
  min-width: 236px;
  margin-top: 12px;
}
.market {
  height: 100%;
  .side-bar {
    height: auto;
  }
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

