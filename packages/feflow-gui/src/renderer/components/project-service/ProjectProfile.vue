<template>
  <div class="project-profile">
    <!-- S 项目信息 -->
    <div class="project-profile__info">
      <div class="project-profile__info-header">
        <p class="project-profile__info-title">
          {{ projectTitle }}
        </p>
        <p class="project-profile__info-version">
          {{ projectVersion }}
        </p>
      </div>
      <p class="project-profile__info-desc">
        {{ projectDesc }}
      </p>
      <!-- git 地址 -->
      <template v-if="projectRepo">
        <div class="project-profile__path">
          <p class="project-profile__path-url">
            {{ projectRepo }}
          </p>
          <div class="project-profile__path-action">
            <i
              class="project-profile__path-action-open"
              @click="handleHrefClick(projectRepo)"
            />
            <i
              class="project-profile__path-action-copy"
              @click="handleCopy(projectRepo)"
            />
          </div>
        </div>
      </template>
    </div>
    <!-- E 项目信息 -->

    <!-- S 项目维基：团队公共以及所属该项目的维基内容 -->
    <template v-if="docsList.length > 0">
      <p class="project-profile__title">
        项目WIKI
      </p>
      <div
        v-for="tag in tagList"
        :key="tag"
        class="project-profile__wiki"
      >
        <!-- 所属分类 -->
        <div class="project-profile__wiki-category">
          <p class="project-profile__wiki-category-text">
            {{ tag }}
          </p>
          <i class="project-profile__wiki-category-line" />
        </div>
        <!-- 该分类下的维基列表 -->
        <ul class="project-profile__wiki-list">
          <li
            v-for="doc in tagDocsList(tag)"
            :key="doc.docId"
            class="project-profile__wiki-item"
            @click="handleHrefClick(doc.docLink)"
          >
            <p class="project-profile__wiki-name">
              {{ doc.docName }}
            </p>
            <p class="project-profile__wiki-desc">
              {{ doc.docDesc }}
            </p>
          </li>
        </ul>
      </div>
    </template>
    <!-- E 项目维基 -->
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import { getUrlParam } from '@/common/utils';
import { copyText, openWebview } from '@/common/native';
import { getProjectNpmConfig, getProjectGitNames } from '@/bridge';
import apiWiki from '@/api/wiki';

export default {
  name: 'ProjectProfile',
  data() {
    return {
      projectTitle: getUrlParam('name'),
      projectPath: getUrlParam('path'),
      projectDesc: '',
      projectVersion: 'v1.0',
      projectRepo: '',
      docsList: [], // 全部文档
      groupDocsList: [], // 按分类分组的文档
    };
  },
  computed: {
    ...mapState('UserInfo', [
      'username',
      'department',
    ]),
    ...mapGetters('UserInfo', [
      'groupName',
    ]),
    tagList() {
      return Object.keys(this.groupDocsList);
    },
    // eslint-disable-next-line
    tagDocsList(tag) {
      return tag => this.groupDocsList[tag];
    },
  },
  mounted() {
    // 从 packagejson 中读取项目描述
    this.projectNpmConf = getProjectNpmConfig(this.projectPath);
    this.projectDesc = this.projectNpmConf.description;
    this.projectVersion = `v${this.projectNpmConf.version}`;
    this.projectNpmConf.repository && (this.projectRepo = this.projectNpmConf.repository.url || '');

    // 获取文档展示
    this.fetchWikiList();
  },
  methods: {
    // 获取团队公共以及所属该项目级别的维基内容
    async fetchWikiList() {
      const { groupName } = this;
      const projectName = ['common'];
      const [projectGitName] = getProjectGitNames([this.projectPath]);

      try {
        // 若存在项目git名，一并查询
        projectGitName && projectName.push(projectGitName);
        const docsList = await apiWiki.getDocList({ groupName, projectName });

        // 过滤无效数据：0 为有效
        this.docsList = docsList.filter(doc => doc.status === 0);

        // 分组数据
        const groupDocsList = {};
        this.docsList.forEach((item) => {
          const { tagName } = item;

          if (!groupDocsList[tagName]) groupDocsList[tagName] = [];
          groupDocsList[tagName].push(item);
        });

        this.groupDocsList = groupDocsList;
      } catch (err) {
        // eslint-disable-next-line
        error(this, err);
      }
    },
    // 内嵌打开超链接
    // 点击跳转
    handleHrefClick(link) {
      openWebview(link);
    },
    // 复制文本到剪贴板
    handleCopy(text) {
      copyText(text);
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../assets/less/_function";
@imgpath: '~@/assets/img';

.project-profile {
    padding: 30px 50px;

    &__info {
        margin-bottom: 30px;

        &-header {
            display: flex;
            align-items: center;
        }

        &-title {
            line-height: 25px;
            color: #333;
            font-size: 18px;
            font-weight: 500;
        }

        &-version {
            box-sizing: border-box;
            margin-left: 10px;
            padding: 0 7px;
            height: 18px;
            line-height: 18px;
            font-size: 10px;
            color: #8A92AF;
            background: rgba(#8A92AF, 0.1);
            border-radius: 3px;
        }

        &-desc {
            margin-top: 2px;
            line-height: 17px;
            font-size: 12px;
            color: #8A92AF;
        }
    }

    &__path {
        position: relative;
        display: flex;
        margin-top: 10px;
        padding: 0 80px 0 10px;
        height: 36px;
        line-height: 36px;
        background-color: #F3F4F5;
        border-radius: 4px;

        &-url {
            flex: 1;
            font-size: 12px;
            color: #434650;
        }

        &-action {
            position: absolute;
            top: 50%;
            transform: translate(0, -50%);
            right: 10px;
            display: flex;

            &-copy {
                width: 30px;
                height: 36px;
                background: #F3F4F5 url("@{imgpath}/profile-copy.png") center no-repeat;
                background-size: 16px auto;
            }

            &-open {
                width: 30px;
                height: 36px;
                background: #F3F4F5 url("@{imgpath}/profile-open.png") center no-repeat;
                background-size: 16px auto;
            }
        }

    }

    &__title {
        margin-bottom: 3px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        font-weight: 500;
        color: #333;
    }
    &__wiki {
        &-category {
            margin: 12px auto 13px;
            position: relative;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            &-text {
                margin-right: 6px;
                position: relative;
                z-index: 1;
                display: inline-block;
                color: #22BCA9;
                padding: 0 3px;
                height: 18px;
                line-height: 18px;
                text-align: center;
                font-size: 10px;
                background: rgba(#22BCA9, 0.1);
                border-radius: 3px;
            }

            &-line {
                flex: 1;
                height: 1px;
                background-color: #F3F4F5;
            }

        }

        &-list {
            display: flex;
            flex-wrap: wrap;
        }

        &-item {
            &:not(:nth-child(3n)) {
                margin-right: 17px;
            }

            &:hover {
                box-shadow: 0 2px 10px 0 rgba(0,0,0,0.10);
            }

            margin-bottom: 20px;
            box-sizing: border-box;
            padding: 13px 13px 15px;
            width: 178px;
            height: 82px;
            background: #FFFFFF;
            border: 1px solid #EEEEEE;
            border-radius: 5px;
        }

        &-name {
            font-weight: 500;
            font-size: 14px;
            color: #434650;
            line-height: 20px;
        }

        &-desc {
            .line(2);
            height: 32px;
            margin-top: 4px;
            font-size: 10px;
            color: #8A92AF;
            line-height: 16px;
        }
    }
}
</style>
