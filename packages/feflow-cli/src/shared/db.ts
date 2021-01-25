import Datastore from 'nedb';

export default class DBInstance {
  private db: Datastore;

  constructor(dbFile: string) {
    this.db = new Datastore({ filename: dbFile });
    this.db.loadDatabase();
  }

  setAutoCompact(interval: number): void {
    this.db.persistence.setAutocompactionInterval(interval);
  }

  create(key: string, value: any): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.db.insert(
        {
          key,
          value
        },
        err => {
          if (err) {
            return reject(err);
          } else {
            resolve(undefined);
          }
        }
      );
    });
  }

  read(key: string): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.db.findOne(
        {
          key
        },
        (err, docs) => {
          if (err) {
            return reject(err);
          } else {
            if (docs) {
              resolve(docs);
            } else {
              resolve(undefined);
            }
          }
        }
      );
    });
  }

  update(key: string, value: any): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.db.update(
        {
          key
        },
        {
          $set: {
            value
          }
        },
        {
          upsert: true
        },
        err => {
          if (err) {
            reject(err);
          } else {
            resolve(undefined);
          }
        }
      );
    });
  }

  insertOnce(scope: string, key: string, value: any): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.db.findOne(
        {
          key: scope
        },
        (err, docs) => {
          if (err) {
            return reject(err);
          } else {
            const data = docs?.['value'] || {};
            if (!Object.prototype.hasOwnProperty.call(data, key)) {
              data[key] = value;
              this.db.update(
                {
                  key: scope
                },
                {
                  $set: {
                    value: data
                  }
                },
                {
                  upsert: true
                },
                err => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(undefined);
                  }
                }
              );
            } else {
              resolve(undefined);
            }
          }
        }
      );
    });
  }
}
