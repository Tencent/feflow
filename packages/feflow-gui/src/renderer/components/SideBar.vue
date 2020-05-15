<template>
    <div class="side-bar">
        <div class="head">
            <div class="account">
                <div class="personal-info">
                    <div class="avatar">
                        <img v-bind:src="avatar" />
                    </div>
                    <div class="nickname">{{ username }}</div>
                </div>
                <div class="logout" />
            </div>
            <ul class="nav" v-if="!isProjectPage">
                <router-link to="/">
                    <li class="project"><i class="icon" />我的项目</li>
                </router-link>
                <router-link to="/market">
                    <li class="market"><i class="icon" />插件市场</li>
                </router-link>

                <router-link to="/admin">
                    <li class="project"><i class="icon" />管理中心</li>
                </router-link>

                <router-link to="/wiki">
                    <li class="wiki"><i class="icon" />团队WIKI</li>
                </router-link>
            </ul>
            <ul class="nav" v-if="isProjectPage">
                <li class="sub"  :class="{ 'current': projectCurrent === itemIndex }"
                    v-for="(item, itemIndex) in projectSides"
                    :key="itemIndex"
                    @click="activeTab(itemIndex)"><i class="icon" :style="{ background: `url(${item.icon})` }"></i>{{item.name}}</li>
            </ul>
        </div>
        <div class="footer">
            <div class="setting-wrap" id="settingContainer">
                <div class="divder"></div>
                <li
                    class="setting"
                    @click="showSettingPanel(true)"
                ><i class="icon" />设置</li>
                <SettingPanel :visible="isSettingVisble" @closeSettingPanel="closeSettingPanel"/>
            </div>
        </div>

    </div>
</template>
<script>
import SettingPanel from './setting'
export default {
    model: {
        prop: 'activeTabId', // 绑定的值，通过父组件传递
        event: 'updateTabId' // Vue 内部会自动为父组件绑定该自定义事件
    },
    components: {
        SettingPanel
    },
    props: {
        isProjectPage: {
            type: Boolean,
            default: false
        },
        projectSides: {
            type: Array,
            default: () => {
                return []
            }
        },
        projectCurrent: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            isSettingVisble: false,
            username: global.username,
            avatar: global.avatar
        }
    },
    methods: {
        showSettingPanel() {
            this.isSettingVisble = !this.isSettingVisble;
        },
        closeSettingPanel() {
            debugger
            this.isSettingVisble = false;
        },
        activeTab(index) {
            // 子组件与父组件通讯，告知父组件更新
            this.$emit('updateTabId', index)
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
    background: #282c34;
    padding-top: 30px;
    height: calc(100% - 30px);
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
.side-bar .nav a{
    color: #bebebe;
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

.side-bar .nav .wiki .icon {
    background: url('../assets/img/index-wiki.png') no-repeat;
    background-size: 100% auto;
    width: 15px;
    height: 15px;
    display: inline-block;
    margin-right: 10px;
}

.side-bar .nav .sub .icon {
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

.side-bar .account .personal-info .nickname {
    font-size: 12px;
}

.side-bar .account .logout {
    background: url('../assets/logout.png') no-repeat;
    width: 14px;
    height: 13px;
    display: inline-block;
    margin-right: 14px;
}

</style>
