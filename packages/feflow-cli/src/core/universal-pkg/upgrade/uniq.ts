export default class UpgradeUniq {
    container: Map<string, string> = new Map()

    upgradeable(pkg: string, version: string): boolean {
      const ret = this.container.get(pkg) !== version;
      if (ret) {
        this.container.set(pkg, version);
      }
      return ret;
    }
}
