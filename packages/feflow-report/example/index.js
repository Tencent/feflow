// const Report = require("@feflow/report")
const Report = require('../lib');
const EventEmitter = require('events');

const event = new EventEmitter();

const HOOK_TYPE_BEFORE = 'before';

/**
 * Namespace for collection of "after" hooks
 */
const HOOK_TYPE_AFTER = 'after';


const fakeCtx = {
  logger: {
    info: console.log,
    debug: console.log,
    error: console.log,
    warn: console.log,
  },
  hook: {
    on(type, cb){
        event.addListener(type, cb)
    }
  }
};

const cmd = 'version';
const args = {};

// const report = new Report(fakeCtx);
const report = new Report(fakeCtx, cmd, args);

event.emit(HOOK_TYPE_BEFORE)

event.emit(HOOK_TYPE_AFTER)

// report.report(cmd, args)


