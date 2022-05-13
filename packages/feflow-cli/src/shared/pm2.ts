import pm2 from 'pm2';

/**
 * 创建pm2进程
 *
 * @param options pm2启动进程参数
 */
export function createPm2Process(options: pm2.StartOptions) {
  pm2.connect((err) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }
    // To release connection to PM2 and make your application auto exit, make sure to disconnect from pm2 with pm2.disconnect()
    pm2.start(options, () => pm2.disconnect());
  });
}
