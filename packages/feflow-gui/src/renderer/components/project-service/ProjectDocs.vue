<template>
  <div class="project-docs">
    <!-- S 单个分类 -->
    <section
      class="project-docs__section"
      v-for="tag in tagList"
      :key="tag.tagId">
      <h3 class="project-docs__title">{{ tag.tagName }}</h3>
      <!-- S 文档列表 -->
      <ul class="project-docs__list">
        <li
          class="project-docs__item"
          v-for="(item, itemIndex) in itemDocsList(tag.tagId)"
          :key="itemIndex"
          @click="handleHrefClick(item)">
          <i class="project-docs__item-edit" @click.stop="showDialog(dialogType.DOC_EDIT, item)"></i>
          <div class="project-docs__item-icon">
            <img :src="item.docIcon" :alt="item.docName">
          </div>
          <p class="project-docs__item-name">{{ item.docName }}</p>
          <p class="project-docs__item-desc">{{ item.docDesc }}</p>
        </li>
        <!-- 添加快捷方式：管理者权限 -->
        <template v-if="isAdmin">
          <li class="project-docs__item project-docs__item-add" @click="showDialog(dialogType.DOC_ADD, tag.tagId)">
            <i class="project-docs__item-add-icon"></i>
            <p class="project-docs__item-add-text">添加快捷方式</p>
          </li>
        </template>
      </ul>
      <!-- E 文档列表 -->
    </section>
    <!-- E 单个分类 -->

    <!-- 添加分类：管理者权限 -->
    <template v-if="isAdmin">
      <div class="project-docs__tag-edit" @click.stop="showDialog(dialogType.TAG_EDIT)">
        <i class="project-docs__tag-edit-icon"></i>
        <p class="project-docs__tag-edit-text">自定义分类</p>
      </div>
    </template>


    <!-- S 弹窗 -->
    <el-dialog
      :title="dialogConfig.title"
      custom-class="project-docs__dialog"
      :visible="dialogConfig.visible"
      :show-close="false"
    >
      <!-- S 文档编辑 -->
      <template v-if="dialogConfig.type === dialogType.DOC_ADD || dialogConfig.type === dialogType.DOC_EDIT">
        <el-form :model="itemEditForm" ref="itemEditForm" :rules="formRules" label-width="50px" @submit.native.prevent>
          <el-form-item label="图标" prop="docIcon">
            <el-input v-model="itemEditForm.docIcon" autocomplete="off" placeholder="建议尺寸160px*160px，支持png/JPEG格式，不超过500kb"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="docName">
            <el-input v-model="itemEditForm.docName" autocomplete="off" maxlength="9" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="docDesc">
            <el-input v-model="itemEditForm.docDesc" autocomplete="off" maxlength="18" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="路径" prop="docLink">
            <el-input v-model="itemEditForm.docLink" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <!-- E 文档编辑 -->

      <!-- S 自定义分类编辑 -->
      <template v-if="dialogConfig.type === dialogType.TAG_EDIT">
        <el-form :model="tagEditForm" ref="tagEditForm" :rules="formRules" @submit.native.prevent>
          <el-form-item prop="tagName">
            <el-tooltip effect="dark" content="回车键进行添加" placement="right">
              <el-input
                v-model="tagEditForm.tagName"
                clearable
                autocomplete="off"
                placeholder="添加自定义分类"
                @keyup.enter.native="addTag">
                <i slot="prefix" class="project-docs__tag-add"></i>
              </el-input>
            </el-tooltip>
          </el-form-item>
          <ul class="project-docs__tag-list">
            <li
              class="project-docs__tag-item"
              v-for="tag in tagList"
              :key="tag.tagId"
              >{{tag.tagName}}
              <i class="project-docs__tag-del" @click="deleteTag(tag)"></i>
            </li>
          </ul>
        </el-form>
      </template>
      <!-- E 自定义分类编辑 -->

      <div slot="footer" class="dialog-footer">
        <div class="dialog-footer__left" v-if="dialogConfig.type === dialogType.DOC_EDIT">
          <el-button type="danger" @click="deleteDoc">删 除</el-button>
        </div>
        <div class="dialog-footer__right">
          <el-button @click="closeDialog">关 闭</el-button>
          <el-button type="primary" @click="addDoc" v-if="dialogConfig.type === dialogType.DOC_ADD">添 加</el-button>
          <el-button type="primary" @click="updateDoc" v-if="dialogConfig.type === dialogType.DOC_EDIT">编 辑</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- E 弹窗 -->
  </div>
</template>
<script>
import electron from 'electron'
import { mapState, mapGetters } from 'vuex'
import { getUrlParam } from '@/common/utils'
import apiDocs from '@/api/project-docs'

const { ipcRenderer } = electron

function error(ctx, err) {
  ctx.$message({
    type: 'error',
    message: err
  })
}

