import shell from 'shelljs'

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

class FeflowCommand {
  init(opt) {
    let arr = []
    Object.keys(opt).forEach(key => {
      arr.push(`--${key}=${opt[key]}`)
    })
    return exec(COMMAND, 'init', arr.join(' '))
  }
}

export const Feflow = new FeflowCommand()
