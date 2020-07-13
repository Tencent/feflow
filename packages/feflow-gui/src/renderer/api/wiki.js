/**
 * 项目主页相关 API 管理
 */
import http from '@/common/request.js';
import config from '@/config/index.js';

const baseUrl = `http://${config.hostDomain}/wiki`;

/**
 * 统一错误提示
 */
function errorHandler(res) {
  const { errcode, data, errmsg } = res;
  if (errcode === 0 && data) {
    return data;
  }
  throw new Error(errmsg);
}

export default {
  /**
     * 获取维基内容
     * @param {Object} param 参数
     * @param {Object} param.groupName  所属团队
     * @param {Object} [param.projectName]  所属级别（项目），可选
     */
  async getDocList({ groupName, projectName }) {
    const params = {
      groupName,
      projectName,
    };

    return http.get(`${baseUrl}/getDocList`, params).then(errorHandler);
  },

  async createDoc({ tagName, userName, groupName, projectName, docName, docDesc, docLink }) {
    const params = {
      tagName,
      groupName,
      projectName,
      userName,
      docName,
      docDesc,
      docLink,
    };

    return http.post(`${baseUrl}/createDoc`, params).then(errorHandler);
  },

  async updateDoc({ docId, userName, tagName, projectName, docName, docDesc, docLink }) {
    const params = {
      docId,
      userName,
      tagName,
      projectName,
      docName,
      docDesc,
      docLink,
    };
    return http.post(`${baseUrl}/updateDoc`, params).then(errorHandler);
  },

  async deleteDoc({ docId }) {
    const params = {
      docId,
    };

    return http.post(`${baseUrl}/deleteDoc`, params).then(errorHandler);
  },
};
