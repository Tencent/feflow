<template>
  <div>
    <main>
      <side-bar></side-bar>
      <section class="market-info-wrapper">
        <div class="market-back">
          <router-link to="/market">
            <el-link type="primary">返回</el-link>
          </router-link>
          <el-divider></el-divider>
        </div>
        <section v-if="!targetPlugin.status">
          <div class="market-info_box">
            <div class="market-info_meta">
              <div class="market-info_meta_title">{{targetPlugin.name}}</div>
              <p class="market-info_meta_description">{{targetPlugin.description}}</p>
              <div class="market-info_meta_more">
                <span>当前版本: {{targetPlugin.version}}</span>
                <span>发布时间: {{targetPlugin.updateTime}}</span>
                <span>发布者: {{targetPlugin.master}}</span>
              </div>
            </div>
            <div class="market-info_action">
              <el-button type="primary">安装</el-button>
            </div>
          </div>

          <div class="market-info_readme content" v-html="targetPlugin.readmeHTML"></div>
        </section>

        <div v-else class="market-empty">
          <i class="el-icon-dessert"></i>

          <p>
            <el-link
              :href="`http://tnpm.oa.com/package/@tencent/${targetPlugin.name}`"
              target="_blank"
            >该插件信息获取失败，请点击这里查看</el-link>
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SideBar from '../SideBar'

// TODO 需要校验网络环境

export default {
  name: 'market-info',
  components: { SideBar },
  data() {
    return {
      activeName: 'create',
      pluginId: null
    }
  },
  computed: {
    ...mapState({
      plugins: state => state.Market.plugins,
      pluginsInfoMap: state => state.Market.pluginsInfoMap
    }),
    targetPlugin() {
      const _targetPlugin = this.pluginsInfoMap[this.pluginId] || {}
      return _targetPlugin
    }
  },
  created() {
    const id = this.$route.params.id
    const { key, pkgName } = this.plugins[id]

    this.pluginId = pkgName
    // 获取该插件信息
    if (!this.targetPlugin) {
      this.getPluginInfo(key)
    }
  },
  methods: {
    ...mapActions(['getPluginInfo']),
    handleJump(id) {}
  }
}
</script>

<style lang="less">
@import './style/content.less';

main {
  display: flex;
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

