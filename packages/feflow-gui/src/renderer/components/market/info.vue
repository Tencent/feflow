<template>
  <div>
    <main>
      <side-bar></side-bar>
      <section class="market-info-wrapper">
        <div class="market-info_box">
          <div class="market-info_meta">
            <div class="market-info_meta_title">Feflow-plugin-check</div>
            <p
              class="market-info_meta_description"
            >不知道本地全局安装过哪些npm包时，可以输入以下指令进行查看npm ... info得到所有的svn信息，然后提取版本号异步获取： node-cmd包信息会 ...</p>
            <div class="market-info_meta_more">
              <span>当前版本: 1.2.0</span>
              <span>发布时间: 2020-03-02</span>
              <span>发布者: Mike</span>
            </div>
          </div>
          <div class="market-info_action">
            <el-button type="primary">安装</el-button>
          </div>
        </div>

        <div class="market-info_readme">this is plugin description</div>
      </section>
    </main>
  </div>
</template>

<script>
import SideBar from '../SideBar'

export default {
  name: 'market-info',
  // components: {  },
  components: { SideBar },
  data() {
    return {
      activeName: 'create',
      pluginId: null
    }
  },
  created() {
    const id = this.$route.params.id
    this.pluginId = id || 0
  },
  methods: {
    handleJump(id) {}
  }
}
</script>

<style scoped lang="less">
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
    background-color: #efefef;
    border-radius: 6px;
    padding: 16px;
    min-height: 299px;
  }
}
</style>

<style>
</style>