export default {
  name: 'project-docs',
  data() {
    // 自定义分类检查
    const validateTagName = (rule, value, callback) => {
      // 检查同名
      const isExist = this.tagList.some(tag => tag.tagName === value)
      if (isExist) {
        callback(new Error('存在同名分类'))
      } else {
        callback()
      }
    }

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

    return {
      projectPath: getUrlParam('path'),
      projectName: getUrlParam('name'),
      dialogType: {
        DOC_ADD: 0, // 「添加快捷方式」弹窗
        DOC_EDIT: 1, // 「编辑快捷方式」弹窗
        TAG_EDIT: 2 // 「编辑自定义分类」弹窗
      },
      dialogConfig: {
        title: '添加快捷方式',
        visible: false,
        type: 0
      },
      formRules: {
        tagName: [
          { required: true, message: '请输入自定义分类名称', trigger: 'change' },
          { validator: validateTagName, trigger: 'change' }
        ],
        docName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        docLink: [
          { required: true, message: '请输入路径地址', trigger: 'blur' },
          { validator: validateURL, trigger: 'change' }
        ]
      },
      itemEditForm: {},
      tagEditForm: {},
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
    itemDocsList() {
      return tagId => {
        return this.docsList.filter(item => item.tagId === tagId)
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    // 页面初始化
    fetchData() {
      this.fetchTagList()
      this.fetchDocList()
    },
    // 拉取全部分类
    async fetchTagList() {
      const { groupName, projectName } = this
      try {
        const tagList = await apiDocs.getTagList({
          groupName,
          projectName
        })

        // 过滤无效数据
        this.tagList = tagList.filter(item => item.status === 0)
      } catch (err) {
        error(this, err)
      }
    },
    // 拉取全部文档
    async fetchDocList() {
      const { groupName, projectName } = this
      try {
        const docsList = await apiDocs.getDocList({
          groupName,
          projectName
        })

        // 过滤无效数据
        this.docsList = docsList.filter(item => item.status === 0)
      } catch (err) {
        error(this, err)
      }
    },
    // 显示弹窗
    showDialog(type, playload) {
      const { dialogType } = this
      this.dialogConfig.type = type
      this.dialogConfig.visible = true

      // 根据弹窗类型进行加载
      switch (type) {
        case dialogType.DOC_EDIT:
          this.dialogConfig.title = '编辑快捷方式'
          this.itemEditForm = { ...playload }
          break
        case dialogType.DOC_ADD:
          this.dialogConfig.title = '添加快捷方式'
          this.itemEditForm.tagId = playload
          break
        case dialogType.TAG_EDIT:
          this.dialogConfig.title = '编辑自定义分类'
          break
        default:
          break
      }
    },
    addTag() {
      const {
        groupName,
        projectName,
        tagEditForm
      } = this

      const {
        tagName
      } = tagEditForm

      // 增加自定义分类
      apiDocs.createTag({
        groupName,
        projectName,
        tagName
      })
        .then(() => {
          // 清空表格
          this.resetForm('tagEditForm')
          // 重新拉取更新数据
          this.fetchTagList()
          // 提示用户
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
        })
        .catch(err => {
          error(this, err)
        })
    },
    deleteTag(tag) {
      const { tagId, tagName } = tag

      // 二次确认
      this.$confirm(`删除自定义分类会连带删除分类下的所有文档，请谨慎操作。`, `要删除自定义分类「${tagName}」吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 请求删除
        apiDocs.deleteTag({ tagId })
          .then(() => {
            // 更新数据
            this.fetchData()
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
    addDoc() {
      const {
        itemEditForm,
        username
      } = this

      const {
        tagId,
        docName,
        docDesc,
        docLink,
        docIcon
      } = itemEditForm

      apiDocs.createDoc({
        tagId,
        userName: username,
        docName,
        docDesc,
        docLink,
        docIcon
      })
        .then(data => {
          // 清空数据
          this.resetForm('itemEditForm')
          // 重新拉取更新数据
          this.fetchDocList()
          // 提示用户
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
        })
        .catch(err => {
          error(this, err)
        })
    },
    updateDoc() {
      const {
        itemEditForm,
        username
      } = this

      const {
        docId,
        docName,
        docDesc,
        docLink,
        docIcon
      } = itemEditForm

      apiDocs.updateDoc({
        docId,
        userName: username,
        docName,
        docDesc,
        docLink,
        docIcon
      })
        .then(data => {
          // 重新拉取更新数据
          this.fetchDocList()
          // 提示用户
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
        })
        .catch(err => {
          error(this, err)
        })
    },
    deleteDoc() {
      const { docId, docName } = this.itemEditForm

      // 二次确认
      this.$confirm(`删除后无法恢复，请谨慎操作`, `要删除快捷方式「${docName}」吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 请求删除
        apiDocs.deleteDoc({ docId })
          .then(() => {
            // 更新数据
            this.fetchData()
            // 提示用户
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 关闭弹窗
            this.closeDialog()
          })
          .catch(err => {
            error(this, err)
          })
      })
    },
    // 关闭弹窗
    closeDialog(type) {
      // 清空表格
      this.resetForm('itemEditForm')
      this.resetForm('tagEditForm')
      // 关闭弹窗
      this.dialogConfig.visible = false
    },
    // 确认
    comfirmDialog(type) {},
    // 重置from
    resetForm(formName) {
      this.$refs[formName] && this.$refs[formName].resetFields();
    },
    // 点击跳转
    handleHrefClick({ docLink }) {
      ipcRenderer.send('create-project-webview', { routeName: 'project-webview', link: docLink })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../assets/less/_function";
@imgpath: '../../assets/img';
@docsClass: .project-docs;

@{docsClass} {
  padding: 12px 48px 26px 50px;

  &__section {
    margin-bottom: 8px;
  }

  &__title {
    padding: 14px 0 14px;
    line-height: 22px;
    font-size: 16px;
    color: #333333;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
  }

  &__item {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 18px;
    margin-bottom: 18px;
    padding: 0 7px;
    width: 132px;
    height: 160px;
    border-radius: 5px;

    &:hover {
      background: #F3F4F5;

      @{docsClass}__item-edit {
        pointer-events: auto;
        opacity: 1;
      }
    }

    &-edit {
      pointer-events: none;
      opacity: 0;
      position: absolute;
      right: 0;
      top: 0;
      width: 40px;
      height: 40px;
      background: url("@{imgpath}/docs-more.png") center right no-repeat;
      background-size: 18px auto;
      transition: opacity ease-in-out 0.3s;
    }

    &-icon {
      margin: 0 auto 10px;
      width: 60px;
      height: 60px;
      overflow: hidden;
      border-radius: 50%;
      background-color: #FFB02F;

      img {
        margin: 0 auto;
        display: block;
        width: 100%;
      }
    }

    &-name {
      margin-bottom: 2px;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #333333;
      text-align: center;
    }

    &-desc {
      .line(2);
      line-height: 16px;
      font-size: 12px;
      color: #8A92AF;
      text-align: center;
    }
  }

  &__item-add {
    width: 130px;
    height: 158px;
    background: #F3F4F5;
    border: 1px dashed transparent;

    &:hover {
      background: darken(#F3F4F5, 2%);
      // border: 1px dashed #409eff;
    }

    &-icon {
      margin: 0 auto 11px;
      width: 30px;
      height: 30px;
      overflow: hidden;
      border-radius: 50%;
      background: url("@{imgpath}/docs-item-add.png") center no-repeat;
      background-size: 100% auto;
    }

    &-text {
      font-size: 12px;
      line-height: 16px;
      color: #8A92AF;
      text-align: center;
    }
  }

  &__tag {
    &-list {
      margin-top: 26px;
      height: 196px; // 208px 完整显示 4 个
      overflow-x: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }

    &-item {
      &:not(:last-child) {
        margin-bottom: 16px;
      }

      position: relative;
      padding: 0 35px 0 14px;
      height: 40px;
      line-height: 40px;
      background: #F3F4F5;
      font-size: 12px;
      color: #434650;
      border-radius: 4px;

      &:hover {
        background: darken(#F3F4F5, 2%);
      }
    }

    &-del {
      position: absolute;
      right: 0;
      top: 0;
      width: 35px;
      height: 40px;
      background: url("@{imgpath}/docs-tag-del.png") center no-repeat;
      background-size: 10px auto;
    }

    &-edit {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 24px auto;
      height: 58px;
      background: #F3F4F5;
      border-radius: 5px;
      border: 1px dashed transparent;

      &:hover {
        background: darken(#F3F4F5, 2%);
        // border: 1px dashed #409eff;
      }

      &-icon {
        margin-right: 6px;
        width: 16px;
        height: 16px;
        background: url("@{imgpath}/docs-tag-edit.png") center no-repeat;
        background-size: 12px auto;
      }

      &-text {
        line-height: 16px;
        font-size: 12px;
        color: #8A92AF;
      }
    }

    &-add {
      display: block;
      width: 25px;
      height: 40px;
      background: url("@{imgpath}/docs-tag-add.png") center no-repeat;
      background-size: 12px auto;
    }

  }


  &__upload {
    &-icon {
      margin: 0 auto;
      width: 60px;
      height: 60px;
      overflow: hidden;
      border-radius: 50%;
      background-color: #000;
    }
    &-tip {
      text-align: center;
      line-height: 1.4;
      color: #ccc;
    }
  }
}
</style>
<style lang="less">
// 在ele ui 中设置自定义class
.project-docs {
  .project-docs__dialog {
    margin-top: 0 !important;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    max-height: 420px;
    border-radius: 5px;
  }

  .dialog-footer {
    display: flex;
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