import axios from 'axios'
import MarkdownIt from 'markdown-it'
import { camelizeKeys } from 'humps'

const LEGO_URL = 'https://now.qq.com/cgi-bin/now/activity_cms/form_data'
const ACT_ID = 111610303

const markdown = new MarkdownIt()

// 外链
export const outboundRE = /^(https?:|mailto:|tel:)/

// 判断某个地址是否是外链
export function isExternal(path) {
  return outboundRE.test(path)
}

// 根据 <username>/<repo> 的 Git 仓库名获取 repo
export function getRepo(path = '') {
  return path.split('/').pop()
}

// 从 tnpm 上面获取仓库信息
export function getPluginInfoFromTnpm(repo) {
  const url = `http://r.tnpm.oa.com/${repo}/latest`

  return axios.get(url).then(({ data = {} }) => {
    const {
      name = '',
      description = '',
      author = {},
      maintainers = [],
      cnpmPublishTime,
      homepage = '',
      repository = {},
      readme = '',
      version = ''
    } = camelizeKeys(data)
    const displayName = name.split('/').pop()
    const updateTime = new Date(cnpmPublishTime).toLocaleDateString()
    const gitCode =
      homepage || (repository.url && repository.url.replace('git@git.code.oa.com:', 'https://git.code.oa.com/'))
    const readmeHTML = markdown.render(readme)

    const master = getAuthorName({ author, maintainers })

    return {
      name: displayName,
      description,
      master,
      updateTime,
      gitCode,
      version,
      readmeHTML,
      author
    }
  })
}

// 根据名称获取标签
export function getTag(repo) {
  if (/generator/.test(repo)) {
    return 'generator'
  } else if (/builder/.test(repo)) {
    return 'plugin'
  } else if (/devkit/.test(repo)) {
    return 'devkit'
  } else {
    return 'plugin'
  }
}

// 根据标签获取标签文本
export function getTagTextById(lang, tag) {
  switch (tag) {
    case 'all':
      return lang === 'en-US' ? '全部' : 'All'

    case 'generator':
      return lang === 'en-US' ? '脚手架' : 'Generator'

    case 'builder':
      return lang === 'en-US' ? '构建器' : 'Builder'

    case 'plugin':
      return lang === 'en-US' ? '插件' : 'Plugin'

    default:
      return ''
  }
}

// 根据 tnpm 返回的信息找到仓库作者
export function getAuthorName({ author = {}, maintainers = [] }) {
  const { name = '' } = author
  const [maintainer = {}] = maintainers

  return name || maintainer.name || ''
}

export const formatPluginList = (plugins = []) => {
  const pluginsMap = {}
  const pluginList = []
  plugins.forEach(({ key, value }) => {
    const pkgName = key.split('/')[1]
    pluginsMap[pkgName] = value
    pluginList.push({ key, value, pkgName })
  })
  return { pluginsMap, pluginList }
}

export const getPluginListFromLego = () => {
  return axios.get(LEGO_URL, { params: { actid: ACT_ID } })
}
