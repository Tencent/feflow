// const Report = require("@feflow/report")
const Report = require('../lib');
const EventEmitter = require('events');

const event = new EventEmitter();

const HOOK_TYPE_BEFORE = 'before';

const EXAMPLE_COMMAND = '__report_cmd_example';

/**
 * Namespace for collection of "after" hooks
 */
const HOOK_TYPE_AFTER = 'after';

const mockCtx = {
  logger: {
    info: console.log,
    debug: console.log,
    error: console.log,
    warn: console.log,
  },
  hook: {
    on(type, cb) {
      event.addListener(type, cb);
    },
  },
};

module.exports = {
  mockCtx,
  HOOK_TYPE_BEFORE,
  HOOK_TYPE_AFTER,
  EXAMPLE_COMMAND,
  Report,
};
