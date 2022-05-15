import shell from 'shelljs';
import chai from 'chai';

const { expect, assert } = chai;

describe('@feflow/core - Native config', () => {
  before(() => {
    shell.exec('rm -rf .fef');
  });

  it('fef config 后面没有参数时返回的信息应该为空', () => {
    const expectContent = '';
    expect(shell.exec('node bin/feflow config').stdout).to.equal(expectContent);
  });

  describe('测试 fef config get 命令', () => {
    it('fef config get 后面没有参数时返回的信息为空', () => {
      const expectPattern = /\n/;
      assert(expectPattern.test(shell.exec('node bin/feflow config get').stdout));
    });

    it('fef config get 后面的参数在配置中不存在时返回的信息为空', () => {
      const expectPattern = /\n/;
      assert(expectPattern.test(shell.exec('node bin/feflow config get no_exist_key').stdout));
    });

    it('fef config get 后面的参数在配置中存在时返回对应的配置信息', () => {
      const [key, value] = ['serverUrl', 'gui.com'];
      const expectContent = `${value}\n`;

      // 添加配置
      shell.exec(`node bin/feflow config set ${key} ${value}`);
      expect(shell.exec(`node bin/feflow config get ${key}`).stdout).to.equal(expectContent);
    });
  });

  describe('测试 fef config set 命令', () => {
    it('fef config set 后面没有参数时返回的信息为空', () => {
      const expectPattern = /\n/;
      assert(expectPattern.test(shell.exec('node bin/feflow config get').stdout));
    });

    it('fef config set 添加配置成功后返回的信息为空并且应该可以通过 get 获取到', () => {
      const [key, value] = ['serverUrl', 'gui.com'];
      const expectContent = `${value}\n`;

      // 添加配置
      expect(shell.exec(`node bin/feflow config set ${key} ${value}`).stdout).to.equal('');
      expect(shell.exec(`node bin/feflow config get ${key}`).stdout).to.equal(expectContent);
    });
  });

  describe('测试 fef config list 命令', () => {
    it('未进行任何设置时 fef config list 的初始值应该为 packageManager = npm', () => {
      const expectContent = 'packageManager = npm\n';
      expect(shell.exec('node bin/feflow config list').stdout).to.equal(expectContent);
    });

    it('当添加完某项配置后 fef config list 返回的信息中应该包含该项配置', () => {
      const [key, value] = ['serverUrl', 'gui.com'];
      const expectContent = `packageManager = npm\n${key} = ${value}\n`;

      // 添加配置
      expect(shell.exec(`node bin/feflow config set ${key} ${value}`).stdout).to.equal('');
      // 输出配置
      expect(shell.exec(`node bin/feflow config list`).stdout).to.equal(expectContent);
    });
  });
});
