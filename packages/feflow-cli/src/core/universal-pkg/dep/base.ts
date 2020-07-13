import versionImpl from './version';

export function toInstalled(oInstalled: any): Map<string, string> {
  const installed = new Map<string, string>();
  if (!oInstalled) {
    return installed;
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const k in oInstalled) {
    const version = oInstalled[k];
    if (versionImpl.check(version)) {
      installed.set(k, version);
    }
  }
  return installed;
}
