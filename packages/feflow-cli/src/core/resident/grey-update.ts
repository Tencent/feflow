import axios from 'axios';
import { getUserName } from '@feflow/report';
import { getLatestPackageJson } from '../../shared/package-json';

/** 灰度配置 */
export interface GreyConfig {
  /** 灰度比例 */
  ratio?: number;
  /** 随时间增加的灰度比例 */
  ratioList?: {
    /** 灰度时间 */
    day: number;
    /** 灰度比例 */
    ratio: number;
  }[];
  /** 灰度白名单 */
  whitelist?: string[];
}

export const generatorGreyNum = (name: string, version: string) => {
  const userName = getUserName();
  const str = `${name}${version}${userName}`;
  let result = 0;

  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i);
  }

  return result % 100;
};

export const getDayDiff = (date: string) => Math.ceil(((+new Date()) - (+new Date(date))) / (1000 * 60 * 60 * 24));

export const getGreyConfig = async (name: string) => {
  const response = await axios.get('https://gui.woa.com/apply/grey-config', { proxy: false, data: { name } });
  const { data } = response.data;
  const { grey_config } = data;

  if (grey_config) {
    const greyConfig = JSON.parse(grey_config);

    if (greyConfig.ratio || greyConfig.ratio_list[0]?.ratio) {
      return greyConfig;
    }
  }
};

export const getGreyVersion = async (name: string, packageManager: string) => {
  const { packageJson, time } = await getLatestPackageJson(name, packageManager);
  const serverGreyConfig = await getGreyConfig(name);
  const greyConfig: GreyConfig = serverGreyConfig || packageJson?.greyConfig;

  if (!greyConfig) return packageJson.version;

  const userName = getUserName();
  const { ratio, ratioList, whitelist = [] } = greyConfig;

  if (whitelist.includes(userName)) return packageJson.version;

  let selectedRatio = ratio || 0;

  if (ratioList) {
    const currentDay = getDayDiff(time);
    ratioList.forEach((item) => {
      if (item.day <= currentDay) {
        selectedRatio = item.ratio;
      }
    });
  }

  const greyNum = generatorGreyNum(name, packageJson.version);

  if (selectedRatio >= greyNum) return  packageJson.version;

  return '';
};
