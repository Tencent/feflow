import shell from 'shelljs'
import { spawn as ProcessSpawn } from 'child_process'

import { curry } from '../../common/utils'

import { dirExists } from './index.js'
import { CREATE_CODE } from '../constants.js'

const COMMAND = 'fef'

export const exec = (cmd, ...arg) => {
  if (!cmd) return Promise.reject(new Error('no cmd'))
  let commandArr = []
  console.log('arg', arg)

  commandArr.push(cmd)
  commandArr.push(...arg)
  console.log('commandArr', commandArr.join(' '))

  return new Promise((resolve, reject) => {
    shell.exec(commandArr.join(' '), function(code) {
      console.log('Exit code:', code)
      resolve(code)
    })
  })
}

export const spawn = curry(function (cmd, cwd, arg) {
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
  init({ param, generator }, workSpace) {
    let arr = []

    if (!generator) {
      // 未指定脚手架
      return Promise.resolve(CREATE_CODE.EMPTY_GENERATOR)
    }
    if (!dirExists(workSpace)) {
      // 工作目录不存在
      return Promise.resolve(CREATE_CODE.INVALID_WORKSPACE)
    }

    arr.push(`--generator=${generator}`)

    if (typeof param === 'string') {
      // 直接传入配置文件路径
      arr.push(`--config=${param}`)
    } else {
      arr.push(`--config='${JSON.stringify(param)}'`)
    }

    shell.cd(workSpace)

    return exec(COMMAND, 'init', arr.join(' '))
  }

  spawn(cwd) {
    return spawn(COMMAND)(cwd)
  }
}

export const Feflow = new FeflowCommand()
