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
          @click="selectPane(itemIndex)">
            <i
              class="project-command__item-icon"
              :class="{'is-running': item.running}"></i>
            <p class="project-command__item-name">{{item.name | pascalCase}}</p>
            <p class="project-command__item-desc">{{item.running ? '运行中' : item.description}}</p>
        </li>
      </ul>
    </div>

    <!-- 命令内容  -->
    <div class="project-command__detail">
      <!-- 命令名称 & 描述 -->
      <div class="project-command__name">{{currentCommand.name | pascalCase}}</div>
      <div class="project-command__desc">{{currentCommand.description}}</div>

      <div class="project-command__operation">
        <!-- 命令脚本 -->
        <div class="project-command__operation-command">
          <el-autocomplete
            class="project-command__operation-input"
            ref="commandInput"
            v-model="currentCommand.command"
            :disabled="!isCmdEdited"
            :fetch-suggestions="querySearchAsync"
            @select="selectCommandHistory"
          >
          </el-autocomplete>

          <div class="project-command__operation-options">
            <!-- 编辑 -->
            <div class="project-command__operation-option">
              <el-tooltip class="item" effect="dark" content="编辑命令" placement="top">
                <i class="project-command__operation-edit" @click="handleEditCmd"></i>
              </el-tooltip>
            </div>

            <!-- 保存 -->
            <div class="project-command__operation-option">
              <el-tooltip class="item" effect="dark" content="保存命令" placement="top">
                <i class="project-command__operation-save" @click="handleSaveCmd"></i>
              </el-tooltip>
            </div>

            <!-- 复制 -->
            <div class="project-command__operation-option">
              <el-tooltip class="item" effect="dark" content="复制到剪贴板" placement="top">
                <i class="project-command__operation-copy" @click="handleCopyCmd"></i>
              </el-tooltip>
            </div>
          </div>
        </div>

        <!-- 命令操作 -->
        <div class="project-command__operation-btns">
          <el-button
            type="primary"
            size="mini"
            :disabled="currentCommand.running"
            @click="handleRunCmd">
            <i class="project-command__icon-run"></i>运行
          </el-button>
          <el-button
            type="danger"
            size="mini"
            plain
            :disabled="!currentCommand.running"
            @click="handleStopCmd">
            <i class="project-command__icon-stop"></i>停止
          </el-button>
        </div>

      </div>

      <!-- 控制台日志 -->
      <div class="project-command__console">
        <div class="project-command__console-terminal" ref="terminal">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

import { getUrlParam } from '@/common/utils'
import {
  ProjectCommandHistory,
  spawnProjectCommand,
  fetchProjectDevkitCommandList
} from '@/bridge'

const { clipboard } = require('electron')

