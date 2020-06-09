/* eslint-disable camelcase */

import http from '@/common/request.js';
import qs from 'qs';
const { encrypt, getPwdCode } = require('@tencent/aegis-des');

// 在管理后台获取到的密钥
const apiKey = 'cH60tFcKKEJP3dG1IH4OGw==ada102c7';

const loginName = 'feflow_virtual';

const url = 'https://aegis.ivweb.io';
const creditialData = { isFresh: 0, loginName, apiKey: encrypt(apiKey, loginName) };

export async function getCredential() {
    let res = await http.post(`${url}/api/interface/getApiToken`, qs.stringify(creditialData), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'rtx': 'feflow_vitual'
        }
    });
    const { api_time, api_token } = res.data;
    return {
        'auth': getPwdCode(apiKey, api_token, +api_time), // 生成授权码
        'apiToken': api_token,
        'apiTime': api_time,
        'rtx': global.username
    };
}
export async function getPvByDate(aegisId, startDate, endDate, credential) {
    // 获取凭据 并添加到header中
    credential = credential || await getCredential();
    // console.log(credential);
    // 获取自己的项目列表
    const result = await http.get(
        `${url}/api/interface/pv/countByDay?proId=${aegisId}&startDate=${startDate}&endDate=${endDate}`,
        {},
        {
            headers: {
                ...credential
            }
        }
    )
    return result
}

export async function getUvByDate(aegisId, startDate, endDate, credential) {
    // 获取凭据 并添加到header中
    credential = credential || await getCredential()
    // 获取自己的项目列表
    const result = await http.get(
        `${url}/api/interface/uv/countByDay?proId=${aegisId}&startDate=${startDate}&endDate=${endDate}`,
        {},
        {
            headers: {
                ...credential
            }
        }
    )
    return result
}

export async function getJsError(aegisId, startDate, credential) {
    // 获取凭据 并添加到header中
    credential = credential || await getCredential()
    // 获取自己的项目列表
    const result = await http.get(
        `${url}/api/interface/log/jsErr?proId=${aegisId}&startDate=${startDate}`,
        {},
        {
            headers: {
                ...credential
            }
        }
    )
    return result
}

export async function addUser(postData, credential) {
    // 获取凭据 并添加到header中
    credential = credential || await getCredential()
    let result = await http.post(`${url}/api/api/interface/pro/addUser`, postData, {
        headers: {
            ...credential
        }
    });
    return result;
}
