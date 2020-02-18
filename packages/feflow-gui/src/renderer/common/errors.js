/* eslint-disable */
/**
 * 后台常用错误码定义
 */

// HTTP status error
const status = {
  400: '请求格式错误',
  401: '登录态失效',
  403: '无提交权限，如有问题请联系微信游戏助手',
  500: '服务器错误，请稍后再来',
  503: '服务器繁忙，请稍后再来'
}

const code = {
  ECMCGI_CHKLOGIN: 6100
}

// optional, user friendly tips
const message = {
  ECMCGI_CHKLOGIN: '您长时间未操作，请刷新页面重新登录'
}

let nameMapping = {}
let init = () => {
  Object.keys(code).forEach(name => {
    nameMapping[code[name]] = name
  })
}
init()

export default {
  status,
  code,
  message,

  getMessage (code) {
    let message = [],
      codeName = nameMapping[code]

    // 默认展示：前端提示语 （返回码名）
    // 未定义前端提示语：（返回码名）
    // 什么都没定义：原始返回码
    if (codeName) {
      this.message[codeName] && message.push(this.message[codeName])
      message.push(`(${codeName || code})`)
    } else {
      message.push(code)
    }

    return message.join(' ')
  }
}