export default {
  name: 'project-command',
  data() {
    return {
      current: 0,
      isCmdEdited: false,
      isCmdRunning: false,
      runningCommand: null,
      currentCmdProcess: null,
      projectCommand: [
        {
          name: '',
          command: '',
          description: '',
          builder: '',
          options: ''
        }
      ],
      commandHistory: {}
    }
  },
  filters: {
    pascalCase(str) {
      return `${str.substr(0, 1).toUpperCase()}${str.substr(1).toLowerCase()}`
    }
  },
  computed: {
    currentCommand() {
      return this.projectCommand[this.current]
    },
    currentCommandHistory() {
      return this.commandHistory[this.currentCommand.name] || []
    }
  },
  mounted () {
    this.projectPath = getUrlParam('path')
    this.projectName = getUrlParam('name')
    this.ProjectCommandHistory = new ProjectCommandHistory(this.projectName)
    this.getCommand(this.projectPath)
    this.initTerminal()
  },
  methods: {
    // 初始化控制台
    initTerminal() {
      this.term = new Terminal({
        theme: {
          background: '#F3F4F5',
          foreground: '#434650'
        },
        convertEol: true, // 解决换行符问题 https://xtermjs.org/docs/api/terminal/interfaces/iterminaloptions/#optional-converteol
        cols: 80,
        rows: 24,
        fontSize: 12,
        disableStdin: true, // 禁止输入
        cursorBlink: false,
        cursorStyle: 'bar',
        cursorWidth: 0
      })
      const fitAddon = new FitAddon()
      this.term.loadAddon(fitAddon)

      // 将 term 挂载 dom 节点上渲染
      this.term.open(this.$refs.terminal)
      fitAddon.fit()
    },
    // 获取项目开发套件命令
    getCommand(projectPath) {
      const commandList = fetchProjectDevkitCommandList(projectPath)
      const history = this.ProjectCommandHistory.get()

      this.projectCommand = commandList.map(item => {
        const { name, command, builder, options, description } = item

        // 读取最近的命令历史
        const lastCommandHistory = (history[name] || []).pop()

        return {
          name,
          originCommand: command,
          command: lastCommandHistory || command,
          builder,
          options,
          description,
          running: false // 增加是否运行中的标识
        }
      })
    },
    // 运行命令
    runCommand(commandName, commandScript, exitCallback) {
      this.term.writeln(`[${(new Date()).toTimeString().split(' ')[0]}]Start Running Command ${commandScript}...`)

      const execCommand = spawnProjectCommand(this.projectPath)
      const commandOptions = commandScript.split(commandName)[1].trim()
      const childProcess = execCommand([commandName, commandOptions])
      childProcess.stdout.on('data', (data) => {
        this.term.writeln(data)
      })
      childProcess.on('close', (data) => {
        this.term.writeln(`[${(new Date()).toTimeString().split(' ')[0]}]Stop Run Command ${commandScript}.`)
        exitCallback && exitCallback()
      })

      return childProcess
    },
    // 获取命令历史
    fetchCommandHistory() {
      const history = this.ProjectCommandHistory.get()
      let cmdHistory = {}
      Object.keys(history).map(cmd => {
        const h = history[cmd].map(item => {
          return {
            value: item
          }
        })

        cmdHistory[cmd] = [].concat(h)
      })

      return { ...cmdHistory }
    },
    // 查询命令历史
    querySearchAsync(queryString, cb) {
      this.commandHistory = this.fetchCommandHistory()
      const history = this.currentCommandHistory
      const results = queryString ? history.filter(this.createStateFilter(queryString)) : history;

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 3000 * Math.random())
    },
    // 命令历史过滤
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    // 选择任务面板
    selectPane(index) {
      this.current = index
    },
    // 选择命令历史
    selectCommandHistory(item) {
      // 保存命令
      this.handleSaveCmd()
    },
    // 编辑命令
    handleEditCmd() {
      this.isCmdEdited = true
      this.$nextTick(() => {
        this.$refs.commandInput.focus()
      })
    },
    // 保存命令
    handleSaveCmd() {
      this.isCmdEdited = false

      // 校验命令
      const { name, command, originCommand } = this.currentCommand

      if (command.indexOf(originCommand)) {
        // 重置为原始命令
        this.currentCommand.command = originCommand

        this.$notify.error({
          title: '命令错误',
          message: `命令内容不属于该任务命令 ${originCommand}`
        })
        return
      }

      this.ProjectCommandHistory.update(name, command.trim())
      this.$message({
        type: 'success',
        message: '命令保存成功！'
      })
    },
    // 复制命令
    handleCopyCmd() {
      // 保存命令
      if (this.isCmdEdited) this.handleSaveCmd()

      const { command } = this.currentCommand
      clipboard.writeText(command)

      this.$message({
        type: 'success',
        message: '命令复制成功！'
      })
    },
    // 运行命令
    handleRunCmd() {
      // 保存命令
      if (this.isCmdEdited) this.handleSaveCmd()

      // 禁止命令并行
      if (this.isCmdRunning) {
        this.$alert(
          '如果想运行其他任务，请先停止当前任务。',
          `对不起，${this.runningCommand.command}正在运行中`,
          {
            confirmButtonText: '确定'
          }
        )
        return
      }

      this.isCmdRunning = true
      this.runningCommand = this.currentCommand
      this.runningCommand.running = true

      const { name, command } = this.runningCommand
      this.currentCmdProcess = this.runCommand(name, command, () => {
        this.isCmdRunning = false
        this.runningCommand.running = false
        this.currentCmdProcess = null
      })
    },
    // 停止命令
    handleStopCmd() {
      if (!this.isCmdRunning) return
      if (this.runningCommand.command !== this.currentCommand.command) return

      this.isCmdRunning = false
      this.currentCmdProcess.kill('SIGINT')
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../assets/less/_function";

.project-command {
  flex: 1;
  display: flex;

  &__icon {
    &-stop {
      display: inline-block;
      vertical-align: middle;
      margin: -2px 5px 0;
      width: 10px;
      height: 10px;
      background: url("../../assets/img/service-stop.png") center no-repeat;
      background-size: 100% auto;
    }

    &-run {
      display: inline-block;
      vertical-align: middle;
      margin: -2px 5px 0;
      width: 10px;
      height: 12px;
      background: url("../../assets/img/service-run.png") center no-repeat;
      background-size: 100% auto;
    }
  }

  &__sidebar {
    width: 160px;
    height: 100%;
    border-right: solid 1px #e6e6e6;
    background: #F3F4F5;
  }

  &__detail {
    box-sizing: border-box;
    flex: 1;
    padding: 20px 50px 30px 30px;
  }

  &__list {
    width: 100%;
  }

  &__item {
    position: relative;
    padding: 0 16px 0 50px;
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    height: 48px;
    line-height: 1.2;

    &.is-active {
      border-right: 2px solid #434650;
      background: rgba(#8A92AF, 0.1);
    }

    &-icon {
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      width: 30px;
      height: 30px;
      border-radius: 30px;
      background: #fff url("../../assets/img/service-publish.png") center no-repeat;
      background-size: 100% auto;
      &.is-running {
        background-image: url("../../assets/img/service-running.png");
      }
    }

    &-name {
      font-size: 18px;
      color: #333333;
    }

    &-desc {
      .oneline;

      width: 100%;
      font-size: 12px;
      color: #8A92AF;
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
    margin-top: 18px;
    display: flex;

    &-command {
      position: relative;
      display: flex;
      box-sizing: border-box;
      margin-right: 10px;
      padding: 0 34px 0 10px;
      min-width: 304px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      color: #434650;
      background: #F3F4F5;
      border-radius: 4px;

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

    &-options {
        display: flex;
        align-items: center;
    }

    &-option {
      margin: 0 5px;
    }

    &-copy {
      display: block;
      width: 14px;
      height: 14px;
      background: url('../../assets/img/service-copy.png') center no-repeat;
      background-size: 100% auto;
    }

    &-edit {
      display: block;
      width: 14px;
      height: 14px;
      background: url('../../assets/img/service-edit.png') center no-repeat;
      background-size: 100% auto;
    }

    &-save {
      display: block;
      width: 14px;
      height: 14px;
      background: url('../../assets/img/service-save.png') center no-repeat;
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
    height: 410px;
    color: #767E97;
    background: #F3F4F5;
    border-radius: 4px;

    &-terminal {
      width: 440px;
      height: 370px;
    }

    &-text {
      font-size: 14px;
      color: #767E97;
    }
  }
}
</style>