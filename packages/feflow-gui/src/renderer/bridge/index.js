import {
  checkFeflowEnv,
  getFeflowRootPackage,
  getFeflowDependenceConfig,
  generatorConfigFile,
  parseYaml,
  safeDump,
  dirExists,
  isExit
} from './utils'
import { Feflow } from './utils/core'
import path from 'path'
import { CREATE_CODE, FEFLOW_GENERATOR_REGEX, GENERATOR_CONFIG_FILE_NAME, FEFLOW_HOME_CONFIG_PATH } from './constants'
import { dialog } from 'electron'

/**
 * 载入全局脚手架
 */
export const loadGenerator = () => {
  return new Promise(resolve => {
    let packageContent = null
    let generators = []
    let generatorConfigMap = {}

    // 先检查根目录是否存在
    if (checkFeflowEnv()) {
      // 获取Feflow项目依赖
      packageContent = getFeflowRootPackage()
      if (!packageContent) resolve(generators)

      const dependencies = Object.keys(packageContent.dependencies)

      // 筛选脚手架
      generators = dependencies.filter(dependence => {
        return FEFLOW_GENERATOR_REGEX.test(dependence)
      })

      // 获取脚手架配置
      // 优先级  js > json
      generators.forEach(gen => {
        for (const configName of GENERATOR_CONFIG_FILE_NAME) {
          if (!generatorConfigMap[gen]) {
            generatorConfigMap[gen] = getFeflowDependenceConfig(gen, configName)
          }
        }
      })
    }

    resolve({ list: generators, configMap: generatorConfigMap })
  }).catch(e => {
    console.log('loadGenerator err', e)
  })
}

/**
 * 生成配置文件
 */
export const buildGeneratorConfig = ({ config, genConfig }) => {
  const genName = genConfig.gererator || 'generator-default'
  const fileName = genName + '-' + (Date.now() + '').slice(4)
  const localFilePath = generatorConfigFile(fileName, config, genConfig)
  return localFilePath
}

/**
 *
 * @param {*} opt
 * @param {*} workSpace
 */
export const runGenerator = (opt, workSpace) => {
  return Feflow.init(opt, workSpace)
}

export const checkBeforeRunGenerator = ({ name, workSpace }) => {
  const projectPath = path.resolve(workSpace, name)

  if (isExit(projectPath) && dirExists(projectPath)) {
    // 项目已存在
    return CREATE_CODE.INVALID_WORKSPACE_NOT_EMPTY
  }
  return CREATE_CODE.CHECK_SUCCESS
}
/**
 * 生成项目支持的自定义命令
 */
export const loadProjectCommand = projectPath => {
  return Feflow.spawn(projectPath)
}

export const loadFeflowConfigFile = () => {
  return parseYaml(FEFLOW_HOME_CONFIG_PATH)
}

export const saveGeneratorConfig = (projectName, workSpace) => {
  const doc = loadFeflowConfigFile();
  let update = {}
  if (!doc.projects) {
    update = Object.assign({}, doc, {
      projects: {
        [projectName]: {
          name: projectName,
          path: workSpace
        }
      }
    })
  } else {
    // 覆盖/新增
    doc.projects[projectName] = {
      name: projectName,
      path: workSpace
    }

    update = Object.assign({}, doc)
  }

  safeDump(update, FEFLOW_HOME_CONFIG_PATH)
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
