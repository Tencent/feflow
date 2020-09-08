import Datastore from 'nedb';

export default class DBInstance {
  private db: Datastore;

  constructor(dbFile: string) {
    this.db = new Datastore({ filename: dbFile });
    this.db.loadDatabase();
  }

  setAutoCompact(interval: number) {
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
            resolve();
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
              resolve();
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
            resolve();
          }
        }
      );
    });
  }
}
