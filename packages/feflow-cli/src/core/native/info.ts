import os from 'os';

module.exports = (ctx: any) => {
  ctx.commander.register('info', 'Info messages', () => {
    const versions: any = process.versions;
    const keys = Object.keys(versions);
    let key = '';

    console.log('feflow:', ctx.version);
    console.log('os:', os.type(), os.release(), os.platform(), os.arch());

    for (let i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      console.log('%s: %s', key, versions[key]);
    }
  });
};
