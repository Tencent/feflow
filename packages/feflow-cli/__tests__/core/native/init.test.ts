import shell from 'shelljs';
import chai from 'chai';

const { expect } = chai;

describe('@feflow/core - Native init', () => {
  beforeEach(() => {
    shell.exec('rm -rf .fef');
  });

  describe('fef init 使用参数指定脚手架', () => {
    it('未安装指定的脚手架时, fef init 应提示是否安装使用该脚手架', () => {
      const packageName = '@feflow/generator-example';
      const expectContent = `E2E: ${packageName}未安装，是否要安装使用？\n`;
      expect(shell.exec(`node bin/feflow init --generator=${packageName} --e2e`).stdout).to.equal(expectContent);
    });

    it('指定的脚手架已安装时, fef init 应使用该脚手架创建项目', () => {
      // 安装指定的脚手架
      const packageName = '@feflow/generator-example';
      const edition = '0.0.7';
      shell.exec(`node bin/feflow install ${packageName}@${edition} --e2e`);

      // 测试脚手架是否安装成功
      const listExpectContent = `You can search more templates or plugins through https://feflowjs.com/encology/\ntemplates\n${packageName}(${edition})\nplugins\nNo plugins have been installed\n`;
      expect(shell.exec(`node bin/feflow list --e2e`).stdout).to.equal(listExpectContent);

      // 执行 fef init --generator 指定的脚手架
      const expectContent = `E2E: 使用@feflow/generator-example脚手架创建项目\n`;
      expect(shell.exec(`node bin/feflow init --generator=${packageName} --e2e`).stdout).to.equal(expectContent);
    });
  });

  describe('fef init 未使用参数指定脚手架', () => {
    it('未安装任何脚手架时, fef init 应该正常执行并且有提示信息返回', () => {
      const expectContent =
        'You have not installed a template yet,  please use install command. Guide: https://github.com/Tencent/feflow\n';
      expect(shell.exec('node bin/feflow init --e2e').stdout).to.equal(expectContent);
    });

    it('脚手架不为空时, fef init 的输出信息中应包含这些脚手架', () => {
      // 安装脚手架
      const packageName = '@feflow/generator-example';
      const edition = '0.0.7';
      shell.exec(`node bin/feflow install ${packageName}@${edition} --e2e`);

      // 测试脚手架是否安装成功
      const listExpectContent = `You can search more templates or plugins through https://feflowjs.com/encology/\ntemplates\n${packageName}(${edition})\nplugins\nNo plugins have been installed\n`;
      expect(shell.exec(`node bin/feflow list --e2e`).stdout).to.equal(listExpectContent);

      // 测试 fef init 的输出信息中是否包含该脚手架
      const expectContent = "E2E: 您想要创建哪种类型的工程? [ 'Feflow example template' ]\n";
      expect(shell.exec(`node bin/feflow init --e2e`).stdout).to.equal(expectContent);
    });
  });
});
