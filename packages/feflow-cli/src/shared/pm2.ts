import pm2 from 'pm2';
import Feflow from '..';

export type ErrProcCallback = (pm2: any) => (err: Error, proc: pm2.Proc) => void;

/**
 * 创建pm2进程
 *
 * @param options pm2启动进程参数
 */
export function createPm2Process(ctx: Feflow, options: pm2.StartOptions, errback: ErrProcCallback) {
  pm2.connect((err) => {
    if (err) {
      ctx.logger.error('pm2 connect failed', err);
      return;
    }

    // To release connection to PM2 and make your application auto exit, make sure to disconnect from pm2 with pm2.disconnect()
    pm2.start(options, errback(pm2));
  });
}
