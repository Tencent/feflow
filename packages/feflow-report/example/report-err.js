const { Report, mockCtx, EXAMPLE_COMMAND } = require('./depences');

const report = new Report(mockCtx);

report.report('init')
// report.report(EXAMPLE_COMMAND)

report.reportCommandError({ message: 'test err 1' });
report.reportCommandError({ message: 'test err 2' });
