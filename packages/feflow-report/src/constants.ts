/**
 * Namespace for collection of "before" hooks
 */
export const HOOK_TYPE_BEFORE = 'before';

/**
 * Namespace for collection of "after" hooks
 */
export const HOOK_TYPE_AFTER = 'after';

// 安全修复：上报地址改为 HTTPS，防止遥测数据明文传输
const BASIC_URL = 'https://api.feflowjs.com';

export const REPORT_URL = `${BASIC_URL}/api/v1/report/command`;

export const REPORT_PROXY = 'http://127.0.0.1:12639';

export const TIMEOUT = 1000;

export const REPORT_COMMAND_ERR = '__report_cmd_err';

export const REPORT_STATUS = {
  START: 0,
  COMPLETED: 1,
};

export const REPORT_JSON = 'fef-report.json';
