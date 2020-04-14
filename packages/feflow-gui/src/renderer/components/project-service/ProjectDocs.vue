<template>
  <div class="project-docs">
    <!-- S 单个分类 -->
    <section
      class="project-docs__section"
      v-for="tag in tagList"
      :key="tag">
      <h3 class="project-docs__title">{{ tag }}</h3>
      <!-- S 文档列表 -->
      <ul class="project-docs__list">
        <li
          class="project-docs__item"
          v-for="(item, itemIndex) in itemDocsList(tag)"
          :key="itemIndex"
          @click="handleHrefClick(item)">
          <i class="project-docs__item-edit" @click.stop="showDialog(dialogType.HREF_EDIT, item)"></i>
          <div class="project-docs__item-icon">
            <img :src="item.icon" :alt="item.name">
          </div>
          <p class="project-docs__item-name">{{ item.name }}</p>
          <p class="project-docs__item-desc">{{ item.desc }}</p>
        </li>
        <!-- 添加快捷方式：管理者权限 -->
        <template>
          <li class="project-docs__item project-docs__item-add" @click="showDialog(dialogType.HREF_ADD)">
            <i class="project-docs__item-add-icon"></i>
            <p class="project-docs__item-add-text">添加快捷方式</p>
          </li>
        </template>
      </ul>
      <!-- E 文档列表 -->
    </section>
    <!-- E 单个分类 -->

    <!-- 添加分类：管理者权限 -->
    <template>
      <div class="project-docs__tag-edit">
        <i class="project-docs__tag-edit-icon"></i>
        <p class="project-docs__tag-edit-text">自定义分类</p>
      </div>
    </template>


    <!-- S 弹窗 -->
    <!-- 添加快捷方式 -->
    <el-dialog
      title="添加快捷方式"
      custom-class="project-docs__dialog"
      :visible="showDialogType === dialogType.HREF_ADD"
      :show-close="false"
      width="584"
    >
      <el-form :model="hrefAddForm" ref="hrefAddForm">
        <el-form-item label="图标">
          <el-input v-model="hrefAddForm.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="hrefAddForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="hrefAddForm.desc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="hrefAddForm.link" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(dialogType.HREF_ADD)">取 消</el-button>
        <el-button type="primary" @click="comfirmDialog(dialogType.HREF_ADD)">添 加</el-button>
      </div>
    </el-dialog>

    <!-- 编辑快捷方式 -->
    <el-dialog
      title="编辑快捷方式"
      custom-class="project-docs__dialog"
      :visible="showDialogType === dialogType.HREF_EDIT"
      :show-close="false"
      width="584"
    >
      <el-form :model="hrefEditForm" ref="hrefEditForm">
        <el-form-item label="图标">
          <el-input v-model="hrefEditForm.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="hrefEditForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="hrefEditForm.desc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="hrefEditForm.link" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(dialogType.HREF_ADD)">取 消</el-button>
        <el-button type="primary" @click="comfirmDialog(dialogType.HREF_ADD)">修 改</el-button>
      </div>
    </el-dialog>

    <!-- E 弹窗 -->
  </div>
</template>
<script>
export default {
  name: 'project-docs',
  data() {
    return {
      showDialogType: -1,
      dialogType: {
        HREF_ADD: 0, // 「添加快捷方式」弹窗
        HREF_EDIT: 1, // 「编辑快捷方式」弹窗
        TAG_EDIT: 2 // 「编辑自定义分类」弹窗
      },
      hrefAddForm: {
        icon: '',
        name: '',
        desc: '',
        link: ''
      },
      hrefEditForm: {
        icon: '',
        name: '',
        desc: '',
        link: ''
      },
      tagList: [
        '自定义分类1',
        '自定义分类2'
      ],
      docsList: [
        {
          tag: '自定义分类1',
          type: 'href',
          name: '文档A',
          desc: '两行字描述，两行字描述', // 限制字数
          link: 'https://feflow.oa.com',
          icon: '//jdc.jd.com/img/150x150' // icon图片，限制尺寸大小
        },
        {
          tag: '自定义分类1',
          type: 'href',
          name: '文档B',
          desc: '两行字描述，两行字描述，两行字描述，两行字描述', // 限制字数
          link: 'https://feflow.oa.com',
          icon: '//jdc.jd.com/img/150x150' // icon图片，限制尺寸大小
        },
        {
          tag: '自定义分类1',
          type: 'href',
          name: '文档C',
          desc: '两行字描述，两行字描述', // 限制字数
          link: 'https://feflow.oa.com',
          icon: '//jdc.jd.com/img/150x150' // icon图片，限制尺寸大小
        },
        {
          tag: '自定义分类2',
          type: 'href',
          name: '文档D',
          desc: '两行字描述，两行字描述', // 限制字数
          link: 'https://feflow.oa.com',
          icon: '//jdc.jd.com/img/150x150' // icon图片，限制尺寸大小
        }
      ]
    }
  },
  computed: {
    itemDocsList() {
      return tagName => {
        return this.docsList.filter(item => item.tag === tagName)
      }
    }
  },
  methods: {
    // 重置from
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 显示
    showDialog(dialogType, playload) {
      this.showDialogType = dialogType

      switch (dialogType) {
        case this.dialogType.HREF_EDIT:
          this.editHrefForm(playload)
          break
        default:
          console.log('nothing')
      }
    },
    // 取消
    closeDialog(dialogType) {
      switch (dialogType) {
        case this.dialogType.HREF_EDIT:
          this.resetForm('hrefEditForm');
          break
        case this.dialogType.HREF_ADD:
          this.resetForm('hrefAddForm');
          break
        default:
          console.log('nothing')
      }
      // this.showDialogType = -1
    },
    // 确认
    comfirmDialog(dialogType) {},
    // 编辑快捷方式
    editHrefForm(item) {
      this.hrefEditForm = {
        ...item
      }
    },
    // 点击跳转
    handleHrefClick({ link }) {
      console.log(link)
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../assets/less/_function";

@docsClass: .project-docs;

@{docsClass} {
  padding: 0 20px;

  &__title {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
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
    margin-right: 21px;
    padding: 0 20px;
    width: 144px;
    height: 188px;
    border-radius: 4px;

    &:hover {
      background-color: #F2F2F2;

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
      background-color: #000;
      transition: opacity ease-in-out 0.3s;
    }

    &-icon {
      margin: 0 auto;
      width: 60px;
      height: 60px;
      overflow: hidden;
      border-radius: 50%;

      img {
        margin: 0 auto;
        display: block;
        width: 100%;
      }
    }

    &-desc {
      .line(2);
    }
  }

  &__item-add {
    &-icon {
      margin: 0 auto;
      width: 60px;
      height: 60px;
      overflow: hidden;
      border-radius: 50%;
      background-color: #000;
    }
  }

  &__tag-edit {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px auto;
    height: 160px;
    background: #F2F2F2;
    border-radius: 4px;

    &-icon {
      margin-right: 10px;
      width: 50px;
      height: 50px;
      background: #000;
    }

    &-text {
      font-size: 16px;
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
  }

  .el-form {
    &-item {
      margin-bottom: 0;
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