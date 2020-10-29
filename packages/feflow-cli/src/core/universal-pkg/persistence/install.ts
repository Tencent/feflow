import Datastore  from 'nedb';


export default class InstallPersistence {

    private db: Datastore;

    constructor(dbFile: string) {
        this.db = new Datastore({ filename: dbFile });
        this.db.loadDatabase();
    }

    save(pkg: string, iversion: string, cversion: string, 
            attributes: InstallAttribute): Promise<any> {
        const install = new Install(pkg, iversion, cversion, attributes);
        return new Promise((resolve, reject) => {
            this.db.update(Install.query(pkg, iversion), install, { upsert: true }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    find(pkg: string, iversion: string): Promise<Install | undefined> {
        return new Promise((resolve, reject) => {
            this.db.findOne(Install.query(pkg, iversion), undefined, (err, doc) => {
                if (err) {
                    return reject(err);
                } else {
                    if (!doc) {
                        resolve();
                    } else {
                        resolve(Install.from(doc));
                    }
                }
            });
        });
    }

}

export class Install {

    pkg: string;

    installVersion: string;

    checkoutVersion: string;

    attributes: InstallAttribute;

    constructor(pkg: string, iversion: string, cversion: string, attributes: InstallAttribute) {
        this.pkg = pkg;
        this.installVersion = iversion;
        this.checkoutVersion = cversion;
        this.attributes = attributes;
    }

    static from(obj: any) {
        const pkg = obj?.pkg;
        const installVersion = obj?.installVersion;
        const checkoutVersion = obj?.checkoutVersion;
        const attributes = InstallAttribute.from(obj?.attributes);
        return new Install(pkg, installVersion, checkoutVersion, attributes);
    }

    static query(pkg: string, iversion: string) {
        return {pkg, installVersion: iversion};
    }

}

export class InstallAttribute {

    upgradeTime: number | undefined;

    createTime: number | undefined;

    constructor(obj?: any) {
        if (obj?.createTime) {
            this.createTime = obj?.createTime;
        } else {
            this.createTime = Date.now();
        }
        if (obj?.upgradeTime) {
            this.upgradeTime = obj?.upgradeTime;
        }
    }

    static from(obj: any): InstallAttribute {
        const attribute = new InstallAttribute();
        attribute.upgradeTime = obj?.upgradeTime;
        attribute.createTime = obj?.createTime;
        return attribute;
    }

}