<template>
  <div class="create-inner">
    <el-form label-position="left" label-width="140px" ref="form" :model="formData">
      <el-form-item label="脚手架">
        <el-select v-model="targetGenerator" :disabled="isWorking" placeholder="请选择">
          <el-option
            :disabled="isWorking"
            v-for="item in generators"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目目录" v-if="!!targetGenerator">
        <el-input :value="workSpace" :disabled="true">
          <el-button
            @click="handleWorkSpaceClick"
            class="workspace_btn"
            slot="append"
            :disabled="isWorking"
          >选择</el-button>
        </el-input>
      </el-form-item>
      <schema-form :schema="targetGeneratorConfig" />

      <el-form-item label="项目图片" v-if="!!targetGenerator">
        <el-input v-model="banner" clearable :disabled="isWorking" />
      </el-form-item>
    </el-form>

    <div class="action-btn">
      <el-popover
        v-model="popoverVisible"
        :title="isWorking?'运行日志' : '暂无初始化任务'"
        placement="bottom"
        width="400"
        trigger="manual"
        @after-enter="initTerminal"
      >
        <div class="create-inner__console">
          <div class="create-inner__console_terminal" ref="terminal"></div>
        </div>
        <el-button class="create-pop-btn" slot="reference" @click="handleConsoleClick">运行日志</el-button>
      </el-popover>

      <el-button @click="handleReset" :disabled="isWorking">重置</el-button>
      <el-button type="primary" @click="handleClick" :disabled="isWorking">创建</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { CREATE_CODE } from '../../bridge/constants'
import { runGenerator, saveGeneratorConfig } from '../../bridge'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import SchemaForm from './schema-parser/components/vue-form'

