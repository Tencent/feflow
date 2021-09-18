import versionImpl from './version';

export function toInstalled(oInstalled: any): Map<string, string> {
  const installed = new Map<string, string>();
  if (!oInstalled) {
    return installed;
  }
  const oInstalledArr = Object.entries(oInstalled);
  oInstalledArr.forEach((item: any[], index: number) => {
    const version = oInstalled[item[index]];
    if (versionImpl.check(version)) {
      installed.set(item[index], version);
    }
  })
  return installed;
}
