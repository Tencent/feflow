/**
 * Namespace for collection of "before" hooks
 */
export const HOOK_TYPE_BEFORE = 'before';

/**
 * Namespace for collection of "after" hooks
 */
export const HOOK_TYPE_AFTER = 'after';

const BASIC_URL = 'http://api.feflowjs.com';

export const REPORT_URL = `${BASIC_URL}/api/v1/report/command`;

export const REPORT_PROXY = 'http://127.0.0.1:12639';

export const REPORT_STATUS = {
  START: 0,
  COMPLETED: 1,
};