export default {
  name: 'create-page',
  props: ['isSelected'],
  components: {
    'schema-form': SchemaForm
  },
  data() {
    return {
      targetGenerator: '',
      generators: [],
      formData: {},
      generatorsConfig: {},
      isWorking: false,
      banner: '',
      hasInitTerminal: false,
      popoverVisible: false
    }
  },
  mounted() {},
  created() {
    // 载入脚手架
    this.init()
  },
  computed: {
    targetGeneratorConfig() {
      return this.generatorsConfig[this.targetGenerator] || {}
    },
    formConfig() {
      // 读取选中脚手架的配置
      return this.targetGeneratorConfig.properties || []
    },
    ...mapState({
      workSpace: state => state.Generator.workSpace,
      localConfigName: state => state.Generator.localConfigName,
      jsonData: state => state.Schema.model,
      validMessage: state => state.Schema.messages,
      valid: state => state.Schema.valid
    })
  },
  watch: {
    isSelected(newValue) {
      if (!newValue) {
        this.popoverVisible = false
      }
    }
  },
  methods: {
    ...mapActions(['builConfig', 'getGenerator', 'selectWorkSpace', 'resetState']),
    init() {
      // 获取脚手架
      this.getGenerator()
      this.resetState()
      const { list, configMap } = this.$store.state.Generator
      const gens = Object.keys(configMap)

      Array.isArray(gens) &&
        gens.forEach(genName => {
          const key = genName
          const gen = configMap[genName]

          this.generators.push({
            value: key,
            label: gen.description
          })

          this.generatorsConfig[key] = configMap[key]
        })
      // 默认加载第一个脚手架
      this.targetGenerator = list[0]
    },
    // 初始化控制台
    initTerminal() {
      if (this.term) return

      this.term = new Terminal({
        theme: {
          background: '#F3F4F5',
          foreground: '#434650'
        },
        convertEol: true, // 解决换行符问题 https://xtermjs.org/docs/api/terminal/interfaces/iterminaloptions/#optional-converteol
        cols: 64,
        rows: 20,
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
    async handleClick() {
      const { execType } = this.generatorsConfig[this.targetGenerator]
      const isValid = await this.checkFormData()
      let config = {}

      if (!isValid || this.messageInstance) return

      // 创建配置文件
      if (execType === 'path') {
        this.builConfig({
          config: this.jsonData,
          genConfig: this.generatorsConfig[this.targetGenerator]
        })
        config = this.localConfigName
      } else {
        config = Object.assign({}, this.jsonData, { banner: this.banner })
      }

      if (this.messageInstance) {
        this.messageInstance.close()
        this.messageInstance = null
      }

      this.messageInstance = this.toast('脚手架生成中, 请稍等', '', 'info', true)

      this.isWorking = true
      this.popoverVisible = true
      // 直接传参
      // 执行脚手架初始化命令

      const childProcess = runGenerator({
        execType,
        config,
        generator: this.targetGenerator,
        workSpace: this.workSpace
      })

      if (typeof childProcess === 'number') {
        return this.handleInitCode(childProcess)
      }
      childProcess.stdout.on('data', data => {
        this.term.writeln(data)
      })
      childProcess.on('close', code => {
        this.handleInitCode(code)
      })
      childProcess.on('error', err => {
        this.messageInstance && this.messageInstance.close()
        this.messageInstance = null
        // 上报点
        this.toast('脚手架生成过程发生异常', err, 'error')
      })
    },
    handleConsoleClick() {
      this.popoverVisible = !this.popoverVisible
    },
    async checkFormData() {
      let errMsg = []
      let isValidWorkspace = false
      this.$store.dispatch('Schema/validate')
      // 表单校验

      if (this.banner && !/(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?/.test(this.banner)) {
        errMsg.push('图片链接格式有误')
      }

      if (errMsg.length) {
        this.$notify.error({
          title: '表单输入错误',
          message: errMsg[0],
          duration: 0
        })
      }

      // 项目路径检查
      if (this.jsonData.name && this.workSpace) {
        const initCode = await this.$store.dispatchPromise('checkBeforeRun', {
          name: this.jsonData.name,
          workSpace: this.workSpace
        })
        this.handleInitCode(initCode)
        isValidWorkspace = initCode === CREATE_CODE.CHECK_SUCCESS
      }

      return !errMsg.length && isValidWorkspace && this.valid
    },
    handleWorkSpaceClick() {
      this.selectWorkSpace()
    },
    // 处理响应码
    handleInitCode(initCode) {
      if (initCode === CREATE_CODE.CHECK_SUCCESS) return
      switch (initCode) {
        case CREATE_CODE.SUCCESS: {
          this.messageInstance && this.messageInstance.close()
          this.messageInstance = null
          // 保存
          saveGeneratorConfig({
            projectName: this.jsonData.name,
            workSpace: this.workSpace + '/' + this.formData.name,
            banner: this.banner
          })
          this.toast('项目创建成功', '', 'success')
          this.handleReset()
          break
        }
        case CREATE_CODE.INVALID_WORKSPACE_NOT_EMPTY: {
          this.toast('项目创建失败', '项目路径重复，请修改项目名', 'error')
          break
        }
        default: {
          this.handleReset()
        }
      }
    },
    toast(title, msg, type = 'info', isPersistent = false) {
      let opt = {
        title,
        message: msg
      }
      if (isPersistent) {
        opt.duration = 0
      }

      return this.$notify[type](opt)
    },
    handleReset() {
      // 重置表单， 防止重复初始化项目
      this.isWorking = false
      this.banner = ''
      this.$store.dispatch('Schema/init', { schema: this.targetGeneratorConfig })

      // 重置脚手架状态
      this.resetState()
    }
  }
}
</script>


<style scoped lang="less" >
.create-inner {
  width: 100%;
  height: 466px;
  overflow: scroll;
  padding-bottom: 20px;
  box-sizing: border-box;
  padding-right: 24px;
  &__console {
    box-sizing: border-box;
    padding: 20px;
    width: 400px;
    height: 320px;
    color: #767e97;
    background: #f3f4f5;
    border-radius: 4px;

    &-terminal {
      width: 400px;
      height: 320px;
    }
  }
  .workspace_btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    color: #fff;
    padding: 13px 20px;
    background-color: #409eff;
    border-color: #409eff;
  }
}

.create-pop-btn {
  margin-right: 12px;
}
.action-btn {
  border-top: 1px solid #f3f4f5;
  padding-top: 26px;
  display: flex;
  justify-content: flex-end;
  /* float: right; */
}
</style>

