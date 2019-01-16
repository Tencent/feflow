const add = require('./add');
const add2 = require.resolve('./add');
feflow.cmd.register('demo1', 'Config ivweb dependencies', {}, function(args) {
  const result = add(1, 2);
  const result2 = add(1, 2);
  console.log('this is a simple plugin', args, result, result2);
});