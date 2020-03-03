<template>
  <div class="side-bar">
    <div class="head">
    <div class="account">
    <div class="personal-info">
        <div class="avatar">
        <img src="https://avatars1.githubusercontent.com/u/18289264?s=460&v=4" />
        </div>
        <div class="nickname">cpselvis</div>
    </div>
    <div class="logout" />
    </div>
    <ul class="nav">
    <router-link to="/">
        <li class="project current"><i class="icon" />我的项目</li>
    </router-link>
      <li class="market"><i class="icon" />插件市场</li>
    </ul>
    </div>
    <div class="footer">
         <div class="setting-wrap">
        <div class="divder"></div>    
        <li class="setting" @click="showSettingPanel(true)" ><i class="icon" />设置</li>  
               <SettingPanel :visible="isSettingVisble" />    
        </div>
    </div>
   
   
  </div>
</template>
<script>
import SettingPanel from './setting'
export default {
  components: {
    SettingPanel
  },
  data() {
    return {
      isSettingVisble: false
    }
  },
  methods: {
    showSettingPanel() {
      this.isSettingVisble = !this.isSettingVisble;
    }
  }
}
</script>
<style>
.side-bar {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 160px;
    /* height: 600px; */
    background: #434650;
}
.side-bar .nav, .footer{
    font-size: 14px;
    color: #bebebe;
    padding-top: 50px;
}
.side-bar .nav li, .footer li {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
}
.side-bar .nav li.current {
    background: #8a92af;
    color: #fff;
}
.footer .setting-wrap {
    cursor: pointer;
}
.footer .setting-wrap .divder {
    opacity: 0.08;
    background: #FFFFFF;
    height: 1px;
}
.side-bar .nav .project .icon {
    background: url('../assets/project.png') no-repeat;
    width: 15px;
    height: 15px;
    display: inline-block;
    margin-right: 10px;
}

.side-bar .nav .market .icon {
    background: url('../assets/market.png') no-repeat;
    width: 15px;
    height: 15px;
    display: inline-block;
    margin-right: 10px;
}

.side-bar .account {
    width: 160px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
}

.side-bar .account .personal-info {
    height: 60px;
    margin-left: 12px;
    display: flex;
    align-items: center;
}

.side-bar .account .personal-info .avatar img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 8px;
}

.side-bar .account .logout {
    background: url('../assets/logout.png') no-repeat;
    width: 14px;
    height: 13px;
    display: inline-block;
    margin-right: 14px;
}

</style>