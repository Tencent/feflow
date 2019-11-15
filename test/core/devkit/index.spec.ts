import chai from "chai";
import DevkitConfig from "../../../lib/core/devkit/config";
import path from "path";
const should = chai.should();
const expect = chai.expect;

describe("@feflow/core - devkit Unit Test", () => {
  let filePath = "";
  let ctx: object;
  let globalTargetConifg: object;

  before(() => {
    globalTargetConifg = {
      devkit: {
        commands: {
          dev: {
            builder: "test_devkit_modules:dev",
            options: {}
          }
        }
      }
    };
    ctx = { logger: { debug: () => {} } };
  });

  it("loadConfigFile(filePath) - read devkit config, .js", () => {
    filePath = path.resolve(__dirname, "../../files/.feflowrc.js");
    const conig = new DevkitConfig(ctx);
    const _config = conig.loadConfigFile(filePath);
    expect(_config).should.exist;
    expect(_config).to.deep.equal(globalTargetConifg);
  });

  it("loadConfigFile(filePath) - read devkit config, .yaml", () => {
    filePath = path.resolve(__dirname, "../../files/.feflowrc.yaml");
    const conig = new DevkitConfig(ctx);
    const _config = conig.loadConfigFile(filePath);
    expect(_config).should.exist;
    expect(_config).to.deep.equal(globalTargetConifg);
  });

  it("loadConfigFile(filePath) - read devkit config, .json", () => {
    filePath = path.resolve(__dirname, "../../files/.feflowrc.json");
    const conig = new DevkitConfig(ctx);
    const _config = conig.loadConfigFile(filePath);
    expect(_config).should.exist;
    expect(_config).to.deep.equal(globalTargetConifg);
  });

  it("loadConfigFile(filePath) - read devkit config, .yml", () => {
    filePath = path.resolve(__dirname, "../../files/.feflowrc.yml");
    const conig = new DevkitConfig(ctx);
    const _config = conig.loadConfigFile(filePath);
    expect(_config).should.exist;
    expect(_config).to.deep.equal(globalTargetConifg);
  });

  it("loadConfigFile(filePath) - read devkit config, no ext", () => {
    filePath = path.resolve(__dirname, "../../files/.feflowrc");
    const conig = new DevkitConfig(ctx);
    const _config = conig.loadConfigFile(filePath);
    expect(_config).should.exist;
    expect(_config).to.deep.equal(globalTargetConifg);
  });

  it("loadConfigFile(filePath) - read devkit config, package.json", () => {
    filePath = path.resolve(__dirname, "../../files/package.json");
    const conig = new DevkitConfig(ctx);
    const _config = conig.loadConfigFile(filePath);
    expect(_config).should.exist;
    expect(_config).to.deep.equal(globalTargetConifg);
  });

  it("getConfigDirectory(pwdPath), no params", () => {
    const conig = new DevkitConfig(ctx);
    const configPath = conig.getConfigDirectory();
    expect(configPath).should.exist;
    expect(configPath).to.be.eq(process.cwd());
  });

  it("getConfigDirectory(pwdPath), function with params", () => {
    const conig = new DevkitConfig(ctx);
    const testConfigPath = path.resolve(__dirname, "../../files");
    const configPath = conig.getConfigDirectory(testConfigPath);
    expect(configPath).should.exist;
    expect(configPath).to.be.eq(path.resolve(__dirname, "../../files"));
  });

  it("loadConfig(), no params", () => {
    const conig = new DevkitConfig(ctx);
    const _config = conig.loadConfig();
    expect(_config).should.exist;
    expect(_config).to.be.empty;
  });

  it("loadConfig(), with params", () => {
    let configPath = path.resolve(__dirname, "../../files");
    const conig = new DevkitConfig(ctx);
    const _config = conig.loadConfig(configPath);
    expect(_config).should.exist;
    expect(_config).to.deep.equal(globalTargetConifg);
  });
});
