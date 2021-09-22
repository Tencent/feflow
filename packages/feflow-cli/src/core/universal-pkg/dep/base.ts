import versionImpl from './version';

export function toInstalled(oInstalled: any): Map<string, string> {
  const installed = new Map<string, string>();
  if (!oInstalled) {
    return installed;
  }
  Object.entries(oInstalled).forEach((item: any[]) => {
    const version = item[1];
    if (versionImpl.check(version)) {
      installed.set(item[0], version);
    }
  })
  return installed;
}
