import {
  checkFeflowEnv,
  getFeflowRootPackage,
  getFeflowDependenceConfig,
  generatorConfigFile,
  parseYaml,
  safeDump,
  dirExists,
  isExit,
  getFileByJSON
} from './utils'
import { Feflow } from './utils/core'
import path from 'path'
import {
  CREATE_CODE,
  FEFLOW_GENERATOR_REGEX,
  FEFLOW_GENERATOR_AND_PLUGIN_REGEX,
  GENERATOR_CONFIG_FILE_NAME,
  FEFLOW_HOME_CONFIG_PATH,
  FEFLOW_PROJECT_CONFIG_NAME,
  FEFLOW_PROJECT_DEVKIT_CONFIG_NAME,
  FEFLOW_GENERATOR_CONFIG_HOME,
  FEFLOW_WHISTLE_JS_PATH
} from './constants'
import { dialog } from 'electron'
import fs from 'fs'
import shell from 'shelljs'

/**
 * 载入全局脚手架
 */
export const loadGenerator = () => {
  return getFeflowHomeDepencies().then(dependencies => {
    let generators = []
    // 筛选脚手架
    generators = dependencies.filter(dependence => {
      return FEFLOW_GENERATOR_REGEX.test(dependence)
    })

    // 获取脚手架配置
    // 优先级  js > json
    if (generators.length) {
      generators.forEach(gen => {
        for (const configName of GENERATOR_CONFIG_FILE_NAME) {
          if (!generatorConfigMap[gen]) {
            generatorConfigMap[gen] = getFeflowDependenceConfig(gen, configName)
          }
        }
      })
    }

    return generators
  })
}

/**
 *
 * 载入全局脚手架和插件
 */
export const loadLocalPluginAndGenerator = () => {
  return getFeflowHomeDepencies().then(dependencies => {
    let generators = []
    // 筛选脚手架
    generators = dependencies.filter(dependence => {
      return FEFLOW_GENERATOR_AND_PLUGIN_REGEX.test(dependence)
    })

    return generators
  })
}

const getFeflowHomeDepencies = () => {
  return new Promise(resolve => {
    let packageContent = null
    let dependencies = []

    // 先检查根目录是否存在
    if (checkFeflowEnv()) {
      // 获取Feflow项目依赖
      packageContent = getFeflowRootPackage()
      if (!packageContent) resolve(dependencies)
      dependencies = Object.keys(packageContent.dependencies)
    }

    resolve(dependencies)
  }).catch(e => {
    console.log('get feflow home depencies err', e)
  })
}

/**
 * 生成配置文件
 */
export const buildGeneratorConfig = ({ config, genConfig }) => {
  const genName = genConfig.gererator || 'generator-default'
  const fileName = genName + '-' + (Date.now() + '').slice(4)

  if (!isExit(FEFLOW_GENERATOR_CONFIG_HOME)) {
    shell.mkdir(FEFLOW_GENERATOR_CONFIG_HOME)
  }

  const localFilePath = generatorConfigFile(fileName, config, genConfig)
  return localFilePath
}

/**
 *
 * @param {*} opt
 * @param {*} workSpace
 */
export const runGenerator = ({ config, generator, workSpace }) => {
  const opt = {}

  opt.param = config
  opt.generator = generator

  return Feflow.init({ opt, workSpace })
}

export const checkBeforeRunGenerator = ({ name, workSpace }) => {
  const projectPath = path.resolve(workSpace, name)

  if (isExit(projectPath) && dirExists(projectPath)) {
    // 项目已存在
    return CREATE_CODE.INVALID_WORKSPACE_NOT_EMPTY
  }
  return CREATE_CODE.CHECK_SUCCESS
}

export const loadFeflowConfigFile = () => {
  return parseYaml(FEFLOW_HOME_CONFIG_PATH)
}

export const saveGeneratorConfig = ({ projectName, workSpace, banner }) => {
  const doc = loadFeflowConfigFile()
  let update = {}
  if (!doc.projects) {
    update = Object.assign({}, doc, {
      projects: {
        [projectName]: {
          name: projectName,
          path: workSpace,
          banner
        }
      }
    })
  } else {
    // 覆盖/新增
    doc.projects[projectName] = {
      name: projectName,
      path: workSpace,
      banner
    }

    update = Object.assign({}, doc)
  }

  safeDump(update, FEFLOW_HOME_CONFIG_PATH)
}

