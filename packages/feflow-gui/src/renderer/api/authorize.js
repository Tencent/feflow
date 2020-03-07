/**
 * API request for authorize
 */
import http from '@/common/request.js';
import config from '@/config/index.js';

export default {
    getLoginUser(params) {
        return http.post(`http://${config.hostDomain}/ts:auth/tauth/info.ashx`, params);
    }
};
