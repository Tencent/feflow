import os from 'os';

const platformMap = new Map<string, 'linux' | 'windows' | 'macos'>([
  ['aix', 'linux'],
  ['freebsd', 'linux'],
  ['linux', 'linux'],
  ['openbsd', 'linux'],
  ['sunos', 'linux'],
  ['win32', 'windows'],
  ['darwin', 'macos'],
]);
const PLATFORM = os.platform();
const PLATFORM_TYPE: 'linux' | 'windows' | 'macos' | 'default' = platformMap.get(PLATFORM) || 'default';

function toArray(v: any, field: string, defaultV?: string[]): string[] {
  if (v && !Array.isArray(v)) {
    if (typeof v === 'string') {
      return [v];
    }
    throw new Error(`field ${field} must provide either a string or an array of strings`);
  }
  return v || defaultV || [];
}

export { PLATFORM as platform, PLATFORM_TYPE as platformType, toArray };
