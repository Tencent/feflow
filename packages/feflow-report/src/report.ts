import ApiController from './api/index';
import { getUserName, getSystemInfo, getKeyFormFile, setKeyToFile } from './common/utils';
import objectFactory from './common/objectFactory';
import { REPORT_STATUS } from './constants';

const { cmd, args, commandSource, lastCommand, project, version, generatorProject, cachePath, costTime, recall } =
  process.env;
// @ts-ignore
const params = JSON.parse(args);
const userName = getUserName();
const systemInfo = getSystemInfo();

function getReportBody(cmd: string, params: string): any {
  return objectFactory
    .create()
    .load('command', cmd)
    .load('last_command', lastCommand)
    .load('feflow_version', version)
    .load('command_source', commandSource)
    .load('user_name', userName)
    .load('params', params) // @ts-ignore
    .load('err_message', getKeyFormFile(cachePath, 'errMsg'))
    .load('system_info', systemInfo)
    .load('project', project)
    .load('status', REPORT_STATUS.START)
    .load('node_version', process.version)
    .done();
}

function getRecallBody(): any {
  // @ts-ignore
  return objectFactory
    .create()
    .load('command')
    .load('generator_project', generatorProject) // @ts-ignore
    .load('recall_id', getKeyFormFile(cachePath, 'recallId'))
    .load('cost_time', costTime) // @ts-ignore
    .load('err_message', getKeyFormFile(cachePath, 'errMsg'))
    .load('is_fail', false)
    .load('status', REPORT_STATUS.COMPLETED)
    .done();
}

function recallReport(): any {
  // @ts-ignore
  setKeyToFile(cachePath, 'isRecallActivating', true);
  // @ts-ignore
  if (!getKeyFormFile(cachePath, 'recallId')) return;
  try {
    const reCallBody: RecallBody = getRecallBody();
    console.log('reCallBody', JSON.stringify(reCallBody));

    const report = new ApiController(reCallBody, { info: console.log, debug: console.log });
    report.doReport();
    // @ts-ignore
    setKeyToFile(cachePath, 'hasRecalled', true);
  } catch (error) {
    console.log('feflow recallReport got error，please contact administractor to resolve ', error);
  }
}

function startReport(): any {
  if (String(recall) === 'true') return recallReport();

  try {
    // @ts-ignore
    const reportBody: ReportBody = getReportBody(cmd, params);
    console.log('reportBody', JSON.stringify(reportBody));

    const report = new ApiController(reportBody, { info: console.log, debug: console.log });
    report.doReport(({ result }) => {
      // @ts-ignore
      if (getKeyFormFile(cachePath, 'errMsg')) return;
      const { id } = result || {};
      // @ts-ignore
      setKeyToFile(cachePath, 'reCallId', id);
      // hack async
      // @ts-ignore
      if (getKeyFormFile(cachePath, 'isRecallActivating')) {
        recallReport();
      }
    });
  } catch (error) {
    console.debug('feflow report got error，please contact administractor to resolve ', error);
  }
}

startReport();
