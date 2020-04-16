<template>
  <main>
    <side-bar></side-bar>
    <section class="market-info-wrapper">
      <div class="market-back">
        <router-link to="/market">
          <el-link type="primary">返回</el-link>
        </router-link>
        <el-divider></el-divider>
      </div>
      <div v-if="targetPlugin.isEmpty && !isTimedOut">
        <div class="market-empty">
          <i class="el-icon-dessert"></i>
          <p>插件加载中，请稍等</p>
        </div>
      </div>
      <section v-else-if="!targetPlugin.status && !isTimedOut && targetPlugin.name">
        <div class="market-info_box">
          <div class="market-info_meta">
            <div class="market-info_meta_title">{{targetPlugin.name}}</div>
            <p class="market-info_meta_description">{{targetPlugin.description}}</p>
            <div class="market-info_meta_more">
              <span>最新版本: {{targetPlugin.version}}</span>
              <span>发布时间: {{targetPlugin.updateTime}}</span>
              <span>发布者: {{targetPlugin.master}}</span>
            </div>
          </div>
          <div class="market-info_action">
            <el-button
              :type="isInstalled?'info':'primary'"
              @click="handleClick(isInstalled)"
              :loading="isBtnPendding"
            >{{!isInstalled?`安装${isBtnPendding?'中':''}`:`卸载${isBtnPendding?'中':''}`}}</el-button>
          </div>
        </div>

        <div class="market-info_readme content" v-html="targetPlugin.readmeHTML"></div>
      </section>

      <div v-else-if="targetPlugin.status || isTimedOut" class="market-empty">
        <i class="el-icon-dessert"></i>

        <p>
          <el-link
            :href="`http://tnpm.oa.com/package/@tencent/${fullPkgName}`"
            target="_blank"
          >【{{targetPlugin.status}}】插件信息获取失败，请检查网络状况后重试，或点击这里查看</el-link>
        </p>
      </div>
    </section>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SideBar from '../SideBar'
import Basic from './mixins/basic'
// TODO 需要校验网络环境

export default {
  name: 'market-info',
  components: { SideBar },
  mixins: [Basic],
  data() {
    return {
      activeName: 'create',
      pkgName: null,
      isTimedOut: false,
      isBtnPendding: false
    }
  },
  computed: {
    ...mapState({
      plugins: state => state.Market.plugins,
      pluginsInfoMap: state => state.Market.pluginsInfoMap,
      localPlugins: state => state.Market.localPlugins,
      taskMap: state => state.Market.taskMap
    }),
    targetPlugin() {
      let _targetPlugin = this.pluginsInfoMap[this.pkgName] || {}
      if (_targetPlugin.name) {
        clearTimeout(this.timeoutPoint)
      } else {
        _targetPlugin = { isEmpty: true }
      }

      return _targetPlugin
    },
    isInstalled() {
      return this.localPlugins.includes(this.fullPkgName)
    }
  },
  created() {
    const id = this.$route.params.id
    const { key, pkgName } = this.plugins[id]

    this.pkgName = pkgName
    this.fullPkgName = key

    // 获取该插件信息
    if (!this.targetPlugin.name) {
      this.getPluginInfo(key)
      // 超时
      this.timeoutPoint = setTimeout(() => {
        this.isTimedOut = true
      }, 4500)
    }

    // 同步任务状态
    // TODO
    // store状态变化后 未能更新
    // if (this.taskMap[this.fullPkgName]) {
    //   this.isBtnPendding = true
    // } else {
    //   this.isBtnPendding = false
    // }
  },
  methods: {
    ...mapActions(['getPluginInfo', 'getLocalPluginList']),
    handleClick(isInstalled) {
      if (!this.checkTaskValid(this.fullPkgName) || this.isBtnPendding) return
      this.isBtnPendding = true
      this.handleInstallAction(isInstalled, this.fullPkgName).then(code => {
        this.isBtnPendding = false
      })
    }
  }
}
</script>

<style lang="less">
@import './style/content.less';

main {
  display: flex;
  height: 100%;
}
.market-info-wrapper {
  height: 550px;
  overflow: scroll;
  box-sizing: border-box;
  width: 100%;
  padding-left: 50px;
  padding-top: 45px;
  margin-top: 4px;
  padding-bottom: 24px;
}
.market-back {
  .el-link {
    font-size: 18px;
  }
}
.market-info {
  &_box {
    display: flex;
  }
  &_meta {
    flex-basis: 74%;
    &_title {
      color: #000;
      font-size: 22px;
      font-weight: bold;
    }
    &_description {
      padding: 12px 0;
      max-height: 100px;
      color: #000;
    }
    &_more {
      display: flex;
      justify-content: space-between;
      max-width: 80%;
      color: grey;
    }
  }
  &_action {
    flex: 1 1;
    text-align: center;
    padding-top: 16px;
  }
  &_readme {
    width: 88%;
    margin-top: 24px;
    background-color: #fdfbfb;
    border-radius: 6px;
    padding: 16px;
    min-height: 299px;
  }
}
.market-empty {
  font-size: 56px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-top: 66px;
  p {
    font-size: 16px;
    margin-top: 20px;
  }
}
</style>

