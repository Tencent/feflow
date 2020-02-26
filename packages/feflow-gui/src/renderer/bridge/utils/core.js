import shell from 'shelljs'
import { spawn as ProcessSpawn } from 'child_process'

import { curry } from '../../common/utils'

const COMMAND = 'fef'

export const exec = (cmd, ...arg) => {
  if (!cmd) return
  let commandArr = []
  console.log('arg', arg)

  commandArr.push(cmd)
  commandArr.push(...arg)
  console.log('commandArr', commandArr.join(' '))
  return shell.exec(commandArr.join(' '))
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
  init(opt) {
    let arr = []
    Object.keys(opt).forEach(key => {
      arr.push(`--${key}=${opt[key] || false}`)
    })
    return exec(COMMAND, 'init', arr.join(' '))
  }

  spawn(cwd) {
    return spawn(COMMAND)(cwd)
  }
}

export const Feflow = new FeflowCommand()
