import versionImpl from './version';

export function toInstalled(oInstalled: any): Map<string, string> {
  const installed = new Map<string, string>();
  if (!oInstalled) {
    return installed;
  }
  Object.entries(oInstalled).forEach(([key, version]) => {
    if (versionImpl.check(version)) {
      installed.set(key, version);
    }
  });
  return installed;
}
