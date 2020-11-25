const Report = require('../');
const { Report, mockCtx } = require('./depences')

// const report = new Report(mockCtx);
const report = new Report(mockCtx);

// event.emit(HOOK_TYPE_BEFORE)

// event.emit(HOOK_TYPE_AFTER)

report.report(cmd, args)