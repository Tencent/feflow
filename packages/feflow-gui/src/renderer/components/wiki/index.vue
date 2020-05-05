<template>
    <main class="wiki">
        <side-bar></side-bar>
        <section class="wiki-wrapper">
            <div class="wiki-header">
                <p class="wiki-header__text">团队WIKI</p>
            </div>
            <!-- S 过滤器 -->
            <div class="wiki-filter">
                <el-form class="wiki-filter__form" :inline="true" ref="filterForm" v-model="filterForm">
                    <el-form-item label="所属级别" >
                        <el-select v-model="filterForm.project" placeholder="选择所属级别" size="small" default-first-option>
                            <el-option
                                v-for="item in itemProjectOptions('filter')"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属分类">
                        <el-select v-model="filterForm.tag" placeholder="选择所属分类" size="small" default-first-option>
                            <el-option
                                v-for="item in itemTagOptions('filter')"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="wiki-filter__clear" @click="resetfilterForm" size="mini">清除</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- E 过滤器 -->
            <!-- S 维基列表 -->
            <div class="wiki-docs">
                <!-- 非管理员权限：空提示 -->
                <template v-if="!isAdmin && filterDocsList.length === 0">
                    <div class="mod-tips">
                        <i class="mod-tips__icon icon-empty"></i>
                        <p class="mod-tips__text">还没有内容，请联系管理员进行录入</p>
                    </div>
                </template>
                <template v-else>
                    <ul class="wiki-docs__list">
                        <!-- 添加：管理者权限 -->
                        <li class="wiki-docs__add" v-if="isAdmin" @click="showDialog(dialogType.ADD)">
                            <i class="wiki-docs__item-add-icon"></i>
                        </li>
                        <!-- 列表 -->
                        <li class="wiki-docs__item"
                            v-for="item in filterDocsList"
                            :key="item.docId">
                            <p class="wiki-docs__title">{{ item.docName }}</p>
                            <p class="wiki-docs__desc">{{ item.docDesc }}</p>
                            <div class="wiki-docs__project" v-if="item.projectName">
                                <p class="wiki-docs__project-text">{{ item.projectName === 'common' ? '团队公共' : item.projectName}}</p>
                            </div>
                            <div class="wiki-docs__tag" v-if="item.tagName">
                                <p class="wiki-docs__tag-text">{{ item.tagName }}</p>
                            </div>

                            <!-- 操作：管理员权限 -->
                            <template v-if="isAdmin">
                                <div class="wiki-docs__operation">
                                    <el-button
                                        class="wiki-docs__operation-edit"
                                        type="primary"
                                        size="small"
                                        @click="showDialog(dialogType.EDIT, item)">
                                        <i class="icon-edit el-icon--left"></i>编辑
                                    </el-button>
                                    <el-button
                                        class="wiki-docs__operation-delete"
                                        type="danger"
                                        size="small"
                                        @click="deleteDoc(item)">
                                        <i class="icon-delete"></i>
                                    </el-button>
                                </div>
                            </template>
                        </li>
                    </ul>
                </template>
            </div>
            <!-- E 维基列表 -->

            <!-- S 添加/编辑弹窗 -->
            <el-dialog
                custom-class="wiki-docs__dialog"
                :title="dialogStatus.title"
                :visible="dialogStatus.visible"
                :show-close="false"
            >
                <el-form :model="itemEditForm" ref="itemEditForm" :rules="formRules" label-width="80px" @submit.native.prevent>
                    <el-form-item label="所属级别" prop="projectName">
                        <el-tooltip class="item" effect="dark" content="若需选择项目级别，请先导入项目" placement="right">
                            <el-select v-model="itemEditForm.projectName" placeholder="请选择">
                                <el-option
                                    v-for="item in itemProjectOptions()"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="所属分类" prop="tagName">
                        <el-tooltip class="item" effect="dark" content="从已有分类中选择，或输入自定义分类" placement="right">
                            <el-select v-model="itemEditForm.tagName"  filterable allow-create default-first-option placeholder="请选择">
                                <el-option
                                    v-for="item in itemTagOptions()"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="名称" prop="docName">
                        <el-input v-model="itemEditForm.docName" autocomplete="off" maxlength="10" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="简介" prop="docDesc">
                        <el-input v-model="itemEditForm.docDesc" autocomplete="off" maxlength="30" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="docLink">
                        <el-input v-model="itemEditForm.docLink"></el-input>
                    </el-form-item>
                </el-form>

                <!-- 确认按钮 -->
                <div slot="footer" class="wiki-docs__dialog-footer">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="addDoc" v-if="dialogStatus.type === dialogType.ADD">确 认</el-button>
                    <el-button type="primary" @click="editDoc" v-if="dialogStatus.type === dialogType.EDIT">确 认</el-button>
                </div>
            </el-dialog>
            <!-- E 添加/编辑弹窗 -->
        </section>
    </main>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { getUrlParam } from '@/common/utils'
