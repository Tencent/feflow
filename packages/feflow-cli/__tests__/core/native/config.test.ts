import shell from 'shelljs';
import chai from 'chai';
import { removeDir } from '../../utils';

const { assert } = chai;

describe('@feflow/core - Native config', () => {
  beforeEach(() => {
    removeDir('.fef');
  });

  it('fef config 后面没有参数时返回的信息应该为空', () => {
    const expectedPattern = /\s*/;
    assert.match(shell.exec('node bin/feflow config').stdout, expectedPattern);
  });

  describe('测试 fef config get 命令', () => {
    it('fef config get 后面没有参数时返回的信息为空', () => {
      const expectedPattern = /\s*/;
      assert.match(shell.exec('node bin/feflow config get').stdout, expectedPattern);
    });

    it('fef config get 后面的参数在配置中不存在时返回的信息为空', () => {
      const expectedPattern = /\s*/;
      assert.match(shell.exec('node bin/feflow config get no_exist_key').stdout, expectedPattern);
    });

    it('fef config get 后面的参数在配置中存在时返回对应的配置信息', () => {
      const [key, value] = ['serverUrl', 'gui.com'];
      const expectedPattern = new RegExp(`${value}[\\s]*`);

      // 添加配置
      shell.exec(`node bin/feflow config set ${key} ${value}`);
      assert.match(shell.exec(`node bin/feflow config get ${key}`).stdout, expectedPattern);
    });
  });

  describe('测试 fef config set 命令', () => {
    it('fef config set 后面没有参数时返回的信息为空', () => {
      const expectedPattern = /\s*/;
      assert.match(shell.exec('node bin/feflow config get').stdout, expectedPattern);
    });

    it('fef config set 添加配置成功后返回的信息为空并且应该可以通过 get 获取到', () => {
      const [key, value] = ['serverUrl', 'gui.com'];
      const expectedPattern = new RegExp(`${value}[\\s]*`);

      // 添加配置
      shell.exec(`node bin/feflow config set ${key} ${value}`);
      assert.match(shell.exec(`node bin/feflow config get ${key}`).stdout, expectedPattern);
    });
  });

  describe('测试 fef config list 命令', () => {
    it('未进行任何设置时 fef config list 中应该含有 packageManager = npm', () => {
      const expectedPattern = /packageManager = npm\s*/;
      assert.match(shell.exec('node bin/feflow config list').stdout, expectedPattern);
    });

    it('当添加完某项配置后 fef config list 返回的信息中应该包含该项配置', () => {
      const [key, value] = ['serverUrl', 'gui.com'];
      const expectedPattern = new RegExp(`packageManager = npm\\s*${key} = ${value}\\s*`);

      // 添加配置
      shell.exec(`node bin/feflow config set ${key} ${value}`);
      // 输出配置
      assert.match(shell.exec('node bin/feflow config list').stdout, expectedPattern);
    });
  });
});
