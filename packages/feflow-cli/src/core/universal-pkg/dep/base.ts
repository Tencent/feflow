import versionImpl from './version';

export function toInstalled(oInstalled: any): Map<string, string> {
  const installed = new Map<string, string>();
  if (!oInstalled) {
    return installed;
  }
  const oInstalledKey = Object.keys(oInstalled);
  for (const item of oInstalledKey) {
    const version = oInstalled[item];
    if (versionImpl.check(version)) {
      installed.set(item, version);
    }
  }
  return installed;
}
