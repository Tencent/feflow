import axios from 'axios';
import semver from 'semver';
import { getNpmRegistryUrl } from '../core/resident/utils';

export const getPackageInfo = async (name: string, registry: string) => {
  const names = (name || '').split('@');
  const version = !names[0] ? names[2] : names[1];
  const isValidVersion = semver.valid(version) || version === 'latest';
  const url = `${registry}/${isValidVersion ? `@${names[1]}/${names[2]}` : name}`;
  const response = await axios.get(url, { proxy: false });
  const { data } = response;

  return { data, isValidVersion };
};

export const getLatestPackageJson = async (name: string, packageManager: string) => {
  const registryUrl = getNpmRegistryUrl(packageManager);
  const { data } = await getPackageInfo(name, registryUrl);
  const latestVersion = data['dist-tags'].latest;

  return { packageJson: data.versions[latestVersion], time: data.time[latestVersion] };
};

export default async function packageJson(name: string, registry: string) {
  const { data, isValidVersion } = await getPackageInfo(name, registry);
  if (!isValidVersion) {
    const version = data['dist-tags'].latest;
    return version || '';
  }
  // 指定包的版本情况
  return data.version || '';
}
