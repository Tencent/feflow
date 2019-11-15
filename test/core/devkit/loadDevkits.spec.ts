import chai from "chai";
import loadDevkits, {
  getDivkitConifgInfo,
  getKitJson
} from "../../../lib/core/devkit/loadDevkits";
import Command from "../../../lib/core/commander";

import path from "path";
const should = chai.should();
const expect = chai.expect;

describe("@feflow/core - devkit load devkit Unit Test", () => {
  let filePath: string;
  let ctx: any;
  let globalTargetConifg: object;
  let globalTargetKitConfig: object;
  let builderStr: string;
  let devkitFunctionResult: string;
  let configPath: string;

  before(() => {
    builderStr = "test_devkit_modules:dev";

    // config files path with mock
    configPath = "../../files";

    // the result of devkit function
    devkitFunctionResult = "this is test_devkit_modules";

    // project config
    globalTargetConifg = {
      devkit: {
        commands: {
          dev: {
            builder: builderStr,
            options: {}
          }
        }
      }
    };

    // mock feflow
    ctx = { logger: { debug: () => {} } };

    // feflow devkit config
    // test_devkit_modules
    globalTargetKitConfig = {
      builders: {
        dev: {
          implementation: "./dev",
          description:
            "Build a server app and a browser app, then render the index.html and use it for the browser output."
        }
      }
    };
  });

  it("getDivkitConifgInfo(directoryPath: string, builderStr: string) - get devkit config", () => {
    filePath = path.resolve(__dirname, configPath);
    const { configData, directoryPath } = getDivkitConifgInfo(ctx, filePath);
    expect(configData).to.deep.equal(globalTargetConifg);
    expect(directoryPath).to.be.eq(filePath);
  });

  it("getKitJson(directoryPath: string, builderStr: string) - get project devkit config", () => {
    filePath = path.resolve(__dirname, configPath);
    const { kitJson, pkgPath } = getKitJson(filePath, builderStr);
    expect(kitJson).to.deep.equal(globalTargetKitConfig);
    expect(pkgPath).to.be.eq(
      path.resolve(__dirname, "../../files/node_modules/test_devkit_modules")
    );
  });

  it("loadDevkits(ctx: Feflow) - load devkit", () => {
    ctx = { logger: { debug: () => {} }, commander: new Command() };
    filePath = path.resolve(__dirname, configPath);
    loadDevkits(ctx, filePath);
    expect(ctx.commander.get("dev")).should.exist;
    expect(ctx.commander.get("dev")()).to.eq(devkitFunctionResult);
  });
});
