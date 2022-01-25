import axios from 'axios';
import semver from 'semver';

export default async function packageJson(name: string, registry: string): Promise<string> {
  const names = (name || '').split('@');
  const version = !names[0] ? names[2] : names[1];
  const depName = !names[0] ? `@${names[1]}` : names[0];

  const url = `${registry}/${depName}`;
  const response = await axios.get(url, { proxy: false });
  const { data } = response || { 'dist-tags': {} };
  const { versions } = data;
  const versionList = Object.keys(versions);

  let satisfiedMaxVersion: string | undefined;
  versionList.forEach((tag: string) => {
    if (tag.includes(version) && (!satisfiedMaxVersion || semver.gt(tag, satisfiedMaxVersion))) {
      satisfiedMaxVersion = tag;
    }
  });
  if (satisfiedMaxVersion) {
    return satisfiedMaxVersion;
  }

  return data['dist-tags'].latest || data.version || '';
}
