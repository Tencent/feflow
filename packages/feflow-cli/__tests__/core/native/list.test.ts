import shell from 'shelljs';
import chai from 'chai';
import { removeDir } from '../../utils';

const { assert } = chai;

describe('@feflow/core - Native list', () => {
  beforeEach(() => {
    removeDir('.fef');
  });

  it('未安装任何脚手架或插件时, fef list 应提示未安装任何脚手架或插件', () => {
    const expectedPattern = /No templates and plugins have been installed/;
    assert.match(shell.exec('node bin/feflow list').stdout, expectedPattern);
  });

  it('安装 @feflow/generator-example 脚手架后, fef list 的返回内容应包含 @feflow/generator-example', () => {
    // 安装 @feflow/generator-example
    const packageName = '@feflow/generator-example';
    const edition = '0.0.7';
    shell.exec(`node bin/feflow install ${packageName}@${edition}`);

    const expectedPattern = new RegExp(`templates\\n*${packageName}\\(${edition}\\)\\n*plugins\\n*`);
    assert.match(shell.exec('node bin/feflow list').stdout, expectedPattern);
  });
});
