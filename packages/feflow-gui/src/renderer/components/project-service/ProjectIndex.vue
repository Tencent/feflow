<template>
    <main class="project-index">
        <!-- 侧边导航 -->
        <side-bar v-model="activeTabId" :project-sides="projectSides" :project-current="activeTabId" :is-project-page="true"></side-bar>
        <!-- 侧边导航 -->

        <!-- 导航面板 -->
        <div class="project-pane">
            <div class="project-pane__header">
                <div class="project-pane__title">{{projectSides[activeTabId].name}}</div>
                <div class="project-pane__action">
                    <el-tooltip class="item" effect="dark" content="打开项目所在文件夹" placement="bottom">
                        <span class="project-pane__action-item project-pane__action-item--finder" @click="openInFinder"></span>
                    </el-tooltip>
                    <!-- TODO: 待开发 -->
                    <el-tooltip class="item" effect="dark" content="唤起编辑器打开项目" placement="bottom">
                        <span class="project-pane__action-item project-pane__action-item--editor" @click="openInEditor"></span>
                    </el-tooltip>
                </div>
            </div>
            <div class="project-pane__content">
                <keep-alive>
                <component :is="projectSides[activeTabId].component"></component>
                </keep-alive>
            </div>
        </div>

        <!-- 编辑器配置弹窗 -->
        <el-dialog
            custom-class="project-index__dialog"
            title="编辑器配置"
            :visible="showEditorDialog"
            :show-close="false"
        >
            <el-form :model="editorSettingForm" ref="editorSettingForm" :rules="formRules" label-width="80px" @submit.native.prevent>
                <el-form-item label="类型" prop="editorType">
                    <el-select v-model="editorSettingForm.editorType" placeholder="请选择">
                        <el-option
                            v-for="item in editorTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="安装路径" prop="editorPath">
                    <el-input v-model="editorSettingForm.editorPath" placeholder="请输入编辑器安装路径"></el-input>
                    <div  class="project-index__dialog-tips" v-if="editorSettingForm.editorType">例如：{{editorPathExample[editorSettingForm.editorType][osType]}}</div>
                </el-form-item>
            </el-form>

            <!-- 确认按钮 -->
            <div slot="footer" class="project-index__dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="handleEditType">确 认</el-button>
            </div>
        </el-dialog>
    </main>
</template>

<script>
import os from 'os'
import { exec as ProcessExec, spawn as ProcessSpawn } from 'child_process'

import { openFinder } from '@/common/native'
import { getUrlParam, getOSType } from '@/common/utils'
import { getEditorCommand, updateEditorCommand } from '@/bridge';

import SideBar from '../SideBar'
import ProjectCommand from './ProjectCommand'
import ProjectWhistle from './ProjectWhistle'
import ProjectProfile from './ProjectProfile'

// 环境变量
const EDITOR_ENV = {
    subl: {
        Windows: `setx PATH "%PATH%;%APP_PATH%"`,
        MacOS: `# Add Sublime Text (subl)\nexport PATH="\$PATH:%APP_PATH%/Contents/SharedSupport/bin"`
    },
    code: {
        Windows: `setx PATH "%PATH%;%APP_PATH%"`,
        MacOS: `# Add Visual Studio Code (code)\nexport PATH="\$PATH:%APP_PATH%/Contents/Resources/app/bin"`
    },
    atom: {
        Windows: `setx PATH "%PATH%;%APP_PATH%"`,
        MacOS: `# Add Atom (atom)\nexport PATH="\\\$PATH:%APP_PATH%/Contents/MacOS"`
    },
    webstorm: {
        Windows: `setx PATH "%PATH%;%APP_PATH%"`,
        MacOS: `# Add WebStom (webstorm)\nexport PATH="\\\$PATH:%APP_PATH%/Contents/MacOS"`
    }
}

