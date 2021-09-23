import os from 'os';

const platformMap = {
  aix: 'linux',
  freebsd: 'linux',
  linux: 'linux',
  openbsd: 'linux',
  sunos: 'linux',
  win32: 'windows',
  darwin: 'macos',
};

const PLATFORM = os.platform();
const platformType = platformMap[PLATFORM];

function toArray(v: any, field: string, defaultV?: string[]): string[] {
  if (v && !Array.isArray(v)) {
    if (typeof v === 'string') {
      return [v];
    }
    throw `field ${field} must provide either a string or an array of strings`;
  }
  return v || defaultV || [];
}

export { PLATFORM as platform, platformType, toArray };
