export default function compose(...funcs: any) {
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a: any, b: any) => (...args: any) => a(b(...args)));
}