import { getProjectGitNames } from '@/bridge'
import apiWiki from '@/api/wiki'

import SideBar from '../SideBar'

function error(ctx, err) {
  ctx.$message({
    type: 'error',
    message: err
  })
}

export default {
    name: 'wiki-page',
    components: {
        SideBar
    },
    data() {
        // 校验合法URI
        const validateURL = (rule, value, callback) => {
            const regex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
            const isVaild = regex.test(value)
            if (isVaild) {
                callback()
            } else {
                callback(new Error('地址不合法'))
            }
        }

        // 检查是否同名
        const validateDocName = (rule, value, callback) => {
            const {
                dialogStatus,
                dialogType,
                itemEditForm
            } = this

            const {
                docId
            } = itemEditForm

            // 检查是否编辑状态
            let isExist
            if (dialogStatus.type === dialogType.EDIT) {
                // 除自身外，同名
                isExist = this.docsList.some(doc => doc.docName === value && doc.docId !== docId)
            } else {
                // 检查同名
                isExist = this.docsList.some(doc => doc.docName === value)
            }

            if (isExist) {
                callback(new Error('存在同名分类'))
            } else {
                callback()
            }
        }

        return {
            projectPath: getUrlParam('path'),
            projectGitList: getProjectGitNames(),
            dialogType: {
                ADD: 0, // 「添加快捷方式」弹窗
                EDIT: 1 // 「编辑快捷方式」弹窗
            },
            dialogStatus: {
                visible: false,
                title: '编辑超链接',
                type: 1
            },
            filterForm: {
                project: 'all',
                tag: 'all'
            },
            itemEditForm: {
                projectName: '',
                tagName: '',
                docName: '',
                docDesc: '',
                docLink: ''
            },
            formRules: {
                projectName: [
                    { required: true, message: '请输入所属级别', trigger: 'change' }
                ],
                tagName: [
                    { required: true, message: '请输入所属分类', trigger: 'change' }
                ],
                docName: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { validator: validateDocName, trigger: 'change' }
                ],
                docLink: [
                    { required: true, message: '请输入地址', trigger: 'blur' },
                    { validator: validateURL, trigger: 'change' }
                ]
            },
            tagList: [],
            docsList: []
        }
    },
    computed: {
        ...mapState('UserInfo', [
            'username',
            'isAdmin',
            'department'
        ]),
        ...mapGetters('UserInfo', [
            'groupName'
        ]),
        // 所属级别：筛选视图从数据中提取，添加编辑时从本地配置提取
        itemProjectOptions(type) {
            return type => {
                // 根据表单类型提取选项
                let options = []
                let repoList = []
                if (type === 'filter') {
                    // 筛选视图，从文档列表中提取并去重处理
                    const projectArr = this.docsList.map(doc => doc.projectName)
                    let projectList = [ ...new Set(projectArr) ]
                    repoList = projectList.map(projectName => {
                        return {
                            label: projectName === 'common' ? '团队公共' : projectName,
                            value: projectName
                        }
                    })

                    options.push({
                        label: '全部',
                        value: 'all'
                    })
                } else {
                    // 添加编辑时从本地配置读取项目的 Git 远程仓库名称作为选择项
                    repoList = this.projectGitList.map(repo => {
                        return {
                            label: repo,
                            value: repo
                        }
                    })

                    options.push({
                        label: '团队公共',
                        value: 'common'
                    })
                }

                return options.concat(repoList)
            }
        },
        // 所属分类选项：已有数据中提出分类选择项
        itemTagOptions(type) {
            return type => {
                // 从已有文档中提取，去重并组装为指定格式
                const tagArr = this.docsList.map(item => item.tagName)
                let tagList = [ ...new Set(tagArr) ]
                tagList = tagList.map(tagName => {
                    return {
                        label: tagName,
                        value: tagName
                    }
                })

                // 根据表单类型增加选项
                let options = []
                if (type === 'filter') {
                    options.push({
                        label: '全部',
                        value: 'all'
                    })
                }

                return options.concat(tagList)
            }
        },
        filterDocsList() {
            const { project, tag } = this.filterForm

            // 根据所属分类过滤
            let filterResult = this.docsList
            if (tag !== 'all') {
                filterResult = filterResult.filter(doc => doc.tagName === tag)
            }
            // 根据所属项目过滤
            if (project !== 'all') {
                filterResult = filterResult.filter(doc => doc.projectName === project)
            }

            return filterResult
        }
    },
    mounted () {
        // 拉取数据
        this.fetchWikiList()
    },
    methods: {
        // 拉取全部文档
        async fetchWikiList() {
            const { groupName } = this
            try {
                const docsList = await apiWiki.getDocList({ groupName })

                // 过滤无效数据
                this.docsList = docsList.filter(item => item.status === 0)
            } catch (err) {
                error(this, err)
            }
        },

        // 增加超链接
        async addDoc() {
            const {
                itemEditForm,
                groupName,
                username
            } = this

            const {
                tagName,
                projectName,
                docName,
                docDesc,
                docLink
            } = itemEditForm

            apiWiki.createDoc({
                tagName,
                groupName,
                projectName,
                userName: username,
                docName,
                docDesc,
                docLink
            }).then(data => {
                // 清空数据
                this.resetForm('itemEditForm')
                // 关闭弹窗
                this.closeDialog()
                // 重新拉取更新数据
                this.fetchWikiList()
                // 提示用户
                this.$message({
                    type: 'success',
                    message: '添加成功!'
                })
            }).catch(err => {
                error(this, err)
            })
        },

        // 编辑超链接
        editDoc() {
            const {
                itemEditForm,
                groupName,
                username
            } = this

            const {
                docId,
                projectName,
                tagName,
                docName,
                docDesc,
                docLink
            } = itemEditForm

            apiWiki.updateDoc({
                docId,
                groupName,
                tagName,
                projectName,
                userName: username,
                docName,
                docDesc,
                docLink
            }).then(data => {
                // 重新拉取更新数据
                this.fetchWikiList()
                // 关闭弹窗
                this.closeDialog()
                // 提示用户
                this.$message({
                    type: 'success',
                    message: '修改成功!'
                })
            }).catch(err => {
                error(this, err)
            })
        },

        // 删除超链接
        deleteDoc(item) {
            const { docId, docName } = item

            // 二次确认
            this.$confirm(`删除后无法恢复，请谨慎操作`, `要删除超链接「${docName}」吗？`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 请求删除
                apiWiki.deleteDoc({ docId })
                .then(() => {
                    // 更新数据
                    this.fetchWikiList()
                    // 关闭弹窗
                    this.closeDialog()
                    // 提示用户
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                })
                .catch(err => {
                    error(this, err)
                })
            })
        },

        // 显示弹窗
        showDialog(type, item) {
            const { dialogType } = this
            this.dialogStatus.type = type
            this.dialogStatus.visible = true

            // 根据弹窗类型进行加载
            switch (type) {
                case dialogType.EDIT:
                    this.dialogStatus.title = '编辑超链接'
                    this.itemEditForm = { ...item }
                    break
                case dialogType.ADD:
                    this.dialogStatus.title = '添加超链接'
                    break
                default:
                break
            }
        },

        // 关闭弹窗
        closeDialog() {
            // 关闭弹窗
            this.dialogStatus.visible = false
            // 清空表格
            this.resetForm('itemEditForm')
        },
        // 重置过滤表单
        resetfilterForm() {
            this.filterForm = {
                project: 'all',
                tag: 'all'
            }
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName] && this.$refs[formName].resetFields();
        }
    }
}
</script>
<style lang="less" scoped>
@import "../../assets/less/_function";
@imgpath: '~@/assets/img';
@wikiClass: .wiki;

