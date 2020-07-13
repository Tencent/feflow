/**
 * 函数柯里化
 * @param {Function} fn 被柯里化的函数
 * @param {Number} [length=被柯里化的函数参数个数] 被柯里化的粒度
 */
export default function curry(fn, length = fn.length) {
  const subCurry = function (fn) {
    const args = [].slice.call(arguments, 1);
    return function () {
      return fn.apply(this, args.concat([].slice.call(arguments)));
    };
  };

  const { slice } = Array.prototype;
  const len = length;
  return function () {
    if (arguments.length < len) {
      const combined = [fn].concat(slice.call(arguments));
      return curry(subCurry.apply(this, combined), len - arguments.length);
    }
    return fn.apply(this, arguments);
  };
}