const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file) {
      const curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

export const deleteProject = (name, path) => {
  const doc = loadFeflowConfigFile()
  delete doc.projects[name]
  const update = Object.assign({}, doc)
  safeDump(update, FEFLOW_HOME_CONFIG_PATH)
  deleteFolderRecursive(path)
}

/**
 * 【项目模块适用】加载项目下的 feflow 配置文件
 */
export const loadProjectFeflowConfigFile = projectPath => {
  return getFileByJSON(path.resolve(projectPath, FEFLOW_PROJECT_CONFIG_NAME))
}

/**
 * 【项目模块适用】解析项目开发套件支持的命令列表
 */
export const fetchProjectDevkitCommandList = projectPath => {
  // 解析 .feflowrc.json，获取命令列表
  const feflowrcJSON = loadProjectFeflowConfigFile(projectPath)
  const { commands = {} } = feflowrcJSON.devkit

  // 解析命令
  const commandList = Object.keys(commands).map(name => {
    const { builder, options } = commands[name]

    // 可运行命令拼接
    const optionList =
      options.length !== 0
        ? Object.keys(options)
            .map(optKey => `--${optKey}=${options[optKey]}`)
            .join(' ')
        : ''
    const command = `fef ${name} ${optionList}`

    // 解析脚手架依赖，从 devkit.json 中获取命令说明
    const [dependency, devkitCommandKey] = builder.split(':')
    const deckitJSONPath = path.resolve(`${projectPath}/node_modules/${dependency}`, FEFLOW_PROJECT_DEVKIT_CONFIG_NAME)
    const devkitJSON = getFileByJSON(deckitJSONPath)
    const { description } = devkitJSON.builders[devkitCommandKey]

    return {
      name,
      builder,
      options,
      command,
      description
    }
  })

  return commandList
}

/**
 * 【项目模块适用】加载项目支持的自定义命令
 */
export const spawnProjectCommand = projectPath => {
  return Feflow.spawn(projectPath)
}

/**
 * 【项目模块适用】管理项目命令历史
 */
export class ProjectCommandHistory {
  constructor(projectName) {
    this.projectName = projectName
  }
  /**
   * 获取项目命令历史
   * @description 不传参数时，默认获取全部项目命令；
   * @param {String} [commandName = ''] 项目命令名称
   */
  get(commandName = '') {
    const conf = loadFeflowConfigFile()
    this.commandHistory = conf.projects[this.projectName].commandHistory || {}

    let history = this.commandHistory
    try {
      if (commandName) {
        return [].concat(history[commandName])
      }
    } catch (err) {
      return []
    }

    return { ...history }
  }
  /**
   * 更新项目命令历史
   * @description 覆盖式保存命令历史，仅保存最近 10 次更新
   * @param {String} projectName
   * @param {String} commandName
   * @param {String} commandContent
   */
  update(commandName, commandContent) {
    const commandHistory = this.get()
    if (!commandHistory[commandName]) commandHistory[commandName] = []

    // 已在历史记录中，不保存
    let history = commandHistory[commandName]
    const lastLen = history.length
    if (history.includes(commandContent)) return

    // 保存
    history.push(commandContent)
    // 若已满 10 次，取后 10 个
    if (lastLen >= 10) {
      history.splice(0, 1)
    }

    // 更新 .fef 配置
    const conf = loadFeflowConfigFile()
    conf.projects[this.projectName].commandHistory = { ...commandHistory }

    safeDump(conf, FEFLOW_HOME_CONFIG_PATH)
  }
}

export const openDialogToGetDirectory = () => {
  return new Promise(resolve => {
    dialog.showOpenDialog(
      {
        properties: ['openFile', 'openDirectory']
      },
      function(files) {
        resolve(files)
      }
    )
  })
}

export const getFefProjectProxy = projectName => {
  const doc = loadFeflowConfigFile()
  if (!doc.projects || !doc.projects[projectName]) {
    return {}
  } else {
    return doc.projects[projectName].proxy || {}
  }
}

export const updateFefProjectProxy = (projectName, proxyConfig) => {
  // 更新 .fef project配置
  const conf = loadFeflowConfigFile()
  conf.projects[projectName].proxy = proxyConfig
  safeDump(conf, FEFLOW_HOME_CONFIG_PATH)
}

/**
 * 【项目模块适用】解析项目开发套件支持的命令列表
 */
export const getDefaultProjectProxy = projectPath => {
  // 解析 .feflowrc.json，获取基础proxy
  const feflowrcJSON = loadProjectFeflowConfigFile(projectPath)
  return feflowrcJSON.proxy || []
}

export const updateDefaultProjectProxy = (projectPath, proxyConfig) => {
  // 更新 .fef project配置
  const feflowrcJSON = loadProjectFeflowConfigFile(projectPath)
  const filePath = path.resolve(projectPath, FEFLOW_PROJECT_CONFIG_NAME)
  console.log(feflowrcJSON)
  feflowrcJSON['proxy'] = proxyConfig
  fs.writeFileSync(filePath, JSON.stringify(feflowrcJSON))
}

export const generatorWhistleJS = proxyConfig => {
  let filepath = FEFLOW_WHISTLE_JS_PATH
  const content = `
      module.exports = ${JSON.stringify(proxyConfig)}
    `
  fs.writeFileSync(filepath, content)
}
