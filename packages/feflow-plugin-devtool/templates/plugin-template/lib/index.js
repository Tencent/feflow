const calculate = require('./calculate');

module.exports = (context) => {
    const calculator = calculate(context);
    const { args } = context;

    // 注册一个 add 命令
    context.commander.register('add', '加法运算器', () => {
        // args 是 add 后面的参数，已被 minimist 库解析
        // 例如 `feflow add 1 2 3`，args 就是 { _: [1, 2, 3] }，
        // 再比如 `feflow add -x 1 -y 2 --z-value 3 4 5 6`，args 就是 { _: [ 4, 5, 6 ], x: 1, y: 2, 'z-value': 3 }
        // 调用主要的逻辑
        return calculator.add(args._);
    });

    // 注册乘、除、减三个命令
    context.commander.register('multiply', '乘法运算器', () => calculator.multiply(args._));
    context.commander.register('minus', '减法运算器', () => calculator.minus(args._));
    context.commander.register('divide', '除法运算器', () => calculator.divide(args._));
};


