<template>
  <div>
    <div
      v-if="visible"
      ref="settingContainer"
      class="setting-wrapper"
    >
      <div
        class="tab"
        :class="{active: activeTab === 'checkUpdate'}"
        @mouseenter="setActiveTab('checkUpdate')"
        @mouseleave="setActiveTab('checkUpdate')"
      >
        检查更新
      </div>
      <div
        class="tab"
        :class="{active: activeTab==='setting' }"
        @click="openAbout"
        @mouseenter="setActiveTab('setting')"
        @mouseleave="setActiveTab('setting')"
      >
        关于
      </div>
    </div>
    <About
      :visible="isOpenAbout"
      @hideAboutDialog="hideAboutDialog"
    />
  </div>
</template>
<script>
import About from './about';
export default {
  name: 'SettingPanel',
  components: {
    About,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeTab: 'None',
      isOpenAbout: false,
    };
  },
  watch: {
    visible(val) {
      if (!val) {
        this.activeTab = 'None';
      }
    },
  },
  mounted() {
    window.addEventListener('click', (e) => {
      this.queryHide(e);
    });
  },
  methods: {
    setActiveTab(tabName) {
      this.activeTab = tabName;
    },
    openAbout() {
      this.isOpenAbout = true;
    },
    hideAboutDialog() {
      this.isOpenAbout = false;
    },
    queryHide(e) {
      const dom = document.getElementById('settingContainer');
      if ((!dom.contains(e.target)) && this.visible) {
        /* 关闭元素 */
        this.$emit('closeSettingPanel');
      }
    },
  },
};
</script>

<style scoped>
.setting-wrapper {
  position: absolute;
  z-index: 999;
  bottom: 0;
  left: 160px;
  height: 100px;
  width: 100px;
  background: #FFFFFF;
  box-shadow: 0 2px 10px 0 rgba(0,0,0,0.10);
}
.setting-wrapper .tab {
  height: 50px;
  line-height: 50px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #434650;
  padding-left: 20px;
}
.setting-wrapper .tab.active {
  /* opacity: 0.11; */
  background: rgba(138,146,175, 0.11);
}
</style>
