<template>
<div class="about-dialog-wrapper"  v-if="visible">
<div class="about-dialog" >
    <div class="dialog-title">
        <span>关于</span>
        <div class="close-button" @click="close">
            <i class="el-icon el-icon-close"></i>
        </div>

    </div>
    
    <div class="content-wrapper">
        <div class="icon-wrapper"></div>
        <div class="description">Feflow 桌面版</div>
        <div class="version">V1.0</div>
        <div class="feedback" @click="feedback">
          Bug反馈
        </div>
    </div>
    <div class="copyright">© 2020 Feflow</div>
</div>
</div>
</template>
<script>
import { openBrowser } from '@/common/native'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('hideAboutDialog')
    },
    feedback() {
      openBrowser('https://github.com/Tencent/feflow/issues');
      this.close();
    }
  }
}
</script>
<style scoped>
.about-dialog-wrapper {
    position: fixed;
    z-index: 999;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    background: rgba(128,128,128,0.6);
}
.about-dialog {
  display: flex;
  align-items: center;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-200px, -180px);
  height: 360px;
  width: 400px;
  background: #434650;
  box-shadow: 0 2px 10px 0 rgba(0,0,0,0.10);
}
.about-dialog .close-button {
    position: absolute;
    top: 6px;
    right: 6px;
    padding: 0;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 16px;
}
.about-dialog .el-icon-close {
  color:#909399;
}
.about-dialog .el-icon-close::before {
  content: "\e6db";
}

.about-dialog  .dialog-title {
  margin-top: 9px;
  font-size: 14px;
  color: #FFFFFF;
  text-align: center
}
.about-dialog .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.about-dialog .icon-wrapper {
  margin-top: 21px;
  background: #353740;
  background: url(../../assets/img/about-logo.jpg) center center no-repeat;
  background-size: cover;
  border-radius: 8px;
  border-radius: 8px;
  width: 100px;
  height: 100px;
}
.about-dialog .content-wrapper .description{
  margin-top: 17px;
  font-size: 18px;
  color: #FFFFFF;
}
.about-dialog .content-wrapper .version {
  margin-top: 7px;
  font-size: 14px;
  color: #8A92AF;
}
.about-dialog .content-wrapper .feedback {
  width: 140px;
  height: 40px;

  margin: 27px auto 0 auto;
  line-height: 40px;

  text-align: center;
  font-size: 12px;
  color: #8A92AF;

  border: 1px solid #8A92AF;
  border-radius: 4px;
  border-radius: 4px;
}
.about-dialog .copyright {
  margin-top: 27px;
  font-size: 12px;
  color: #8A92AF;
}
</style>