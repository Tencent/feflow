
/**
 * 获取地址参数
 * @description 从 location.href 提取指定参数的值
 * @param {String} key 参数 key
 * @returns 返回参数 key 的值
 */
export default function (key) {
  const search = location.href.split('?')[1] || '';
  const paramsList = {};
  const args = search.split('&');

  args.forEach((item) => {
    const [key, value] = item.split('=');
    if (key) {
      paramsList[key] = decodeURIComponent(value);
    }
  });

  return paramsList[key] || '';
}
