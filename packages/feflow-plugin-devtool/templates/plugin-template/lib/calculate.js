module.exports = function add(feflow) {
    // 原函数逻辑
    return {
        add(args) {
            const sum = args.reduce((sum, item) => {
                return sum + item;
            }, 0);

            // console.log(sum)
            feflow.logger.info(sum);
            return sum;
        },
        multiply(args) {
            const product = args.reduce((product, item) => {
                return product * item;
            }, 1);

            // console.log(sum)
            feflow.logger.info(product);
            return product;
        },
        // 减法看成加法计算
        minus(args) {
            const _args = args.map((arg, index) => index ? -arg : arg);
            return this.add(_args);
        },
        // 除法看成乘法来算
        divide(args) {
            // 除数不为零
            if (args.slice(1).indexOf(0) > -1) {
                return feflow.logger.error('除数不能为零');
            }
            const _args = args.map((arg, index) => index ? 1 / arg : arg);
            return this.multiply(_args);
        }
    };
};