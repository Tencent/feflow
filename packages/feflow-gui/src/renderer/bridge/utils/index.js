import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

import { FEFLOW_HOME_PATH, FEFLOW_HOME_PACKAGE_PATH, FEFLOW_GENERATOR_CONFIG_HOME } from '../constants'

// basic functions
export const isExit = path => {
  return fs.existsSync(path)
}

export const dirExists = filepath => {
  const stat = fs.statSync(filepath)
  return stat.isDirectory()
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
  return isExit(FEFLOW_HOME_PATH)
}

/**
 * 获取feflow更目录下的依赖
 */
export const getFeflowRootPackage = () => {
  if (isExit(FEFLOW_HOME_PACKAGE_PATH)) {
    return getFileByJSON(FEFLOW_HOME_PACKAGE_PATH)
  }
}

/**
 * 获取feflow根目录下的依赖的配置文件
 */
export const getFeflowDependenceConfig = (dependence, configFile = 'package.json') => {
  const dependencePath = path.resolve(FEFLOW_HOME_PATH, './node_modules', dependence)
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

export function safeDump(obj, path) {
  let doc
  try {
    doc = yaml.safeDump(obj, {
      styles: {
        '!!null': 'canonical'
      },
      sortKeys: true
    })
  } catch (e) {
    throw new Error(e)
  }

  return fs.writeFileSync(path, doc, 'utf-8')
}

export function parseYaml(path) {
  let config

  if (fs.existsSync(path)) {
    try {
      config = yaml.safeLoad(fs.readFileSync(path, 'utf8'))
    } catch (e) {
      throw new Error(e)
    }
  }

  return config
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
  const filepath = path.resolve(FEFLOW_GENERATOR_CONFIG_HOME, fileName + '.js')
  const objTypeMap = {}
  const typeMap = {}
  let hasAscription = false

  schema.properties.forEach(prop => {
    const ascription = prop.ascription
    if (ascription) {
      hasAscription = true
      objTypeMap[prop.field] = ascription
      if (!typeMap[ascription]) {
        typeMap[ascription] = true
      }
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
    const content = []

    hasAscription
      ? content.push(`
      const config = {
        ${Object.keys(typeMap).join(': {}, \n\t\t')} : {}
      }
    `)
      : content.push('const config = {}')

    Object.keys(config).forEach(key => {
      if (objTypeMap[key]) {
        content.push(`
          config.${objTypeMap[key]}.${key} = "${getStringValue(config[key]) || 0}"
        `)
      } else {
        content.push(`
          config.${key} = "${config[key] || 0}"
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
