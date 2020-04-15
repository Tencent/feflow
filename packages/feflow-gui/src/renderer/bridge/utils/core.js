import shell from 'shelljs'
import { spawn as ProcessSpawn } from 'child_process'

import { curry } from '../../common/utils'

import { dirExists, isExit } from './index.js'
import { CREATE_CODE, DEFAULT_WORKSPACE } from '../constants.js'

const COMMAND = 'fef'

export const spawn = curry(function(cmd, cwd, arg) {
  if (!cmd) onStderr(`${cmd} 命令执行错误`)

  const child = ProcessSpawn(
    cmd,
    [
      ...arg,
      '--color' // 保留颜色信息
    ],
    {
      cwd,
      stdio: 'pipe' // 保留颜色信息的同时需要改变输入输出形式
    }
  )
  child.stdout.setEncoding('utf-8')

  return child
})

const getCommandLine = (subCommand, arg) => {
  let arr = []
  let keepParam = ['--color', '--disable-check']

  arr.push(COMMAND)
  arr.push(subCommand)
  arr.push(...arg)
  arr.push(...keepParam)

  const commandLine = arr.join(' ')

  console.log('commandLine', commandLine)
  return commandLine
}

class FeflowCommand {
  init({ opt, workSpace }) {
    const { param, generator } = opt

    // 创建默认工作目录
    !isExit(DEFAULT_WORKSPACE) && shell.mkdir(DEFAULT_WORKSPACE)

    if (!generator) {
      // 未指定脚手架
      return CREATE_CODE.EMPTY_GENERATOR
    }
    if (!dirExists(workSpace)) {
      // 工作目录不存在
      return CREATE_CODE.INVALID_WORKSPACE
    }
    let params = []
    let commandLine = ''

    params.push(`--generator=${generator}`)

    if (typeof param === 'string') {
      // 直接传入配置文件路径
      params.push(`--config=${param}`)
    } else {
      params.push(`--config='${JSON.stringify(param)}'`)
    }

    commandLine = getCommandLine('init', params)

    shell.cd(workSpace)

    return shell.exec(commandLine, { async: true })
  }

  spawn(cwd) {
    return spawn(COMMAND)(cwd)
  }
  install(plugin) {
    let commandLine = getCommandLine('install', [plugin])
    return shell.exec(commandLine, { async: true })
  }
  unInstall(plugin) {
    let commandLine = getCommandLine('uninstall', [plugin])
    return shell.exec(commandLine, { async: true })
  }
}

export const Feflow = new FeflowCommand()
