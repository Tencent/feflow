import {
  checkFeflowEnv,
  getFeflowRootPackage,
  feflowGeneratorRegex,
  getFeflowDependenceConfig,
  generatorConfigFile,
  GENERATOR_CONFIG_FILE_NAME,
  feflowHomeConfigPath,
  parseYaml,
  safeDump,
  dirExists,
  isExit
} from './utils'
import { Feflow } from './utils/core'
import path from 'path'
import { CREATE_CODE } from './constants'
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
        return feflowGeneratorRegex.test(dependence)
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
  return 0
}
/**
 * 生成项目支持的自定义命令
 */
export const loadProjectCommand = projectPath => {
  return Feflow.spawn(projectPath)
}

export const saveGeneratorConfig = (projectName, workSpace) => {
  const doc = parseYaml(feflowHomeConfigPath)
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
    doc.projects[projectName] = {
      name: projectName,
      path: workSpace
    }

    update = Object.assign({}, doc)
  }

  safeDump(update, feflowHomeConfigPath)
}
