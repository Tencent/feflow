import shell from 'shelljs'
import { spawn as ProcessSpawn } from 'child_process'

import { curry } from '../../common/utils'

import { dirExists } from './index.js'
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
  init(opt, workSpace) {
    let arr = []

    Object.keys(opt).forEach(key => {
      arr.push(`--${key}=${opt[key] || false}`)
    })

    dirExists(workSpace) && shell.cd(workSpace)
    return exec(COMMAND, 'init', arr.join(' '))
  }

  spawn(cwd) {
    return spawn(COMMAND)(cwd)
  }
}

export const Feflow = new FeflowCommand()
