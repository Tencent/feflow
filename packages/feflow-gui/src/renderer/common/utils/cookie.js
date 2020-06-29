// cookie.js

// 通过remote模块取的原本在主进程中才能使用的session模块
const session = require('electron').remote.session;
/**
 * 获得
 */
const Cookie = {}
const Session = session
Cookie.getCookies = (data) => {
    const param = data || {}
    return new Promise(function (resolve, reject) {
        Session.defaultSession.cookies.get(param, function (error, cookies) {
            if (error) {
                reject(error);
            }
            resolve(cookies);
        })
    })
};

/**
 * 清空缓存
 */
Cookie.clearCookies = (url) => {
    Session.defaultSession.clearStorageData({
        origin: url,
        storages: ['cookies']
    }, function (error) {
        if (error) console.error(error);
    })
};

/**
 * 保存cookie
 * @param name  cookie名称
 * @param value cookie值
 */
Cookie.setCookie = (url, name, value) => {
    let Days = 30;
    let exp = new Date();
    let date = Math.round(exp.getTime() / 1000) + Days * 24 * 60 * 60;
    const cookie = {
        url: url || '',
        name: name,
        value: value,
        expirationDate: date
    };
    Session.defaultSession.cookies.set(cookie, (error) => {
        if (error) console.error(error);
    });
};

// export default cookie
export default Cookie;
