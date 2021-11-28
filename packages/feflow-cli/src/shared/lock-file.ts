import fs from 'fs';
import lockFile from 'lockfile';
import createLogger, { Logger } from '../core/logger';

export default class LockFile {
  private readonly filePath: string;
  private readonly lockKey: string;
  private logger: Logger;
  private readonly tryMax: number;
  private readonly tryGap: number;
  private tryCount: number;

  constructor(filePath: string, lockKey: string) {
    this.filePath = filePath;
    this.lockKey = lockKey;
    this.logger = createLogger({
      debug: false,
      silent: true,
    });
    this.tryMax = 50;
    this.tryGap = 100;
    this.tryCount = 0;
  }

  public read(key?: string) {
    return new Promise<JSONValue>((resolve, reject) => {
      fs.stat(this.filePath, (err, stats) => {
        if (err) {
          this.logger.error(err);
          reject(err);
        }

        if (!stats.isFile()) {
          reject('not a file');
        }

        this.checkIfCanRead(() => {
          fs.readFile(
            this.filePath,
            {
              encoding: 'utf8',
            },
            (err, data) => {
              if (err) {
                this.logger.error(err);
                reject(err);
              }

              let finalData = data;
              if (!data) {
                // no data then turn it to {}
                this.resetFile();
                finalData = '{}';
              }

              this.logger.debug(`get file: ${this.filePath} => data: ${finalData}`);

              try {
                const dataObj: object = JSON.parse(finalData);
                if (key) {
                  const targetContent = dataObj[key];
                  resolve(targetContent);
                } else {
                  resolve(dataObj);
                }
              } catch (e) {
                // 写入的文件数据有问题，清空文件，下次重新写入。
                this.resetFile();
                this.logger.error(e);
                reject(e);
              }
            },
          );
        });
      });
    });
  }

  public update(key: string, value: JSONValue): Promise<object | undefined> {
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(this.filePath)) {
          // 文件不存在则创建文件后插入
          this.resetFile();
        }
        this.lock((err) => {
          if (err) {
            this.unlock();
            reject(err);
          }

          let origData = fs.readFileSync(this.filePath, 'utf-8');
          if (!origData) {
            // no data then turn it to {}
            this.resetFile();
            origData = '{}';
          }
          try {
            const origDataObj: object = JSON.parse(origData);
            this.logger.debug(`write file ${this.filePath} key ${key} value ${value}`);
            origDataObj[key] = value;
            fs.writeFile(this.filePath, JSON.stringify(origDataObj, null, 2), (err) => {
              this.unlock();
              if (err) {
                this.logger.error(err);
                reject(err);
              }
              resolve(origDataObj);
            });
          } catch (e) {
            // 文件数据有问题，清空文件，下次重新写入。
            this.resetFile();
            this.logger.error(e);
            this.unlock();
            reject(e);
          }
        });
      } catch (err) {
        this.logger.error(err);
        this.unlock();
        reject(err);
      }
    });
  }

  private resetFile(): void {
    fs.writeFileSync(this.filePath, JSON.stringify({}, null, 2), 'utf-8');
  }

  private checkIfCanRead(cb: Function): void {
    lockFile.check(this.lockKey, (err, status) => {
      if (err) return this.logger.error(`check ${this.lockKey} error: `, err);
      if (status) {
        // another writing is runing
        if (this.tryCount >= this.tryMax) {
          this.tryCount = 0;
          return this.logger.error(`file read time out ${this.filePath}`);
        }
        this.tryCount += 1;
        setTimeout(() => {
          this.checkIfCanRead(cb);
        }, this.tryGap);
      } else {
        // read immediatelly
        this.tryCount = 0;
        cb();
      }
    });
  }

  private lock(cb: (err?: Parameters<Parameters<typeof lockFile.lock>[1]>[0]) => void): void {
    lockFile.lock(
      this.lockKey,
      {
        wait: this.tryGap,
        retries: this.tryMax,
      },
      (err) => {
        if (err) {
          this.logger.error(`lock ${this.lockKey} error: `, err);
          this.unlock();
          cb(err);
          return;
        }

        cb();
      },
    );
  }

  private unlock(): void {
    lockFile.unlock(this.lockKey, (err) => {
      err && this.logger.error(`unlock ${this.lockKey} error: `, err);
    });
  }
}
