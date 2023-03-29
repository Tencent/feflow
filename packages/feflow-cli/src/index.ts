import Feflow from './core';

// 命名导出便于插件开发者进行 ts module augmentation: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
// 因为 default 导出不能被 augment
export { Feflow };
// legacy default 导出，后续不建议
export default Feflow;
