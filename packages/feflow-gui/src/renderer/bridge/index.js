import {
  checkFeflowEnv,
  getFeflowRootPackage,
  feflowGeneratorRegex,
  getFeflowDependenceConfig,
  generatorConfigFile,
  GENERATOR_CONFIG_FILE_NAME
} from './utils'
import { Feflow } from './utils/core'
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

export const runGenerator = (param, workSpace) => {
  return Feflow.init(param, workSpace)
}
