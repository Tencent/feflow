"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNIVERSAL_README_CONFIG = exports.UNIVERSAL_PLUGIN_CONFIG = exports.UNIVERSAL_PKG_JSON = exports.UNIVERSAL_MODULES = exports.EVENT_DONE = exports.EVENT_COMMAND_BEGIN = exports.HOOK_TYPE_AFTER = exports.HOOK_TYPE_BEFORE = exports.DEVKIT_CONFIG = exports.PROJECT_CONFIG = exports.FEF_ENV_PLUGIN_PATH = exports.LATEST_VERSION = exports.FEFLOW_LIB = exports.FEFLOW_BIN = exports.FEFLOW_ROOT = void 0;
exports.FEFLOW_ROOT = '.fef';
exports.FEFLOW_BIN = 'bin';
exports.FEFLOW_LIB = 'lib';
exports.LATEST_VERSION = 'latest';
exports.FEF_ENV_PLUGIN_PATH = 'FEF_PLUGIN_PATH';
exports.PROJECT_CONFIG = [
    '.feflowrc.js',
    '.feflowrc.yaml',
    '.feflowrc.yml',
    '.feflowrc.json',
    '.feflowrc',
    'package.json',
];
exports.DEVKIT_CONFIG = [
    'devkit.js',
    'devkit.yaml',
    'devkit.yml',
    'devkit.json',
    'devkitrc',
    'package.json',
];
/**
 * Namespace for collection of "before" hooks
 */
exports.HOOK_TYPE_BEFORE = 'before';
/**
 * Namespace for collection of "after" hooks
 */
exports.HOOK_TYPE_AFTER = 'after';
/**
 * Emitted when command execution begins
 */
exports.EVENT_COMMAND_BEGIN = 'command begin';
/**
 * Emitted when totally finished
 */
exports.EVENT_DONE = 'done';
exports.UNIVERSAL_MODULES = 'universal_modules';
exports.UNIVERSAL_PKG_JSON = 'universal-package.json';
exports.UNIVERSAL_PLUGIN_CONFIG = 'plugin.yml';
exports.UNIVERSAL_README_CONFIG = 'README.md';
//# sourceMappingURL=constant.js.map