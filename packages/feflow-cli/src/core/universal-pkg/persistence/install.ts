export class Install {
  pkg: string;

  installVersion: string;

  checkoutVersion: string;

  attributes: InstallAttribute;

  constructor(
    pkg: string,
    iVersion: string,
    cVersion: string,
    attributes: InstallAttribute
  ) {
    this.pkg = pkg;
    this.installVersion = iVersion;
    this.checkoutVersion = cVersion;
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
    return { pkg, installVersion: iversion };
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
