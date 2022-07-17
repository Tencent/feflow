import shell from 'shelljs';
import chai from 'chai';
import path from 'path';
import { getKeyFormFile } from '../../../src/shared/file';

const { assert } = chai;

describe('测试 @feflow/cli - Native info', () => {
  it('fef info 的输出中应该包含feflow以及它的版本信息', () => {
    // 因为每台机器上的node版本等信息可能不同，因此这里采用正则的方式不去断言全部的返回信息，只验证feflow这个字段保证fef info正常输出即可
    const packageJsonPath = path.resolve(__dirname, '../../../package.json');
    const feflowVersion = getKeyFormFile(packageJsonPath, 'version');
    const expectedPattern = new RegExp(`feflow: ${feflowVersion}`);
    assert.match(shell.exec('node bin/feflow info').stdout, expectedPattern);
  });
});
