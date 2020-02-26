import fs from 'fs'
import os from 'os'
import path from 'path'
export const homeDir = os.homedir()

export const feflowHomeDir = '.feflow'

export const feflowGeneratorRegex = /@tencent\/generator-(.*)/i

export const feflowHomepath = path.resolve(homeDir, feflowHomeDir)

export const feflowHomePackagePath = path.resolve(homeDir, feflowHomeDir, './package.json')

export const GENERATOR_CONFIG_FILE_NAME = ['schema.config.js', 'schema.json']

// basic functions
export const isExit = path => {
  return fs.existsSync(path)
}

export const getFile = path => {
  if (isExit(path)) {
    const file = fs.readFileSync(path, 'utf-8')
    return file
  }
}

export const getFileByJSON = path => {
  let fileContent = null
  if (isExit(path)) {
    const file = fs.readFileSync(path, 'utf-8')
    try {
      fileContent = JSON.parse(file)
    } catch (error) {
      console.log('read file err', error)
    }
  }
  return fileContent
}

// application

/**
 * 检查feflow根目录是否存在
 */
export const checkFeflowEnv = () => {
  return isExit(feflowHomepath)
}

/**
 * 获取feflow更目录下的依赖
 */
export const getFeflowRootPackage = () => {
  if (isExit(feflowHomePackagePath)) {
    return getFileByJSON(feflowHomePackagePath)
  }
}

/**
 * 获取feflow根目录下的依赖的配置文件
 */
export const getFeflowDependenceConfig = (dependence, configFile = 'package.json') => {
  const dependencePath = path.resolve(feflowHomepath, './node_modules', dependence)
  const dependenceConfigPath = path.resolve(dependencePath, './', configFile)

  if (isExit(dependenceConfigPath)) {
    switch (path.extname(configFile)) {
      case '.json': {
        console.log('load json config', dependenceConfigPath)
        return getFileByJSON(dependenceConfigPath)
      }
      case '.js': {
        let data = null
        try {
          data = require(dependenceConfigPath)
          console.log('load js config', dependenceConfigPath)
        } catch (error) {
          console.log('load js file err', error)
        }
        return data
      }
      default:
        return null
    }
  } else {
    console.log('file path is not exit ', dependenceConfigPath)
  }
}

/**
 *
 * 生成脚手架配置文件
 *
 * @param {string} fileName, 文件名
 * @param {object} config, 配置项
 * @param {object} schema, 脚手架参数
 *
 */
export const generatorConfigFile = (fileName, config, schema) => {
  const filepath = path.resolve(feflowHomepath, fileName + '.js')
  const objTypeMap = {}
  const typeMap = {}

  schema.properties.forEach(prop => {
    const ascription = prop.ascription
    objTypeMap[prop.field] = ascription
    if (!typeMap[ascription]) {
      typeMap[ascription] = true
    }
  })

  const getStringValue = value => {
    const type = typeof value
    if (type === 'boolean') {
      return value
    } else if (type === 'string') {
      return "'" + value + "'"
    }
  }

  if (!isExit(filepath)) {
    const content = [
      `
        const config = {
          ${Object.keys(typeMap).join(': {}, \n\t\t')} : {}
        }
      `
    ]

    Object.keys(config).forEach(key => {
      if (objTypeMap[key]) {
        content.push(`
          config.${objTypeMap[key]}.${key} = ${getStringValue(config[key]) || 0}
        `)
      } else {
        content.push(`
          config.${key} = ${config[key] || 0}
      `)
      }
    })

    content.push(`
      module.exports = config
    `)

    fs.writeFileSync(filepath, content.join('\n'))
  }
  return filepath
}
