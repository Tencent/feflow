module.exports = (ctx: any) => {
  ctx.commander.register('logger', 'logger Message', () => {
    const args = ctx.args._ || [];
    const [types, msg] = args;
    switch (types) {
      case 'info':
      case 'warn':
      case 'error':
        ctx.logger[types](msg);
        break;
      default:
        console.log('nothing types');
        break;
    }
  });
};
