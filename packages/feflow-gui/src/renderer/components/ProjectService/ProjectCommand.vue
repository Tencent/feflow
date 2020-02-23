<template>
  <div class="project-command">
    <div class="project-command__sidebar">
      <!-- 命令列表 -->
      <ul class="project-command__list">
        <li
          class="project-command__item"
          :class="{ 'is-active': current === itemIndex }"
          v-for="(item, itemIndex) in projectCommand"
          :key="itemIndex"
          @click="handleSelect(itemIndex)">
            <i class="project-command__item-icon"></i>
            <p class="project-command__item-name">{{item.command}}</p>
            <p class="project-command__item-desc">{{item.description}}</p>
        </li>
      </ul>
    </div>

    <!-- 命令内容  -->
    <div class="project-command__detail">
      <div class="project-command__name">{{currentCommand.command}}</div>
      <div class="project-command__desc">{{currentCommand.description}}</div>
      <div class="project-command__operation">
        <div class="project-command__operation-command">
          {{currentCommand.command}}
          <i class="project-command__operation-copy"></i>
        </div>
        <div class="project-command__operation-btns">
          <el-button type="success" size="mini" round>运行</el-button>
          <el-button type="danger" size="mini" round>停止</el-button>
        </div>
      </div>
      <div class="project-command__console">
        <p class="project-command__console-text">[12:00:23] Starting build dev......</p>
        <p class="project-command__console-text">[12:00:23] Starting build dev......</p>
        <p class="project-command__console-text">[12:00:23] Starting build dev......</p>
        <p class="project-command__console-text">[12:00:23] Starting build dev......</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'project-command',
  data() {
    return {
      current: 0,
      projectCommand: [
        {
          command: 'fef dev',
          description: '本地构建'
        },
        {
          command: 'fef build',
          description: '这是命令描述，本地构建'
        },
        {
          command: 'fef release',
          description: '这是命令描述，本地构建'
        }
      ]
    }
  },
  computed: {
    currentCommand() {
      return this.projectCommand[this.current]
    }
  },
  methods: {
    handleSelect(index) {
      this.current = index
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/scss/_function.scss";

.project-command {
  flex: 1;
  display: flex;

  &__sidebar {
    width: 160px;
    height: 100%;
    border-right: solid 1px #e6e6e6;
  }

  &__detail {
    box-sizing: border-box;
    flex: 1;
    padding: 20px;
  }

  &__list {
    width: 100%;
  }

  &__item {
    position: relative;
    padding: 0 20px 0 50px;
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    height: 48px;
    line-height: 1.2;

    &.is-active {
      border-right: 2px solid #000;
    }

    &-icon {
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      width: 30px;
      height: 30px;
      border-radius: 30px;
      background: #DDD;
    }

    &-name {
      color: #000;
      font-size: 14px;
      font-weight: bold;
    }

    &-desc {
      @include line(1);
      width: 100%;
      font-size: 14px;
      color: #909399;
    }
  }

  &__name {
    color: #000;
    font-size: 18px;
    font-weight: bold;
  }

  &__desc {
    color: #6D7278;
    font-size: 14px;
  }

  &__operation {
    margin-top: 10px;
    display: flex;

    &-command {
      position: relative;
      box-sizing: border-box;
      margin-right: 10px;
      padding: 0 34px 0 20px;
      min-width: 246px;
      height: 30px;
      line-height: 30px;
      background: #F8F8F8;
      border-radius: 4px;
      color: #434650;
      font-size: 10px;

      &::before {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        content: '$';
        color: #42B983;
        margin-right: 10px;
      }
    }

    &-copy {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 14px;
        height: 14px;
        background: url('../../assets/img/service-copy.png') center no-repeat;
        background-size: 100% auto;
      }

    &-btns {
      flex: 1;
    }
  }

  &__console {
    box-sizing: border-box;
    margin-top: 30px;
    padding: 20px;
    width: 480px;
    height: 412px;
    color: #767E97;
    background: #1C1E23;
    border-radius: 4px;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;

    &-text {
      font-size: 14px;
      color: #767E97;
    }
  }
}
</style>