const EDITOR_PATH_EXAMPLE = {
    subl: {
        Windows: 'C:\\Program Files\\Sublime Text 3',
        MacOS: '/Applications/Sublime Text.app'
    },
    atom: {
        Windows: 'C:\\Users\\{username}\\AppData\\Local\\atom',
        MacOS: '/Applications/Atom.app'
    },
    code: {
        Windows: 'C:\\users\\{username}\\AppData\\Local\\Programs\\Microsoft VS Code',
        MacOS: '/Applications/Visual Studio Code.app'
    },
    webstorm: {
        Windows: 'C:\\Program Files\\JetBrains\\WebStorm',
        MacOS: '/Applications/WebStorm.app'
    }
}
export default {
    name: 'project-index',
    data() {
        return {
            osType: getOSType(),
            projectPath: getUrlParam('path'),
            editorPathExample: EDITOR_PATH_EXAMPLE,
            activeTabId: 0,
            showEditorDialog: false,
            editorTypeOptions: [
                {
                    label: 'Sublime',
                    value: 'subl'
                },
                {
                    label: 'VS Code',
                    value: 'code'
                },
                {
                    label: 'Atom',
                    value: 'atom'
                },
                {
                    label: 'WebStom',
                    value: 'webstorm'
                }
            ],
            fileList: [
                {
                    name: '',
                    url: ''
                }
            ],
            editorSettingForm: {
                editorType: '',
                editorPath: ''
            },
            formRules: {
                editorType: [
                    { required: true, message: '请选择编辑器类型', trigger: 'change' }
                ],
                editorPath: [
                    { required: true, message: '安装路径不能为空', trigger: 'blur' }
                ]
            },
            projectSides: [
                {
                    name: '主页',
                    icon: 'static/img/project-service/service-index.png',
                    component: 'ProjectProfile'
                },
                {
                    name: '任务',
                    icon: 'static/img/project-service/service-command.png',
                    component: 'ProjectCommand'
                },
                {
                    name: '代理',
                    icon: 'static/img/project-service/service-whistle.png',
                    component: 'ProjectWhistle'
                }
            ]
        }
    },
    components: {
        ProjectCommand,
        ProjectWhistle,
        ProjectProfile,
        SideBar
    },
    methods: {
        // 打开项目所在文件夹
        openInFinder() {
            openFinder(this.projectPath)
        },

        /**
         * 用编辑器打开指定文件夹
         * @param {string} path 文件夹地址
         */
        openInEditor() {
            // 检查命令是否已配置
            const command = getEditorCommand()
            if (!command) {
                this.showEditorDialog = true
                return
            }

            // 运行对应命令打开
            const path = this.projectPath
            const childProcess = ProcessSpawn(command, [path])
            childProcess.stdout.setEncoding('utf-8')

            // 错误处理
            childProcess.on('error', (data) => {
                console.log(data)
                if (data) {
                    this.$message({
                        type: 'error',
                        message: `编辑器打开发生错误: ${data}`
                    })
                }
            })
        },

        // 打开编辑器配置弹窗
        handleEditType() {
            const command = this.editorSettingForm.editorType
            const installPath = this.editorSettingForm.editorPath
            const homedir = os.homedir()

            try {
                let shell = ''
                let shellConf = ''
                const envContent = EDITOR_ENV[command][this.osType]
                if (this.osType === 'MacOS') {
                    shellConf = `${homedir}/.bash_profile`
                    shell = `cat << EOF >> ~/.bash_profile\n\n${envContent.replace('%APP_PATH%', installPath)}\nEOF`
                } else {
                    shell = envContent.replace('%APP_PATH%', installPath)
                }

                ProcessExec(shell, (err, stdout, stderr) => {
                    if (err) {
                        console.error(err)
                        this.$message({
                            type: 'error',
                            text: `对不起，编辑器打开失败：${err}`
                        })
                        return
                    }

                    // 环境变量立即生效
                    ProcessExec(`source ${shellConf}`, (err, stdout, stderr) => {
                        if (err) {
                            console.error(err)
                            this.$message({
                                type: 'error',
                                text: `对不起，编辑器打开失败：${err}`
                            })
                            return
                        }

                        // 更新到 .feflowrc.yml
                        updateEditorCommand(command)

                        // 用户提示
                        this.$message({
                            type: 'success',
                            text: '编辑器配置完成'
                        })

                        // 编辑器打开
                        this.showEditorDialog = false
                        this.openInEditor()
                    })
                })
            } catch (err) {
                this.$message({
                    type: 'error',
                    text: `对不起，编辑器打开失败：${err}`
                })
                console.error(err)
            }
        },

        // 关闭编辑器配置弹窗
        closeDialog() {
            this.showEditorDialog = false
            this.$refs.editorSettingForm.resetFields()
        }
    }
}
</script>
<style lang="less" scoped>
@import "../../assets/less/_function";
@imgpath: '~@/assets/img';

.project-index {
    display: flex;
    height: 100%;
    overflow: hidden;

    &__dialog-tips {
        color: #909399;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
    }
}
.project-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;

    &__header {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        height: 60px;
        line-height: 60px;
        background: #FFFFFF;
        border-bottom: 1px solid #F3F4F5;
    }

    &__title {
        font-size: 20px;
        font-weight: bold;
        color: #333;
    }

    &__action {
        display: flex;

        &-item {
            width: 30px;
            height: 30px;
            border-radius: 4px;

            &:not(:last-child) {
                margin-right: 12px;
            }

            &--finder {
                background: #F3F4F5 url("@{imgpath}/index-finder.png") center no-repeat;
                background-size: 16px auto;
            }

            &--editor {
                background: #F3F4F5 url("@{imgpath}/index-editor.png") center no-repeat;
                background-size: 16px auto;
            }
        }
    }

    &__content {
        flex: 1;
        overflow-y: scroll;
        overflow-x: hidden;
    }
}
</style>
