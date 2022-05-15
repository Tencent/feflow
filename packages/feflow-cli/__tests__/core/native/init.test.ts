import shell from 'shelljs';
import chai from 'chai';

const { assert } = chai;

describe('@feflow/core - Native init', () => {
  beforeEach(() => {
    shell.exec('rm -rf .fef');
  });

  describe('fef init 使用参数指定脚手架', () => {
    it('未安装指定的脚手架时, fef init 应提示是否安装使用该脚手架', () => {
      const packageName = '@feflow/generator-example';
      const expectedPattern = new RegExp(`E2E: ${packageName}未安装，是否要安装使用？\\s*`);
      assert.match(shell.exec(`node bin/feflow init --generator=${packageName}`).stdout, expectedPattern);
    });

    it('指定的脚手架已安装时, fef init 应使用该脚手架创建项目', () => {
      // 安装指定的脚手架
      const packageName = '@feflow/generator-example';
      const edition = '0.0.7';
      shell.exec(`node bin/feflow install ${packageName}@${edition}`);

      // 测试脚手架是否安装成功
      const isInstallSuccPattern = new RegExp(
        `templates\\n*${packageName}\\(${edition}\\)\\n*plugins\\s*\\n*No plugins have been installed\\n*`,
      );
      assert.match(shell.exec(`node bin/feflow list`).stdout, isInstallSuccPattern);

      // 执行 fef init --generator 指定的脚手架
      const expectedPattern = new RegExp(`E2E: 使用${packageName}脚手架创建项目\\s*`);
      assert.match(shell.exec(`node bin/feflow init --generator=${packageName}`).stdout, expectedPattern);
    });
  });

  describe('fef init 未使用参数指定脚手架', () => {
    it('未安装任何脚手架时, fef init 应该正常执行并且有提示信息返回', () => {
      const expectPattern =
        /You have not installed a template yet,  please use install command\. Guide: https:\/\/github\.com\/Tencent\/feflow\s*/;
      assert.match(shell.exec('node bin/feflow init').stdout, expectPattern);
    });
  });
});
