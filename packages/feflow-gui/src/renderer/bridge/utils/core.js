import shell from 'shelljs'
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

class FeflowCommand {
  init(opt, workSpace) {
    let arr = []

    Object.keys(opt).forEach(key => {
      arr.push(`--${key}=${opt[key] || false}`)
    })

    dirExists(workSpace) && shell.cd(workSpace)
    return exec(COMMAND, 'init', arr.join(' '))
  }
}

export const Feflow = new FeflowCommand()
