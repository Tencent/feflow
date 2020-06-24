import checkCliUpdate from '../../shared/checkCliUpdate';

module.exports = (ctx: any) => {
  ctx.commander.register('upgrade', 'upgrade fef cli', () => {
    checkCliUpdate(ctx);
  });
};
