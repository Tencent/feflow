/**
 * 项目主页相关 API 管理
*/
import http from '@/common/request.js';
import config from '@/config/index.js';

/**
 * 统一错误提示
 */
function errorHandler(res) {
  const { errcode, data, errmsg } = res
  if (errcode === 0 && data) {
    return data
  } else {
      throw new Error(errmsg)
  }
}

export default {
  async getTagList({ groupName, projectName }) {
    const params = {
      groupName,
      projectName
    }

    return http.get(`http://${config.hostDomain}/project-docs/getTagList`, params)
      .then(errorHandler)
  },

  async getDocList({ groupName, projectName }) {
    const params = {
      groupName,
      projectName
    }

    return http.get(`http://${config.hostDomain}/project-docs/getDocList`, params)
      .then(errorHandler)
  },

  async createTag({ groupName, projectName, tagName }) {
    const params = {
      groupName,
      projectName,
      tagName
    }

    return http.post(`http://${config.hostDomain}/project-docs/createTag`, params)
      .then(errorHandler)
  },

  async deleteTag({ tagId }) {
    const params = {
      tagId
    }

    return http.post(`http://${config.hostDomain}/project-docs/deleteTag`, params)
      .then(errorHandler)
  },

  async createDoc({ tagId, userName, docType, docName, docDesc, docLink, docIcon }) {
    const params = {
      tagId,
      docType,
      userName,
      docName,
      docDesc,
      docLink,
      docIcon
    }
    return http.post(`http://${config.hostDomain}/project-docs/createDoc`, params)
      .then(errorHandler)
  },

  async updateDoc({ docId, userName, docType, docName, docDesc, docLink, docIcon }) {
    const params = {
      docId,
      docType,
      userName,
      docName,
      docDesc,
      docLink,
      docIcon
    }
    return http.post(`http://${config.hostDomain}/project-docs/updateDoc`, params)
      .then(errorHandler)
  },

  async deleteDoc({ docId }) {
    const params = {
      docId
    }

    return http.post(`http://${config.hostDomain}/project-docs/deleteDoc`, params)
      .then(errorHandler)
  }
}
