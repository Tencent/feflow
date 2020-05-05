<template>
    <div class="project-wv">
        <div class="project-wv__header">
            <div class="project-wv__toolbar">
                <span class="project-wv__toolbar-item project-wv__toolbar-item--refresh" @click="handleRefresh"></span>
                <span class="project-wv__toolbar-item project-wv__toolbar-item--link" @click="handleCopyLink"></span>
                <span class="project-wv__toolbar-item project-wv__toolbar-item--external" @click="handleExternal"></span>
            </div>
            <div class="project-wv__progress" v-show="progressVisible">
                <div class="project-wv__progress-inner" :style="`width: ${progress}%`"></div>
            </div>
        </div>
        <div class="project-wv__browser">
            <webview class="project-wv__browser-bd" :src="src" ref="browser" autosize allowpopups></webview>
        </div>
    </div>
</template>

<script>
import { getUrlParam } from '@/common/utils'
import { copyText, openBrowser } from '@/common/native'

export default {
    name: 'project-wv',
    data() {
        return {
            src: '',
            progressVisible: false,
            progress: 0,
            timer: null
        }
    },
    created () {
        this.setLoadProgress()
    },
    mounted () {
        this.src = decodeURIComponent(getUrlParam('link'))

        // 显示加载进度
        const webview = this.$refs.browser
        webview.addEventListener('dom-ready', () => {
            clearInterval(this.timer)
            this.progress = 100
            setTimeout(() => {
                this.progressVisible = false
            }, 500)
        })
    },
    methods: {
        // 模拟加载进度条
        setLoadProgress() {
        this.progressVisible = true
        this.progress = 0
        this.$nextTick(() => {
            this.timer = setInterval(() => {
                this.progress += 1
                if (this.progress >= 100) {
                    this.progress = 95
                }
            }, 20);
        })
        },
        // 复制命令
        handleCopyLink() {
            copyText(this.src)
        },
        // 刷新webiew
        handleRefresh() {
            this.setLoadProgress()
            this.$refs.browser.reload()
        },
        // 外部打开
        handleExternal() {
            openBrowser(this.src)
        }
    }
}
</script>
<style lang="less" scoped>
@import "../../assets/less/_function";
@imgpath: '~@/assets/img';

.project-wv {
    height: 100%;
    display: flex;
    flex-direction: column;

    &__header {
        position: relative;
        box-sizing: border-box;
        padding-top: 30px;
        height: 70px;
        border-bottom: 1px solid darken(#F3F4F5, 10%);
    }

    &__progress {
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 100%;
        height: 3px;

        &-inner {
            width: 0%;
            height: 100%;
            background: #1AAD19;
            transition: width 0.3s ease-in-out;
        }
    }

    &__toolbar {
        display: flex;
        justify-content: flex-end;
        padding: 0 30px;

        &-item {
            display: block;
            width: 40px;
            height: 40px;

            &--refresh {
                background: url('@{imgpath}/wv-refresh.png') center no-repeat;
                background-size: 22px auto;
            }

            &--link {
                background: url('@{imgpath}/wv-link.png') center no-repeat;
                background-size: 22px auto;
            }

            &--external {
                background: url('@{imgpath}/wv-external.png') center no-repeat;
                background-size: 22px auto;
            }
        }
    }

    &__browser {
        flex: 1;
        overflow-y: scroll;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        background: #f2f2f2;

        &-bd {
            display:inline-flex;
            width:100%;
            height: 100%;
        }
    }
}
</style>