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
            <p class="project-command__item-name">{{item.name}}</p>
            <p class="project-command__item-desc">{{item.description}}</p>
        </li>
      </ul>
    </div>

    <!-- 命令内容  -->
    <div class="project-command__detail">
      <!-- 命令名称 & 描述 -->
      <div class="project-command__name">{{currentCommand.command}}</div>
      <div class="project-command__desc">{{currentCommand.description}}</div>

      <div class="project-command__operation">
        <!-- 命令脚本 -->
        <div class="project-command__operation-command">
          {{currentCommand.command}}

          <el-tooltip class="item" effect="dark" content="复制到剪贴板" placement="top">
            <i class="project-command__operation-copy" @click="handleCopyCmd"></i>
          </el-tooltip>
        </div>

        <!-- 命令操作 -->
        <div class="project-command__operation-btns">
          <el-button
            type="success"
            size="mini"
            round
            :disabled="currentCommand.running"
            @click="handleRunCmd">运行
          </el-button>
          <el-button
            type="danger"
            size="mini"
            round
            :disabled="!currentCommand.running"
            @click="handleStopCmd">停止
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
// 初始化终端
import fs from 'fs'
import path from 'path'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

import 'xterm/css/xterm.css'

import { loadProjectCommand } from '../../bridge'

const { clipboard } = require('electron')

function getUrlParams(key) {
  const search = location.href.split('?')[1] || ''
  const paramsList = {}
  const args = search.split('&')

  args.forEach(function (item) {
    const [ key, value ] = item.split('=')
    if (key) {
      paramsList[key] = decodeURIComponent(value)
    }
  })

  return paramsList[key] || ''
}

function readJSONFileSync(filepath, file) {
  try {
    const content = fs.readFileSync(path.resolve(filepath, file), 'utf-8')
    return JSON.parse(content)
  } catch (err) {
    if (err.code !== 'ENOENT') {
      // ENOENT === !exists()
      throw err
    }
  }
}

export default {
  name: 'project-command',
  data() {
    return {
      current: 0,
      isCmdRunning: false,
      runningCommand: null,
      currentCmdProcess: null,
      projectCommand: [
        {
          command: 'fef dev',
          description: '本地构建',
          running: false
        },
        {
          command: 'fef build',
          description: '这是命令描述，本地构建',
          running: false
        },
        {
          command: 'fef release',
          description: '这是命令描述，本地构建',
          running: false
        }
      ]
    }
  },
  computed: {
    currentCommand() {
      return this.projectCommand[this.current]
    }
  },
  mounted () {
    // 获取 .feflowrc.json
    const projectPath = getUrlParams('path')
    this.execCommand = loadProjectCommand(projectPath)
    this.getDevkitCommand(projectPath)
    this.initTerminal()
  },
  methods: {
    initTerminal() {
      this.term = new Terminal({
        fontSize: 14,
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
    runCommand(commandName, commandScript, exitCallback) {
      this.term.writeln(`[${(new Date()).toTimeString().split(' ')[0]}]Start Running Command ${commandScript}...`)

      const childProcess = this.execCommand([commandName, '461251'])
      childProcess.stdout.on('data', (data) => {
        console.log(data)
        this.term.writeln(data)
      })
      childProcess.on('close', (data) => {
        this.term.writeln(`[${(new Date()).toTimeString().split(' ')[0]}]Stop Run Command ${commandScript}.`)
        exitCallback && exitCallback()
      })

      return childProcess
    },
    getDevkitCommand(projectPath) {
      // 解析 .feflowrc.json，获取命令列表
      const feflowrcJSON = readJSONFileSync(projectPath, '.feflowrc.json')
      const { commands = {} } = feflowrcJSON.devkit

      // 解析命令
      const commandList = Object.keys(commands).map(name => {
        const { builder, options } = commands[name]

        // 可运行命令拼接
        const option = options.length !== 0
          ? Object.keys(options).map(optKey => `--${optKey}=${options[optKey]}`).join(' ')
          : ''
        const command = `fef ${name} ${option}`

        // 解析脚手架依赖，从 devkit.json 中获取命令说明
        const [ dependency, devkitCommandKey ] = builder.split(':')
        const devkitJSON = readJSONFileSync(`${projectPath}/node_modules/${dependency}`, 'devkit.json')
        const { description } = devkitJSON.builders[devkitCommandKey]

        return {
          name,
          command,
          description,
          running: false
        }
      })

      this.projectCommand = commandList
    },
    handleSelect(index) {
      this.current = index
    },
    handleCopyCmd() {
      const { command } = this.currentCommand

      clipboard.writeText(command)

      this.$message({
        type: 'success',
        message: '命令复制成功！'
      })
    },
    handleRunCmd() {
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
    handleStopCmd() {
      if (!this.isCmdRunning) return
      if (this.runningCommand.command !== this.currentCommand.command) return

      this.isCmdRunning = false
      this.currentCmdProcess.kill('SIGINT')
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
    height: 410px;
    color: #767E97;
    background: #000;
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