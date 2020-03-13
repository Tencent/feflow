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

class FeflowCommand {
  init({ opt, workSpace }) {
    const { param, generator } = opt
    let arr = []

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
    arr.push(COMMAND)

    arr.push('init')

    arr.push(`--generator=${generator}`)

    if (typeof param === 'string') {
      // 直接传入配置文件路径
      arr.push(`--config=${param}`)
    } else {
      arr.push(`--config='${JSON.stringify(param)}'`)
    }

    arr.push('--color')

    shell.cd(workSpace)

    console.log('arr', arr.join(' '))

    return shell.exec(arr.join(' '), { async: true })
  }

  spawn(cwd) {
    return spawn(COMMAND)(cwd)
  }
}

export const Feflow = new FeflowCommand()
