/**
 * 基于 axios 做 Restful 封装后使用，保持 Promise 特性。优化点：
 * 1. 统一入参；
 * 2. 增加切面钩子，方便统一参数处理；
 */
import axios from 'axios';
import errors from '@/common/errors';
import { remote } from 'electron';

const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080/'
  : `http://localhost:${remote.app.guiPort}/`;

console.log('winURL', winURL);

// 抛出切面，如果return false，将会中断后续执行
const requestConfig = {
  beforeSend: null,
  afterReceive: null,
};

requestConfig.afterReceive = (response, originalResponse, options) => {
  let code;

  if (typeof response.code !== 'undefined') {
    // eslint-disable-next-line prefer-destructuring
    code = response.code;
  } else if (typeof response.errcode !== 'undefined') {
    code = response.errcode;
  } else if (typeof response.ret !== 'undefined') {
    code = response.ret;
  } else {
    code = null;
  }

  if (code !== 0 && code !== null) {
    options.ignoreError !== true && console.error(errors.getMessage(code));
    return false;
  }
};

const sucCall = (response, options) => {
  // 将jsonp转化为xhr的数据结构，支持 jsonp({...}) 和 jsonp([...])
  if (typeof response.data === 'string') {
    const matches = response.data.match(/(\s*(?:{|\[)[\s\S]*(?:}|\])\s*)/);

    if (matches && matches.length > 1) {
      const jsonString = String(matches[1]).trim();

      try {
        response.data = JSON.parse(jsonString);
      } catch (exception) {
        // C(`JSON Compatible mode (${exception.message}): ${response.data}`)
        // borrowed from jQuery 1.11.2
        let requireNonComma;
        let depth = null;

        // eslint-disable-next-line no-useless-escape
        const rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

        // Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
        // after removing valid tokens
        // eslint-disable-next-line
        jsonString
                    && !jsonString
                      .replace(rvalidtokens, (
                        token,
                        comma,
                        open,
                        close,
                      ) => {
                        // Force termination if we see a misplaced comma
                        if (requireNonComma && comma) {
                          depth = 0;
                        }

                        // Perform no more replacements after returning to outermost depth
                        if (depth === 0) {
                          return token;
                        }

                        // Commas must not follow "[", "{", or ","
                        requireNonComma = open || comma;

                        // Determine new depth
                        // array/object open ("[" or "{"): depth += true - false (increment)
                        // array/object close ("]" or "}"): depth += false - true (decrement)
                        // other cases ("," or primitive): depth += true - true (numeric cast)
                        depth += !close - !open;

                        // Remove this token
                        return '';
                      })
                      .trim()
          // eslint-disable-next-line no-new-func
          ? (response.data = Function(`return ${jsonString}`)())
          : null;
      }
    }
  }

  // 此处去掉了 data 以外的信息，简化结果，其余控制信息仅做全局统一处理。
  const result = response.headers && response.status ? response.data : response;

  if (requestConfig.afterReceive) {
    try {
      requestConfig.afterReceive.call(
        null,
        result,
        response,
        options,
      );
    } catch (error) {
      throw error;
    }
  }

  // 有的 response 不规范，可能不包含 data 。。。，补全一个
  !result.data && (result.data = {});

  return result;
};

const errCall = (error, options) => {
  if (options.ignoreError !== true) {
    // 处理HTTP错误
    if (error && (error.response || '').status) {
      const { status } = error.response;

      // 做一个异步，让这个提示最优先
      setTimeout(() => {
        console.error(`HTTP ${status} ${
          errors.status[status]
            ? `: ${errors.status[status]}`
            : ''
        }`);
      }, 0);

      // 如果是401，则识别跳转地址
      // header的key会被转化为小写
      if (status === 401) {
        console.log(401, location.href);
        const origin = location.origin.replace(
          // eslint-disable-next-line no-useless-escape
          /:\/\/[^\/]+/,
          '://' + 'gui.oa.com',
        );
        setTimeout(() => {
          const url = `${origin}/_sp_login_/?url=${
            winURL
          }`;
          console.log(194, url);
          // window.open(`http://passport.oa.com/modules/passport/signin.ashx?url=${encodeURIComponent(
          //     url
          // )}`)
          location.href = `http://passport.oa.com/modules/passport/signin.ashx?url=${encodeURIComponent(url)}`;
        }, 500);
      }

      return { errcode: status, errmsg: error.toString() };
    }
    // 做一个异步，让这个提示最优先
    setTimeout(() => {
      console.error(error.toString());
    }, 0);

    // 520 stands for unknow error
    return { errcode: 520, errmsg: error.toString() };
  }

  throw error;
};

const request = function (options) {
  let { url } = options;

  url = url.replace(/\?.*$/, '');

  // 跨域需要设置 withCredentials，以发送 cookie @todo 安全考虑
  const currentHost =        location.host + (location.port ? `:${location.port}` : '');
  // eslint-disable-next-line no-useless-escape
  const requestHostMatches = url.match(/^(?:https?:)?\/\/([^\/]+)/);
  if (
    requestHostMatches
        && requestHostMatches.length > 1
        && currentHost !== requestHostMatches[1]
  ) {
    options.withCredentials = true;
  }

  // 捕获request
  axios.interceptors.request.use(
    config => config,
    (error) => {
      console.error(`network error: ${error}`);
      return Promise.reject(error);
    },
  );

  // 捕获response
  axios.interceptors.response.use(
    response => sucCall(response, options),
    error => errCall(error, options),
  );

  // 公司的smartgate 是通过header中的X-Requested-With来判断是否为ajax请求的，如果是ajax，则返回HTTP401；否则就直接HTTP 302跳到登录页。
  // http://km.oa.com/group/11831/articles/show/321569
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  // 只要beforeSend 不阻断，则可发起请求
  return requestConfig.beforeSend
        && requestConfig.beforeSend.call(null, axios)
    ? null
    : axios(options);
};

// 以 RESTful 形式封装，统一入参结构 (url, data, options)
export default {
  request,
  config: requestConfig,

  get(url, data, options) {
    let params = data;

    if (data && typeof data === 'object') {
      // 递归删除传值为空的参数
      const removeNullValue = (params) => {
        if (params.constructor === Object) {
          Object.keys(params).forEach((key) => {
            if (params[key] === '' || params[key] === null) {
              delete params[key];
            } else if (typeof params[key] === 'object') {
              removeNullValue(params[key]);
            }
          });
        }
      };
      removeNullValue(data);
      params = `data=${encodeURIComponent(JSON.stringify(data))}`;
    }
    url += params ? (url.indexOf('?') >= 0 ? '&' : '?') + params : '';

    return request({
      url,
      method: 'get',
      ...options,
    });
  },

  post(url, data, options) {
    return request({
      url,
      data,
      method: 'post',
      ...options,
    });
  },

  upload(url, data, options) {
    !options && (options = {});
    !options.headers && (options.headers = {});

    Object.assign(options.headers, {
      'content-type': 'multipart/form-data',
    });

    return request({
      url,
      data,
      method: 'post',
      ...options,
    });
  },

  put(url, data, options) {
    return request({
      url,
      data,
      method: 'put',
      ...options,
    });
  },

  patch(url, data, options) {
    return request({
      url,
      data,
      method: 'patch',
      ...options,
    });
  },

  // 注意引用时不要使用 {delete} 导致和JS保留字冲突
  delete(url, data, options) {
    return request({
      url,
      method: 'delete',
      ...options,
    });
  },
};
