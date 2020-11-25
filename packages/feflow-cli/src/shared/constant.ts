export const FEFLOW_ROOT = '.fef';
export const FEFLOW_BIN = 'bin';
export const FEFLOW_LIB = 'lib';

export const LATEST_VERSION = 'latest';

export const FEF_ENV_PLUGIN_PATH = 'FEF_PLUGIN_PATH';

export const PROJECT_CONFIG = [
  '.feflowrc.js',
  '.feflowrc.yaml',
  '.feflowrc.yml',
  '.feflowrc.json',
  '.feflowrc',
  'package.json'
];

export const DEVKIT_CONFIG = [
  'devkit.js',
  'devkit.yaml',
  'devkit.yml',
  'devkit.json',
  'devkitrc',
  'package.json'
];

/**
 * Namespace for collection of "before" hooks
 */
export const HOOK_TYPE_BEFORE = 'before';

/**
 * Namespace for collection of "after" hooks
 */
export const HOOK_TYPE_AFTER = 'after';

export const HOOK_TYPE_ON_COMMAND_REGISTERED = 'on_command_registered';

/**
 * Emitted when command execution begins
 */
export const EVENT_COMMAND_BEGIN = 'command begin';

/**
 * Emitted when totally finished
 */
export const EVENT_DONE = 'done';

export const UNIVERSAL_MODULES = 'universal_modules';

export const UNIVERSAL_PKG_JSON = 'universal-package.json';

export const UNIVERSAL_PLUGIN_CONFIG = 'plugin.yml';

export const UNIVERSAL_PLUGIN_INSTALL_COLLECTION = 'install.db';

export const UPGRADE_INTERVAL = 1000 * 60 * 60;
export const NPM_PLUGIN_INFO_JSON = 'npm-plugin-info.json';

export const UNIVERSAL_README_CONFIG = 'README.md';

export const CACHE_FILE = ".feflowCache.yml";

export const HEART_BEAT_COLLECTION = 'heart-beat.db';

export const UPDATE_COLLECTION = 'update.db';

export const BEAT_GAP = 5000;

export const CHECK_UPDATE_GAP = 1000 * 60 * 5;
