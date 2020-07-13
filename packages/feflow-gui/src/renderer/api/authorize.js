/**
 * API request for authorize
 */
import http from '@/common/request.js';
import config from '@/config/index.js';

export default {
    getLoginUser(params) {
        return http.post('http://gui.oa.com/ts:auth/tauth/info.ashx', params);
    },

    checkAuth(params) {
        return http.get(`http://${config.hostDomain}/teflow/checkAuth`, params);
    },

    createConfig(params) {
        return http.post(`http://${config.hostDomain}/teflow/createConfig`, params);
    },
};
