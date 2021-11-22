import { parseYaml } from './yaml';

export interface FeflowConfig {
  packageManager: string;
  serverUrl: string;
  autoUpdate?: string;
  disableCheck?: string;
  lastUpdateCheck?: string;
}

export function isValidConfig(configFromYml: ReturnType<typeof parseYaml>): configFromYml is FeflowConfig {
  return typeof configFromYml === 'object';
}