.icon-edit {
    display: inline-block;
    margin-top: -3px;
    vertical-align: middle;
    width: 12px;
    height: 12px;
    background: url("@{imgpath}/wiki-edit.png") center no-repeat;
    background-size: 100% auto;
}
.icon-delete {
    display: inline-block;
    margin-top: -3px;
    vertical-align: middle;
    width: 14px;
    height: 14px;
    background: url("@{imgpath}/wiki-delete.png") center no-repeat;
    background-size: 100% auto;
}

@{wikiClass} {
    width: 100%;
    &-wrapper {
        width: 100%;
    }

    &-header {
        padding: 0 20px;
        height: 68px;
        line-height: 68px;

        &__text {
            font-size: 20px;
            color: #333;
        }
    }

    &-filter {
        padding: 0 20px;

        &__clear {
            box-sizing: border-box;
            width: 72px;
            height: 30px;
            font-size: 12px;
            color: #8A92AF;
        }
    }

    &-docs {
        box-sizing: border-box;
        position: relative;
        padding: 20px 50px;
        width: 100%;
        border-top: 1px solid #F3F4F5;

        &__list {
            margin-right: -20px;
            display: flex;
            flex-wrap: wrap;
        }

        &__item {
            position: relative;
            box-sizing: border-box;
            margin-right: 20px;
            margin-bottom: 20px;
            padding: 13px 12px 18px 13px;
            width: 178px;
            height: 138px;
            border: 1px solid #F3F4F5;
            border-radius: 4px;
            background: #fff;

            &:hover {
                box-shadow: 0 2px 10px 0 rgba(0,0,0,0.10);

                @{wikiClass}-docs__operation {
                    opacity: 1;
                }
            }
        }

        &__add {
            position: relative;
            box-sizing: border-box;
            margin-right: 20px;
            margin-bottom: 20px;
            padding: 14px;
            width: 178px;
            height: 138px;
            border: 1px solid transparent;
            border-radius: 4px;
            background: #fff;
            background: #F3F4F5 url("@{imgpath}/docs-item-add.png") center no-repeat;
        }

        &__title {
            .line(1);
            font-size: 14px;
            color: #434650;
        }

        &__desc {
            .line(2);
            margin-top: 3px;
            height: 32px;
            font-size: 10px;
            color: #8A92AF;
            line-height: 16px;
        }

        &__project {
            margin-top: 6px;
            font-size: 0;

            &-text {
                display: inline-block;
                padding: 0 6px;
                height: 18px;
                line-height: 18px;
                font-size: 10px;
                color: #2F8AFF;
                text-align: center;
                background-color: rgba(#2F8AFF, 0.1);
                border-radius: 3px;
            }
        }

        &__tag {
            margin-top: 8px;
            font-size: 0;

            &-text {
                display: inline-block;
                padding: 0 6px;
                height: 18px;
                line-height: 18px;
                font-size: 10px;
                color: #22BCA9;
                text-align: center;
                background-color: rgba(#22BCA9, 0.1);
                border-radius: 3px;
            }
        }

        &__operation {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            position: absolute;
            right: 0;
            left: 0;
            bottom: 0;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 10px;
            height: 62px;
            line-height: 62px;
            text-align: center;
            background-color: #fff;

            &-edit {
                width: 120px;
                height: 30px;
                color: #fff;
                font-size: 12px;
                background: #2F8AFF;
                border-radius: 4px;
            }

            &-delete {
                padding: 0 !important; // reset
                margin-left: 6px !important; // reset
                width: 30px;
                height: 30px;
                border-radius: 4px;
            }
        }
    }
}
</style>

<style lang="less">
// 在ele ui 中设置自定义class
.wiki {
    .wiki-docs__dialog {
        margin-top: 0 !important;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        border-radius: 5px;
    }

    .wiki-docs__dialog-footer {
        padding: 0 10px;

        &__right {
            flex: 1;
        }

        .el-button {
            width: 100px;
            height: 40px;
            font-size: 12px;
            border-radius: 4px;
            border: none;

            &--default{
                color: #8A92AF;
                background: #F3F4F5;

                &:hover {
                background: darken(#F3F4F5, 2%);
                }
            }

            &--danger {
                color: #F7625A;
                background: rgba(#F7625A, 11%);

                &:hover {
                background: rgba(#F7625A, 14%);
                }
            }

            &--primary {
                background: #2F8AFF;
                color: #fff;

                &:hover {
                background: darken(#2F8AFF, 2%);
                }
            }
        }
    }

    .el-dialog {
        &__header {
        padding: 20px 30px 10px;
        }

        &__body {
        padding: 17px 30px;
        }

        &__title {
        line-height: 22px;
        font-size: 16px;
        color: #333;
        font-weight: 700;
        }
    }

    .el-form {
        &-item {
        margin-bottom: 16px;

        &__label {
            font-size: 12px;
            color: #434650;
        }
        }
    }

    .el-input {
        &__count-inner {
        font-size: 12px;
        background: #F3F4F5 !important;
        }
        &__inner {
        font-size: 12px;
        color: #434650;
        height: 38px;
        line-height: 38px;
        background: #F3F4F5;
        border: 1px solid transparent;
        border-radius: 4px;
        }
    }

    .el-upload {
        margin: 0 auto;
        display: block;
        &-dragger {
        margin: 0 auto;
        width: 80px;
        height: 80px;
        }
    }
}
</style>